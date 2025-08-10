# Cinematica - An OTT Platform Project 🎬

Cinematica is a full-featured web application built with Node.js and Express, designed to replicate the core functionalities of a modern OTT (Over-the-Top) streaming service. This project demonstrates a robust backend architecture using the Model-View-Controller (MVC) pattern for clean, scalable, and maintainable code.



---
## ## Features

* ✅ **User Authentication:** Secure user registration, login, and session management.
* ✅ **Password Security:** Passwords are fully hashed using **bcrypt** for secure storage.
* ✅ **Content Browse:** Users can browse a catalog of movies, view trending content, and see their personal list.
* ✅ **Dynamic "My List":** Users can add or remove movies from a personalized "My List."
* ✅ **Movie Search:** Real-time API-driven search functionality to find movies by title.
* ✅ **User Profile Management:** Users can view their profile and delete their account.
* ✅ **Admin Panel:** A dedicated dashboard for administrators to manage the movie catalog:
    * Add new movies.
    * Delete existing movies.
    * Manage the "Trending Movies" section.
* ✅ **MVC Architecture:** A well-organized codebase with separated concerns for Models, Views, and Controllers.

---
## ## Tech Stack

* **Backend:** Node.js, Express.js
* **View Engine:** EJS (Embedded JavaScript templates)
* **Database:** MySQL
* **Authentication:** bcrypt.js, express-session, connect-flash
* **Development:** nodemon for live server reloading
* **Environment:** dotenv for managing environment variables

---
## ## Project Structure

The project follows a clean MVC (Model-View-Controller) architecture to ensure separation of concerns.

```
cinematica/
├── node_modules/
├── public/                // Static assets (CSS, JS, images)
├── views/                 // EJS templates for the UI
├── routes/                // Defines URL endpoints
│   ├── authRoutes.js
│   ├── movieRoutes.js
│   ├── userRoutes.js
│   └── adminRoutes.js
├── controllers/           // Handles application logic
│   ├── authController.js
│   ├── movieController.js
│   ├── userController.js
│   └── adminController.js
├── models/                // Handles all database interactions
│   ├── User.js
│   └── Movie.js
├── .env                   // Environment variables (you must create this)
├── .gitignore
├── app.js                 // Main server file
├── db.js                  // Database connection setup
├── package.json
└── schema.sql             // SQL script to set up the database schema
```

---
## ## Prerequisites

Before you begin, ensure you have the following installed on your system:
* [Node.js](https://nodejs.org/) (which includes npm)
* A running instance of a [MySQL](https://www.mysql.com/) server

---
## ## Installation & Setup

Follow these steps to get the project running on your local machine.

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/cinematica.git](https://github.com/your-username/cinematica.git)
    cd cinematica
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up the database:**
    * Start your MySQL server.
    * Create a new database (e.g., `cinematica_db`).
    * Run the `schema.sql` file provided in the repository to create the necessary tables. You can do this via a tool like MySQL Workbench or the command line:
        ```bash
        mysql -u your_mysql_user -p cinematica_db < schema.sql
        ```

4.  **Create the environment file:**
    * Create a new file named `.env` in the root of the project.
    * Copy the content from the example below and fill in your database credentials.

5.  **Start the server:**
    ```bash
    npm start
    ```
    The application should now be running at `http://localhost:3000`.

---
## ## Environment Variables

You must create a `.env` file in the project root and add the following variables. This file is ignored by Git for security.

```ini
# .env.example - Copy this into a new .env file

# Server Port
PORT=3000

# Database Connection
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=cinematica_db

# Express Session
SESSION_SECRET=a_very_secret_and_long_random_string_for_security
```

---
## ## License

Distributed under the MIT License. See `LICENSE` for more information.

---
## ## Contact

Raghavendra K - iamraghu2003@gmail.com

Project Link: [https://github.com/Raghu9855/Cinematica](https://github.com/Raghu9855/Cinematica)