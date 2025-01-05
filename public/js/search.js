document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("searchButton");
    const movieSearch = document.getElementById("movieSearch");
    const searchResults = document.getElementById("searchResults");

    // Handle the click event on the search button (optional)
    searchButton.addEventListener("click", async () => {
        const query = movieSearch.value.trim().toLowerCase();
        searchResults.innerHTML = ""; // Clear previous results

        if (query) {
            try {
                // Fetch movies from the backend using the search query
                const response = await fetch(`/api/movies?search=${encodeURIComponent(query)}`);
                const movies = await response.json();

                // Check if movies are found
                if (movies.length > 0) {
                    movies.forEach(movie => {
                        // Dynamically create the movie card
                        const card = `
                            <div class="col-md-2 mb-2">
                                <div class="card h-100">
                                    <img src="${movie.image_path}" class="card-img-top" alt="${movie.title}">
                                    <div class="card-body">
                                        <h5 class="card-title">${movie.title}</h5>
                                        <p class="card-text">${movie.description}</p>
                                    </div>
                                </div>
                            </div>`;
                        // Append the card to the searchResults div
                        searchResults.innerHTML += card;
                    });
                } else {
                    const card = `
                    <div class="col-md-4 mb-4">
                        <div class="card h-100">
                            <div class="card-body">
                                <p class="card-text text-center text-muted">No movies found.</p>
                            </div>
                        </div>
                    </div>`;
                    searchResults.innerHTML += card;
                }
            } catch (error) {
                console.error('Error fetching movies:', error);
                searchResults.innerHTML = "<p class='text-center text-danger'>Error fetching movies. Please try again later.</p>";
            }
        }
    });

    // Live search functionality (search as the user types)
    movieSearch.addEventListener("input", async () => {
        const query = movieSearch.value.trim().toLowerCase();
        searchResults.innerHTML = ""; // Clear previous results

        if (query) {
            try {
                // Fetch movies from the backend using the search query
                const response = await fetch(`/api/movies?search=${encodeURIComponent(query)}`);
                const movies = await response.json();

                // Check if movies are found
                if (movies.length > 0) {
                    // Filter movies that start with the input letter
                    const filteredMovies = movies.filter(movie => 
                        movie.title.toLowerCase().startsWith(query)
                    );

                    // Display filtered movies
                    if (filteredMovies.length > 0) {
                        filteredMovies.forEach(movie => {
                            // Dynamically create the movie card
                            const card = `
                                <div class="col-md-2 mb-2">
                                    <div class="card h-100">
                                        <img src="${movie.image_path}" class="card-img-top" alt="${movie.title}">
                                        <div class="card-body">
                                            <h5 class="card-title">${movie.title}</h5>
                                            <p class="card-text">${movie.description}</p>
                                        </div>
                                    </div>
                                </div>`;
                            // Append the card to the searchResults div
                            searchResults.innerHTML += card;
                        });
                    } else {
                        const card = `
                        <div class="col-md-4 mb-4">
                            <div class="card h-100">
                                <div class="card-body">
                                    <p class="card-text text-center text-muted">No movies starting with '${query}' found.</p>
                                </div>
                            </div>
                        </div>`;
                        searchResults.innerHTML += card;
                    }
                } else {
                    const card = `
                    <div class="col-md-4 mb-4">
                        <div class="card h-100">
                            <div class="card-body">
                                <p class="card-text text-center text-muted">No movies found.</p>
                            </div>
                        </div>
                    </div>`;
                    searchResults.innerHTML += card;
                }
            } catch (error) {
                console.error('Error fetching movies:', error);
                searchResults.innerHTML = "<p class='text-center text-danger'>Error fetching movies. Please try again later.</p>";
            }
        }
    });
});
