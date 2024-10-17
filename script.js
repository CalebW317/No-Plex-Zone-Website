document.addEventListener("DOMContentLoaded", function() {
    const slideshow = document.querySelector('.slideshow');
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    
    // Define image paths for desktop and mobile
    const desktopImages = ['bettercallsaul.jpg', 'deadpool_wolverine.jpg', 'f4.jpg', 'forrest.jpg', 'whiplash.jpeg', 'wicked.jpg']; // Add more images as needed
    const mobileImages = ['alien_romulus.jpg', 'deadpool_wolverine.jpg', 'endgame.jpg','f4.jpg', 'joker.jpg', 'minecraft.jpg', 'us.jpg', 'wicked.jpg']; // Add more images as needed
    
    const imageFolder = isMobile ? 'images/mobile/' : 'images/desktop/';
    const imageList = isMobile ? mobileImages : desktopImages;

    // Clear any existing slides to prevent duplication
    slideshow.innerHTML = '';

    // Shuffle the imageList array
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    shuffle(imageList);
    
    // Load images into the slideshow
    imageList.forEach(image => {
        const slide = document.createElement('div');
        slide.classList.add('slide');
        slide.style.backgroundImage = `url('${imageFolder}${image}')`;
        slideshow.appendChild(slide);
    });

    
    // JavaScript for slideshow transitions
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;

    function showNextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % totalSlides;
        slides[currentSlide].classList.add('active');
    }

    setInterval(showNextSlide, 5000);
    slides[currentSlide].classList.add('active');
});

// Update library status

function fetchStatus() {
    fetch('https://raw.githubusercontent.com/CALEBW317/Requests-Homepage/main/status.json')
        .then(response => response.json())
        .then(data => {
            setStatus('movies', data.movies);
            setStatus('tvshows', data.tvshows);
            setStatus('anime', data.anime);
        })
        .catch(err => console.error('Failed to fetch status:', err));
}

function setStatus(library, status) {
    let statusDiv;

    if (library === 'movies') {
        statusDiv = document.getElementById('moviesStatus');
    } else if (library === 'tvshows') {
        statusDiv = document.getElementById('tvShowsStatus');
    } else if (library === 'anime') {
        statusDiv = document.getElementById('animeStatus');
    }

    if (status === 'working') {
        statusDiv.textContent = 'UP';
        statusDiv.className = 'status working';
    } else if (status === 'partial') {
        statusDiv.textContent = 'PARTIAL';
        statusDiv.className = 'status partial';
    } else if (status === 'down') {
        statusDiv.textContent = 'DOWN';
        statusDiv.className = 'status down';
    }
}

// Fetch the status when the page loads
window.onload = fetchStatus;
