import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import session from "express-session";
import flash from "connect-flash";
import bcrypt from "bcryptjs";
import { db } from "./db.js";
import dotenv from "dotenv";
import crypto from 'crypto';
// In app.js
import authRoutes from './routes/authRoutes.js';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
// Middleware to parse form data


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
    secret:  process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true}
}));
app.use(flash());
app.set("view engine", "ejs");



// In app.js
app.use('/', authRoutes); // You can also use a prefix like app.use('/auth', authRoutes)

app.get("/", (req, res) => {
    // Serve the loader.html page
    res.sendFile(path.join(__dirname, "/public/loader.html"));
});



app.get("/home", (req, res) => {
    const email = req.query.email; 

    if (!email) {
        return res.redirect("/login");
    }

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (result.length === 0) {
            return res.redirect("/login");
        }

        const user = result[0];

        db.query(`
            SELECT tm.id, m.title, m.genre, m.description, m.release_year, tm.start_date, tm.end_date, tm.image_url
            FROM trendingmovies tm
            JOIN movies m ON tm.movie_id = m.id
            WHERE tm.image_url = m.image_path
        `, (err, trendingmovies) => {
            if (err) {
                console.error('Error fetching trending movies:', err);
                return res.status(500).send('Internal Server Error');
            }

            db.query(`
                SELECT my_list.id, my_list.movie_id, movies.title, movies.genre, movies.image_path
                FROM my_list
                JOIN movies ON my_list.movie_id = movies.id
            `, (err, mylist) => {
                if (err) {
                    console.error('Error fetching my list:', err);
                    return res.status(500).send('Internal Server Error');
                }

                res.render(path.join(__dirname, "/views/home.ejs"), {
                    trendingmovies: trendingmovies,
                    mylist: mylist,
                    user
                });
            });
        });
    });
});






app.get("/movies", (req, res) => {
    const email = req.query.email;

    if (!email) {
        return res.redirect("/login");
    }

    // Fetch user data based on email
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (result.length === 0) {
            return res.redirect("/login");
        }

        const user = result[0];

        // Fetch the list of movies
        db.query('SELECT * FROM movies', (err, movies) => {
            if (err) {
                console.error('Error fetching movies:', err);
                return res.status(500).send('Internal Server Error');
            }

            // Render the movies page with the user data and movie list
            res.render('movies', { // Correctly reference the 'movies.ejs' view
                movies: movies,
                user: user // Pass user data to the view
            });
        });
    });
});











app.get('/home', (req, res) => {
    res.render(path.join(__dirname, "/views/home.ejs"), { movies: [] });  // Render the EJS page with an empty array (no results)
});


app.get("/search",(req,res)=>{
    db.query('SELECT * FROM movies', (err, movies) => {
        if (err) throw err;
        res.render(__dirname +"/views/movies.ejs",{ movies });
    });
});



// Route to fetch movies based on the search query
app.get('/api/movies', (req, res) => {
    const query = req.query.search.trim().toLowerCase();

    if (query) {
        // Query to search for movies by title (case-insensitive)
        const sql = 'SELECT * FROM movies WHERE LOWER(title) LIKE ?';
        db.query(sql, [`%${query}%`], (err, results) => {
            if (err) {
                console.error('Error fetching movies:', err);
                res.status(500).send('Server Error');
                return;
            }

            // Send the results as JSON
            res.json(results);
        });
    } else {
        res.status(400).send('Search query is required');
    }
});

// GET route to confirm deletion (user is authenticated by token or some other method)
app.get('/deleteaccount', (req, res) => {
    // The user needs to enter their email and password again on the delete account page
    res.render(__dirname+"/views/daccount.ejs");
});

app.post('/deleteaccount', async (req, res) => {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
        req.flash('error', 'Both email and password are required.');
        return res.redirect('/deleteaccount'); // Redirect back to the delete account page if missing
    }

    try {
        // Check if user exists in the database
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
            if (err) {
                req.flash('error', 'Error checking account: ' + err.message);
                return res.redirect('/home');
            }

            if (result.length === 0) {
                req.flash('error', 'No account found with the specified email.');
                return res.redirect('/home');
            }

            const user = result[0];

            // Compare the provided password with the hashed password
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                req.flash('error', 'Invalid password. Please try again.');
                return res.redirect('/deleteaccount');
            }

            // Proceed to delete the account if email and password match
            db.query('DELETE FROM users WHERE email = ?', [email], (err, deleteResult) => {
                if (err) {
                    req.flash('error', 'Error deleting account: ' + err.message);
                    return res.redirect('/home');
                }

                req.flash('success', 'Account deleted successfully!');
                return res.redirect('/signup'); // Redirect to signup or login page after account deletion
            });
        });
    } catch (error) {
        req.flash('error', 'Server error occurred: ' + error.message);
        res.redirect('/home');
    }
});

