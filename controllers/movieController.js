import * as Movie from '../models/Movie.js';
import * as User from '../models/User.js';

// Renders the main home page.
export const showHomePage = async (req, res) => {
    const email = req.query.email;
    if (!email) {
        return res.redirect("/login");
    }

    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return res.redirect("/login");
        }

        // Use the model to get all data in parallel for efficiency
        const [trendingMovies, myList] = await Promise.all([
            Movie.getTrending(),
            Movie.getMyList() // In a real app, you'd pass a user ID here
        ]);

        res.render("home", {
            trendingmovies: trendingMovies,
            mylist: myList,
            user
        });
    } catch (error) {
        console.error('Error fetching home page data:', error);
        res.status(500).send("Internal Server Error");
    }
};

// Renders the page that shows all available movies.
export const showAllMovies = async (req, res) => {
    try {
        const movies = await Movie.getAll();
        res.render('movies', { movies });
    } catch (error) {
        console.error('Error fetching all movies:', error);
        res.status(500).send("Internal Server Error");
    }
};

// Renders the search page.
export const showSearchPage = async (req, res) => {
    // This function can just reuse the logic for showing all movies
    await showAllMovies(req, res);
};

// Handles the API request for searching movies and returns JSON.
export const searchMoviesAPI = async (req, res) => {
    const query = req.query.search;
    if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
    }
    try {
        const results = await Movie.searchByTitle(query);
        res.json(results);
    } catch (error) {
        console.error('Error in movie search API:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

// Handles adding a movie to a user's personal list.
export const addMovieToList = async (req, res) => {
    try {
        await Movie.addToList(req.body.movieId);
        res.redirect('back'); // Redirects the user to the page they came from
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// Handles removing a movie from a user's personal list.
export const removeMovieFromList = async (req, res) => {
    try {
        await Movie.removeFromList(req.body.movieId);
        res.redirect('back');
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// Handles the API request for recent movies and returns JSON.
export const getRecentMoviesAPI = async (req, res) => {
    try {
        const recentMovies = await Movie.getRecent();
        res.json(recentMovies);
    } catch (error) {
        console.error('Error fetching recent movies:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};