import { db } from "../db.js";

// Fetches the current list of trending movies
export const getTrending = async () => {
    const query = `
        SELECT tm.id, m.title, m.genre, m.description, m.release_year, tm.image_url, m.id as movie_id
        FROM trendingmovies tm
        JOIN movies m ON tm.movie_id = m.id`;
    // We use .promise() to make the database call async/await compatible
    const [rows] = await db.promise().query(query);
    return rows;
};

// Fetches all movies in the user's "My List"
export const getMyList = async () => {
    const query = `
        SELECT my_list.id, my_list.movie_id, movies.title, movies.genre, movies.image_path
        FROM my_list
        JOIN movies ON my_list.movie_id = movies.id`;
    const [rows] = await db.promise().query(query);
    return rows;
};

// Fetches all movies from the database
export const getAll = async () => {
    const [rows] = await db.promise().query("SELECT * FROM movies");
    return rows;
};

// Searches for movies by title
export const searchByTitle = async (titleQuery) => {
    const sql = 'SELECT * FROM movies WHERE LOWER(title) LIKE ?';
    const [rows] = await db.promise().query(sql, [`%${titleQuery.toLowerCase()}%`]);
    return rows;
};

// Adds a movie to the user's list
export const addToList = async (movieId) => {
    const [existing] = await db.promise().query("SELECT * FROM my_list WHERE movie_id = ?", [movieId]);
    if (existing.length > 0) {
        // This allows the controller to catch a specific error
        throw new Error('Movie already in list');
    }
    await db.promise().query("INSERT INTO my_list (movie_id) VALUES (?)", [movieId]);
    return true;
};

// Removes a movie from the user's list
export const removeFromList = async (movieId) => {
    const [result] = await db.promise().query("DELETE FROM my_list WHERE movie_id = ?", [movieId]);
    if (result.affectedRows === 0) {
        throw new Error('Movie not found in list');
    }
    return true;
};

// Fetches the 3 most recently added movies
export const getRecent = async () => {
    const query = `SELECT * FROM movies ORDER BY upload_date DESC LIMIT 3`;
    const [rows] = await db.promise().query(query);
    return rows;
};


// Creates a new movie in the database
export const create = async (movieData) => {
    const { title, genre, description, release_year, image_path, video_path } = movieData;
    const sql = 'INSERT INTO movies (title, genre, description, release_year, image_path, video_path) VALUES (?, ?, ?, ?, ?, ?)';
    // We use .promise() to allow for async/await
    await db.promise().execute(sql, [title, genre, description, release_year, image_path, video_path]);
    return true;
};

// Deletes a movie from the database by its ID
export const deleteById = async (movieId) => {
    await db.promise().execute('DELETE FROM movies WHERE id = ?', [movieId]);
    return true;
};

// Replaces a trending movie by deleting the old one and inserting the new one
export const replaceTrending = async (oldMovieId, newMovieData) => {
    const { new_movie_id, start_date, end_date, image_url } = newMovieData;

    // A transaction ensures both queries must succeed, or neither will.
    const connection = await db.promise().getConnection();
    await connection.beginTransaction();
    try {
        await connection.execute('DELETE FROM trendingmovies WHERE movie_id = ?', [oldMovieId]);
        await connection.execute(
            'INSERT INTO trendingmovies (movie_id, start_date, end_date, image_url) VALUES (?, ?, ?, ?)',
            [new_movie_id, start_date, end_date, image_url]
        );
        await connection.commit(); // Finalize the transaction
    } catch (error) {
        await connection.rollback(); // Undo the transaction on error
        throw error; // Pass the error to the controller
    } finally {
        connection.release(); // Release the connection back to the pool
    }
    return true;
};