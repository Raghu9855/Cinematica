import * as Movie from '../models/Movie.js'; // The admin panel primarily uses the Movie model

// Renders the main admin dashboard
export const showDashboard = async (req, res) => {
    try {
        // Use Promise.all to fetch data concurrently for better performance
        const [trendingMovies, allMovies] = await Promise.all([
            Movie.getTrending(),
            Movie.getAll() // Reusing the model function we created earlier
        ]);

        res.render('admin', {
            trendingMovies: trendingMovies,
            movies: allMovies
        });
    } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
        res.status(500).send('Error fetching admin data');
    }
};

// Handles adding a new movie
export const addMovie = async (req, res) => {
    try {
        // The controller's job is to pass the data to the model
        await Movie.create(req.body);
        res.redirect('/admin');
    } catch (error) {
        console.error('Error adding movie:', error);
        res.status(500).send('Error adding movie');
    }
};

// Handles replacing a trending movie
export const replaceTrendingMovie = async (req, res) => {
    try {
        const { old_movie_id, ...newMovieData } = req.body;
        await Movie.replaceTrending(old_movie_id, newMovieData);
        res.redirect('/admin');
    } catch (error) {
        console.error('Error replacing trending movie:', error);
        res.status(500).send('Error replacing trending movie');
    }
};

// Handles deleting a movie
export const deleteMovie = async (req, res) => {
    try {
        const movieId = req.params.id;
        await Movie.deleteById(movieId);
        res.redirect('/admin');
    } catch (error) {
        console.error('Error deleting movie:', error);
        res.status(500).send('Error deleting movie');
    }
};