// Add movie to list
app.post('/add-to-list', (req, res) => {
    const { movieId } = req.body; // Movie ID from the button click
  
    // Check if the movie is already in the list
    db.query(
      'SELECT * FROM my_list WHERE movie_id = ?',
      [movieId],
      (err, results) => {
        if (err) {
          console.error('Error checking movie existence:', err);
          return res.status(500).send('Database error');
        }

        if (results.length > 0) {
          return res.status(400).send('Movie already in list');
        }

        // If the movie is not in the list, add it
        const query = 'INSERT INTO my_list (movie_id) VALUES (?)';
        db.query(query, [movieId], (err, result) => {
          if (err) {
            console.error('Error adding movie to list:', err);
            return res.status(500).send('Database error');
          }
          res.redirect('/home'); // Redirect to home page after adding
        });
      }
    );
});
app.post('/remove-from-list', (req, res) => {
    const { movieId } = req.body;
    console.log('Received movieId:', movieId);  // Log the received movieId for debugging

    // First, query to check if the movie exists in the list
    db.query(
        'SELECT * FROM my_list WHERE movie_id = ?',
        [movieId],
        (err, results) => {
            if (err) {
                console.error('Error checking movie existence:', err);
                return res.status(500).send('Database error');
            }

            if (results.length === 0) {
                // If the movie is not found in the list, return error
                return res.status(400).json({ success: false, message: 'Movie not found in list' });
            }

            // Movie exists, now remove it from the list
            db.query('DELETE FROM my_list WHERE movie_id = ?', [movieId], (err, result) => {
                if (err) {
                    console.error('Error removing movie:', err);
                    return res.status(500).json({ success: false, message: 'Error removing movie from list' });
                }

                res.redirect('/home'); 
            });
        }
    );
});


// Route to get recent movies
app.get('/api/recent-movies', (req, res) => {
    const query = `
        SELECT id, title, genre, description, release_year, image_path, video_path
        FROM movies
        ORDER BY upload_date DESC
        LIMIT 3
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching recent movies:', err);
            return res.status(500).json({ error: 'Failed to fetch movies' });
        }
        res.json(results);
    });
});

app.get('/profile', (req, res) => {
    const email = req.query.email; // Get email from query params

    // If email is missing from query params
    if (!email) {
        return res.status(400).send('Email is required');
    }

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length === 0) {
            return res.status(404).send('User not found');
        }

        const user = results[0]; // The first user record

        // Pass 'user' data (including email and username) to the template
        res.render('profile', { user });
    });
});








app.post('/update-profile', async (req, res) => {
    const { email, username } = req.body;

    try {
        // Update username in the database based on the user's email
        const query = 'UPDATE users SET username = ? WHERE email = ?';
        db.query(query, [username, email]);

        // Redirect to the profile page with a success message
        res.redirect(`/profile?email=${email}`);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).send('Server Error: Could not update profile');
    }
});

// Route to add a movie
app.post('/admin/add-movie', (req, res) => {
    const { title, genre, description, release_year, image_path, video_path } = req.body;
  
    db.execute('INSERT INTO movies (title, genre, description, release_year, image_path, video_path) VALUES (?, ?, ?, ?, ?, ?)',
      [title, genre, description, release_year, image_path, video_path], (err, result) => {
        if (err) return res.send('Error adding movie');
        res.redirect('/admin');
      });
  });
  
  app.post('/admin/replace-trending', (req, res) => {
    const { old_movie_id, new_movie_id, start_date, end_date, image_url } = req.body;

    console.log('Old Movie ID:', old_movie_id); // Log the old movie ID
    console.log('New Movie ID:', new_movie_id); // Log the new movie ID

    // First, delete the old movie from the trendingmovies table
    db.execute('DELETE FROM trendingmovies WHERE movie_id = ?', [old_movie_id], (err, result) => {
        if (err) {
            console.log(err); // Log the error to the console
            return res.send('Error removing old trending movie');
        }

        // Then, insert the new movie as a trending movie
        db.execute('INSERT INTO trendingmovies (movie_id, start_date, end_date, image_url) VALUES (?, ?, ?, ?)', 
        [new_movie_id, start_date, end_date, image_url], (err, result) => {
            if (err) {
                console.log(err); // Log the error to the console
                return res.send('Error adding new trending movie');
            }

            res.redirect('/admin'); // Redirect to the admin dashboard if successful
        });
    });
});

  
  // Route to delete a movie
  app.get('/admin/delete-movie/:id', (req, res) => {
    const movieId = req.params.id;
  
    db.execute('DELETE FROM movies WHERE id = ?', [movieId], (err, result) => {
      if (err) return res.send('Error deleting movie');
      res.redirect('/admin');
    });
  });
  
  app.get('/admin', (req, res) => {
    // Fetch all the current trending movies
    db.execute('SELECT * FROM trendingmovies', (err, result) => {
        if (err) {
            console.log(err); // Log the error to the console
            return res.send('Error fetching trending movies');
        }

        // Assuming you have a 'movies' table to get the movie details like titles
        db.execute('SELECT * FROM movies', (err, moviesResult) => {
            if (err) {
                console.log(err); // Log the error to the console
                return res.send('Error fetching movie details');
            }

            // Pass both trendingMovies and allMovies to the EJS template
            res.render('admin', {
                trendingMovies: result,  // The list of currently trending movies
                movies: moviesResult      // The list of all movies to choose from for replacement
            });
        });
    });
});
  
app.get("/contact",(req,res)=>{
    res.render(__dirname +"/views/contact.ejs");
});

app.get("/subscription",(req,res)=>{
    res.render(__dirname +"/views/subscription.ejs");
});
app.get("/qr",(req,res)=>{
    res.render(__dirname +"/views/qr.ejs");
});

app.get("/logout",(req,res)=>{
    res.render(__dirname+"/views/login.ejs");
})


app.listen(port,()=>{
    console.log(`the server is running on ${port}`);
});