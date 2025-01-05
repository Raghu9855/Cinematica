window.onload = function() {
    const moviesElement = document.querySelector('.movie');
    if (moviesElement) {
        new Typed('.movie', {
            strings: ['Movies'],
            typeSpeed: 100,
            backSpeed: 100,
            loop: true,
            backDelay: 1000
        });
    }
};

