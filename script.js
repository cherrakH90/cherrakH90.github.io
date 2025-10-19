<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cherrak Infinity ♾️</title>
  <style>
    body {
      font-family: 'Poppins', sans-serif;
      background: linear-gradient(135deg, #000, #1a1a1a);
      color: white;
      margin: 0;
      padding: 0;
      text-align: center;
    }
    header {
      background: #111;
      padding: 20px;
      font-size: 24px;
      letter-spacing: 1px;
      font-weight: bold;
    }
    #apps {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      padding: 20px;
    }
    .card {
      background: #222;
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 4px 10px rgba(255,255,255,0.1);
      transition: 0.3s;
    }
    .card:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 14px rgba(255,255,255,0.2);
    }
    img {
      width: 100px;
      border-radius: 20%;
    }
    .app-title {
      font-size: 18px;
      margin: 10px 0 5px 0;
    }
    .app-desc {
      font-size: 14px;
      opacity: 0.8;
    }
  </style>
</head>
<body>

  <header>🌐 Cherrak Infinity ♾️ — Smart Global System</header>

  <div id="apps">Loading popular apps...</div>

  <script>
    // ⚙️ هذا مثال لجلب بيانات تطبيقات من Google Play عبر واجهة خارجية عامة (بدون خرق قانوني)
    const appsContainer = document.getElementById('apps');

    async function getApps() {
      try {
        // واجهة عامة مجانية لجلب بيانات تطبيقات
        const response = await fetch('https://api.apptica.com/package/top_chart/142?country=us&category=APPLICATION', {
          headers: { 'Authorization': 'Bearer demo_key' }
        });

        const data = await response.json();

        appsContainer.innerHTML = '';
        data.data.slice(0, 10).forEach(app => {
          const card = document.createElement('div');
          card.classList.add('card');
          card.innerHTML = `
            <img src="${app.icon}" alt="${app.name}">
            <div class="app-title">${app.name}</div>
            <div class="app-desc">${app.publisher_name}</div>
          `;
          appsContainer.appendChild(card);
        });

      } catch (error) {
        appsContainer.innerHTML = '❌ خطأ في جلب البيانات.';
        console.error(error);
      }
    }
