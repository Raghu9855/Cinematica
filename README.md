# 🎬 Cinematica: My Deep Dive into Building a Streaming App

Hey there! I'm Raghavendra, and welcome to the code behind Cinematica. I've always been fascinated by how streaming services like Netflix work under the hood, so I decided to challenge myself by building one from scratch. This project is the result of that journey.

Cinematica is a full-featured web app built with Node.js and Express. My main goal was to go beyond just making things work and to really focus on building a solid backend. The biggest part of that was refactoring the entire application into the **Model-View-Controller (MVC)** pattern, which taught me a ton about writing clean, scalable, and maintainable code.



---
## ## What This App Can Do

I wanted to build a complete experience, so I packed in all the core features you'd expect from a streaming platform:

* **👤 A Full-Fledged Account System:** Users can sign up for an account, log in, and log out, with sessions managed securely. Of course, all passwords are kept safe and sound by hashing them with **bcrypt**.
* **🍿 Browse and Discover:** A dynamic catalog where users can check out all the available movies, see what's currently trending, and search for their favorites in real-time.
* ❤️ **Your Personal Watchlist:** Every user gets their own "My List" where they can add or remove movies with a single click.
* 🔐 **Secure Account Management:** Users have a personal profile page and the ability to securely delete their account after confirming their password.
* 👑 **An Admin-Only Dashboard:** A special area for administrators to manage the platform's content. They have the power to add new movies, delete existing ones, and even decide which movies appear in the "Trending" section.

---
## ## The Tech I Used to Build It

I chose a modern and robust stack for this project, focusing on technologies that are widely used in the industry.

* **Backend:** Node.js, Express.js
* **Frontend Views:** EJS (Embedded JavaScript templates)
* **Database:** MySQL
* **Security & Sessions:** bcrypt.js, express-session, connect-flash
* **Development Tools:** nodemon (for that sweet auto-reloading server), dotenv

---
## ## How I Organized the Code

One of my biggest goals was to avoid a messy, single-file application. Following the MVC pattern was key to keeping everything organized and sane!

```
cinematica/
├── public/                // My static assets (CSS, JS, images)
├── views/                 // The EJS templates that create the UI
├── routes/                // The "signposts" that define all the URLs
│   ├── authRoutes.js      // Handles login, signup, etc.
│   ├── movieRoutes.js     // For Browse, searching, and "My List"
│   ├── userRoutes.js      // For user profiles and account management
│   ├── adminRoutes.js     // All the admin panel URLs
│   └── pageRoutes.js      // For static pages like contact, etc.
├── controllers/           // The "brains" of the application
│   ├── authController.js
│   ├── movieController.js
│   ├── userController.js
│   ├── adminController.js
│   └── pageController.js
├── models/                // The only part that talks to the database
│   ├── User.js
│   └── Movie.js
├── .env                   // My secret credentials (you'll need to create this!)
├── app.js                 // The main server file that ties everything together
└── schema.sql             // The blueprint for my database
```

---
## ## Getting It Running Yourself

Want to spin this up on your own machine? It's pretty straightforward. Just follow these steps.

#### **You'll Need:**
* Node.js (and npm)
* A running MySQL server

#### **1. Clone This Repo**
First, get the code onto your computer.
```bash
git clone [https://github.com/Raghu9855/Cinematica.git](https://github.com/Raghu9855/Cinematica.git)
cd Cinematica
```

#### **2. Install the Goodies**
Next, install all the project dependencies from `package.json`.
```bash
npm install
```

#### **3. Set Up Your Database**
Time to get the database ready.
1.  In your MySQL client, create a new database (I called mine `cinematica_db`).
2.  Run the `schema.sql` file to automatically create all the tables you'll need.
    ```bash
    mysql -u your_mysql_user -p cinematica_db < schema.sql
    ```

#### **4. Create Your Secret `.env` File**
This project uses a `.env` file to keep sensitive info like database passwords safe.
1.  Create a new file in the project root named `.env`.
2.  Copy and paste the template below into your new file and fill it in with your own database details.

    ```ini
    # My local .env file
    PORT=3000
    DB_HOST=localhost
    DB_USER=your_mysql_user
    DB_PASSWORD=your_mysql_password
    DB_NAME=cinematica_db
    SESSION_SECRET=pick_a_super_long_and_random_secret_string_here
    ```

#### **5. Launch It!**
You're all set. Start the server with this command:
```bash
npm start
```
Your very own Cinematica should now be running at `http://localhost:3000`. Have fun!

---
## ## License

This project is open-source and distributed under the MIT License.

---
## ## Get in Touch

**Raghavendra K** - iamraghu2003@gmail.com

**Project Link:** [https://github.com/Raghu9855/Cinematica](https://github.com/Raghu9855/Cinematica)