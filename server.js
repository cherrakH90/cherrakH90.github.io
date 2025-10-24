/**
 * server.js
 * Express server that implements WebAuthn register/login using @simplewebauthn/server
 * Stores users & credentials in Firestore (firebase-admin).
 *
 * WARNING: For production you MUST use HTTPS. This demo is ready to deploy on Render / Railway / DigitalOcean.
 */

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const { generateRegistrationOptions, verifyRegistrationResponse, generateAuthenticationOptions, verifyAuthenticationResponse } = require('@simplewebauthn/server');
const { v4: uuidv4 } = require('uuid');
const admin = require('firebase-admin');

// Initialize Firebase Admin
// Option A: Use service account JSON. Place serviceAccountKey.json next to this file.
// Option B: Use environment variable GOOGLE_APPLICATION_CREDENTIALS or set credentials in env.
try {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp();
  } else {
    // fallback: service account file
    const serviceAccount = require('./serviceAccountKey.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
} catch (e) {
  console.error('Firebase initialization error:', e);
  process.exit(1);
}

const db = admin.firestore();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || true, // restrict in production to your frontend origin
  credentials: true
}));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'change-me-cherrak-secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true if https
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// RPID and origin — change to your domain when deploying!
const rpName = 'Cherrak Infinity';
const rpID = process.env.RPID || (process.env.HOSTNAME ? process.env.HOSTNAME.replace(/^https?:\/\//, '') : 'localhost');
const origin = process.env.ORIGIN || `http://localhost:${port}`; // change to https://cherrakinfinity.com in prod

console.log('RPID:', rpID, 'origin:', origin);

/**
 * Helpers to store users and credentials in Firestore
 * Structure:
 * collection "users" -> doc userId:
 *   { id, username, displayName }
 * collection "credentials" -> doc credId:
 *   { id, userId, publicKey, counter, transports, credentialID, fmt }
 */

async function findUserByUsername(username) {
  const users = await db.collection('users').where('username', '==', username).limit(1).get();
  if (users.empty) return null;
  return { id: users.docs[0].id, ...users.docs[0].data() };
}

async function createUser(username, displayName) {
  const id = uuidv4();
  await db.collection('users').doc(id).set({ username, displayName, createdAt: Date.now() });
  return { id, username, displayName };
}

async function saveCredential(userId, cred) {
  // cred: object returned from simplewebauthn verification result (credentialPublicKey, credentialID, counter, fmt)
  const id = cred.credentialID.toString('base64') || uuidv4();
  const doc = {
    id,
    userId,
    credentialPublicKey: Buffer.from(cred.credentialPublicKey || cred.publicKey || '').toString('base64'),
    credentialID: Buffer.from(cred.credentialID || '').toString('base64'),
    counter: cred.counter || 0,
    fmt: cred.fmt || '',
    transports: cred.transports || []
  };
  await db.collection('credentials').doc(id).set(doc);
  return doc;
}

async function getCredentialsByUser(userId) {
  const q = await db.collection('credentials').where('userId', '==', userId).get();
  return q.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function getCredentialByIDBase64(base64Id) {
  const docs = await db.collection('credentials').where('credentialID', '==', base64Id).limit(1).get();
  if (docs.empty) return null;
  return { id: docs.docs[0].id, ...docs.docs[0].data() };
}

// ROUTES

// 1) Generate registration options (challenge)
app.post('/register/options', async (req, res) => {
  try {
    const { username, displayName } = req.body;
    if (!username) return res.status(400).json({ error: 'username required' });

    // find or create user
    let user = await findUserByUsername(username);
    if (!user) user = await createUser(username, displayName || username);

    // get existing credentials to exclude
    const existingCreds = await getCredentialsByUser(user.id);
    const excludeCredentials = existingCreds.map(c => ({
      id: Buffer.from(c.credentialID, 'base64'),
      type: 'public-key',
      transports: c.transports || []
    }));

    const opts = generateRegistrationOptions({
      rpName,
      rpID,
      userID: user.id,
      userName: user.username,
      userDisplayName: user.displayName || user.username,
      timeout: 60000,
      attestationType: 'direct',
      excludeCredentials,
      authenticatorSelection: {
        residentKey: 'discouraged',
        userVerification: 'preferred'
      },
      supportedAlgorithmIDs: [-7, -257]
    });

    // store challenge in session
    req.session.currentChallenge = opts.challenge;
    req.session.userIdForRegistration = user.id;
    res.json(opts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// 2) Verify registration response
app.post('/register/verify', async (req, res) => {
  try {
    const { body } = req;
    const expectedChallenge = req.session.currentChallenge;
    const userId = req.session.userIdForRegistration;
    if (!expectedChallenge || !userId) return res.status(400).json({ error: 'no challenge or session' });

    const verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID
    });

    if (!verification.verified) {
      return res.status(400).json({ verified: false, error: 'Registration not verified' });
    }

    // save credential
    const { registrationInfo } = verification;
    const saved = await saveCredential(userId, {
      credentialID: registrationInfo.credentialID,
      credentialPublicKey: registrationInfo.credentialPublicKey,
      counter: registrationInfo.counter,
      fmt: registrationInfo.fmt,
      transports: registrationInfo.transports || []
    });

    // success -> mark session logged-in
    req.session.loggedIn = true;
    req.session.userId = userId;

    res.json({ verified: true });
  } catch (err) {
    console.error('verify reg error', err);
    res.status(500).json({ error: 'verify error' });
  }
});

// 3) Generate authentication options (challenge) for login
app.post('/login/options', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: 'username required' });

    const user = await findUserByUsername(username);
    if (!user) return res.status(404).json({ error: 'user not found' });

    const creds = await getCredentialsByUser(user.id);
    const allowCredentials = creds.map(c => ({
      id: Buffer.from(c.credentialID, 'base64'),
      type: 'public-key',
      transports: c.transports || []
    }));

    const opts = generateAuthenticationOptions({
      timeout: 60000,
      allowCredentials,
      userVerification: 'preferred',
      rpID
    });

    req.session.currentChallenge = opts.challenge;
    req.session.usernameForLogin = username;
    res.json(opts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// 4) Verify authentication response
app.post('/login/verify', async (req, res) => {
  try {
    const { body } = req;
    const expectedChallenge = req.session.currentChallenge;
    if (!expectedChallenge) return res.status(400).json({ error: 'no challenge' });

    // find credential by id
    const credIdBase64 = Buffer.from(body.rawId || body.id || '', 'base64').toString('base64'); // normalization
    const credRecord = await getCredentialByIDBase64(Buffer.from(body.rawId || body.id || '', 'base64').toString('base64'));
    if (!credRecord) return res.status(404).json({ error: 'credential not found' });

    const verification = await verifyAuthenticationResponse({
      response: body,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator: {
        credentialPublicKey: Buffer.from(credRecord.credentialPublicKey, 'base64'),
        credentialID: Buffer.from(credRecord.credentialID, 'base64'),
        counter: credRecord.counter || 0
      }
    });

    if (!verification.verified) {
      return res.status(400).json({ verified: false, error: 'Authentication not verified' });
    }

    // update counter
    await db.collection('credentials').doc(credRecord.id).update({ counter: verification.authenticationInfo.newCounter || verification.authenticationInfo.counter || 0 });

    // set session logged in
    req.session.loggedIn = true;
    req.session.userId = credRecord.userId;

    res.json({ verified: true });
  } catch (err) {
    console.error('login verify err', err);
    res.status(500).json({ error: 'verify error', detail: String(err) });
  }
});

// test route
app.get('/session', (req,res) => {
  res.json({ session: req.session });
});

app.listen(port, () => {
  console.log(`Cherrak WebAuthn server listening on ${port}`);
});

