window.onload = function() {
    const trendingElement = document.querySelector('.trending');
    if (trendingElement) {
        new Typed('.trending', {
            strings: ['Trending'],
            typeSpeed: 100,
            backSpeed: 100,
            loop: true,
            backDelay: 1000
        });
    }
};


// Fetch recent movies from the API
fetch('/api/recent-movies')
    .then(response => response.json())
    .then(movies => {
        const carouselIndicators = document.getElementById('carouselIndicators');
        const carouselInner = document.getElementById('carouselInner');

        movies.forEach((movie, index) => {
            // Create indicator buttons
            const indicator = document.createElement('button');
            indicator.type = 'button';
            indicator.dataset.bsTarget = '#carouselExampleCaptions';
            indicator.dataset.bsSlideTo = index;
            indicator.className = index === 0 ? 'active' : '';
            indicator.setAttribute('aria-current', index === 0 ? 'true' : '');
            indicator.setAttribute('aria-label', `Slide ${index + 1}`);
            carouselIndicators.appendChild(indicator);

            // Create carousel item
            const carouselItem = document.createElement('div');
            carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;
            carouselItem.innerHTML = `
                <a style="cursor: pointer;" href="#" >
                    <img src="${movie.image_path}" class="d-block w-100" alt="${movie.title}">
                </a>
                <div class="carousel-caption d-none d-md-block text-light">
                    <h5>${movie.title}</h5>
                </div>
            `;
            carouselInner.appendChild(carouselItem);
        });
    })
    .catch(error => console.error('Error fetching movies:', error));
