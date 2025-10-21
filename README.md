<!DOCTYPE html>
<html>
<head>
    <title>Cherrak Infinity</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
            line-height: 1.6;
        }

        header {
            background: #505050;
            color: #fff;
            padding-top: 30px;
            min-height: 70px;
            border-bottom: 3px solid #f39c12;
        }

        header a {
            color: #fff;
            text-decoration: none;
            text-transform: uppercase;
            font-size: 16px;
        }

        header ul {
            padding: 0;
            margin: 0;
            list-style: none;
        }

        header li {
            display: inline;
            padding: 0 20px 0 20px;
        }

        header #branding {
            float: left;
        }

        header #branding h1 {
            margin: 0;
        }

        header nav {
            float: right;
            margin-top: 10px;
        }

        header .highlight, header .current a {
            color: #f39c12;
            font-weight: bold;
        }

        header a:hover {
            color: #ccc;
            font-weight: bold;
        }

        #newsletter {
            padding: 15px;
            color: #fff;
            background: #35424a;
        }

        #newsletter h1 {
            float: left;
        }

        #newsletter form {
            float: right;
            margin-top: 15px;
        }

        #newsletter input[type="email"] {
            padding: 4px;
            height: 25px;
            width: 250px;
        }

        .button_1 {
            height: 38px;
            background: #e8491d;
            border: 0;
            padding-left: 20px;
            padding-right: 20px;
            color: #fff;
        }

        #main {
            padding: 20px;
        }

        #sidebar {
            float: right;
            width: 30%;
            padding: 10px;
            margin-top: 10px;
        }

        #sidebar .quote input, #sidebar .quote textarea {
            width: 90%;
            padding: 5px;
        }

        article#main-col {
            float: left;
            width: 65%;
        }

        ul#services {
            padding: 0;
            list-style: none;
        }

        ul#services li {
            padding: 20px;
            border: #ccc solid 1px;
            margin-bottom: 5px;
            background: #e6e6e6;
        }

        footer {
            padding: 20px;
            margin-top: 20px;
            color: #fff;
            background-color: #e8491d;
            text-align: center;
        }

        /* Media Queries */
        @media(max-width: 768px) {
            header #branding,
            header nav,
            header nav li,
            #newsletter h1,
            #newsletter form,
            #main-col,
            #sidebar {
                float: none;
                text-align: center;
                width: 100%;
            }

            header {
                padding-bottom: 20px;
            }

            #newsletter form {
                margin-top: 10px;
            }

            #sidebar {
                margin-top: 20px;
            }
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <div id="branding">
                <h1><span class="highlight">Cherrak</span> Infinity</h1>
            </div>
            <nav>
                <ul>
                    <li class="current"><a href="index.html">Home</a></li>
                    <li><a href="about.html">About</a></li>
                    <li><a href="services.html">Services</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <section id="newsletter">
        <div class="container">
            <h1>Subscribe To Our Newsletter</h1>
            <form>
                <input type="email" placeholder="Enter Email...">
                <button type="submit" class="button_1">Subscribe</button>
            </form>
        </div>
    </section>

    <section id="main">
        <div class="container">
            <article id="main-col">
                <h1>About Us</h1>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus mi augue, viverra sit amet ultricies at, vulputate id lorem. Nulla facilisi. Integer nec laoreet est. Sed sed augue nec ipsum euismod mattis.
                </p>
                <p>
                    Duis non lorem porttitor, porta libero vitae, feugiat nisl. Duis iaculis ultricies massa, egestas ultricies justo mollis at. Suspendisse non pulvinar nisi. Sed at sapien id justo pulvinar aliquam.
                </p>
            </article>

            <aside id="sidebar">
                <div class="quote">
                    <h3>Get a Quote</h3>
                    <form>
                        <div>
                            <label>Name</label><br>
                            <input type="text" placeholder="Name">
                        </div>
                        <div>
                            <label>Email</label><br>
                            <input type="email" placeholder="Email Address">
                        </div>
                        <div>
                            <label>Message</label><br>
                            <textarea placeholder="Message"></textarea>
                        </div>
                        <button class="button_1" type="submit">Send</button>
                    </form>
                </div>
            </aside>
        </div>
    </section>

    <footer>
        <p>Cherrak Infinity, Copyright &copy; 2024</p>
    </footer>
</body>
</html>
