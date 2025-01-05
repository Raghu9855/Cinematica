document.addEventListener("DOMContentLoaded", () => {
    const tagline = document.getElementById("tagline") ;
    var audio = new Audio('entry.mp3');
   
    // Create a video element
//     const videoElement = document.createElement('video');

// // Set video attributes
// videoElement.setAttribute('autoplay', true);
// videoElement.setAttribute('muted', true);
// videoElement.setAttribute('loop', true);
// videoElement.setAttribute('playsinline', true); // For mobile browsers

// // Set the video source
// const sourceElement = document.createElement('source');
// sourceElement.setAttribute('src', /path/to/video.mp4');
// sourceElement.setAttribute('type', 'video/mp4');

// // Append the source to the video
// videoElement.appendChild(sourceElement);

// // Add the video to the container
// document.getElementById('background-container').prepend(videoElement);







    // Adding a slight delay to the tagline fade-in after logo animation
    setTimeout(() => {
        audio.play();
        
    }, 2800);
    setTimeout(() => {
        tagline.style.opacity = "1"; 
    }, 2800); // Tagline fades in after 3.5 seconds
});

// Wait for 3.5 seconds, then redirect to the home page
setTimeout(() => {
    window.location.href = "/login"; // Redirect to /home route after the loader
}, 4000);