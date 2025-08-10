import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import session from "express-session";
import flash from "connect-flash";
import dotenv from "dotenv";


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









// app.get('/home', (req, res) => {
//     res.render(path.join(__dirname, "/views/home.ejs"), { movies: [] });  // Render the EJS page with an empty array (no results)
// });




// --- Mount Routers ---
// The order can matter if routes are similar, but these are distinct.
app.use('/', pageRoutes);      // Handles /, /contact, etc.
app.use('/', authRoutes);      // Handles /login, /signup
app.use('/', movieRoutes);     // Handles /home, /movies
app.use('/', userRoutes);      // Handles /profile
app.use('/admin', adminRoutes); // Handles all routes prefixed with /admin












app.listen(port,()=>{
    console.log(`the server is running on ${port}`);
});