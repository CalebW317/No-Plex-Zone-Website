// script.js

document.addEventListener('DOMContentLoaded', () => {
    const htmlElement = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');

    // --- NEW MOBILE NAV ELEMENTS ---
    const hamburgerButton = document.getElementById('hamburger-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuCloseButton = document.getElementById('mobile-menu-close');
    // Get all links inside the mobile menu to close menu on click
    const mobileMenuLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

    // --- Light Mode / Dark Mode Logic ---
    function setTheme(theme) {
        if (theme === 'dark') {
            htmlElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            htmlElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    } else {
        setTheme('light');
    }

    if (themeToggle) { // Ensure theme toggle button exists
        themeToggle.addEventListener('click', () => {
            if (htmlElement.classList.contains('dark')) {
                setTheme('light');
            } else {
                setTheme('dark');
            }
        });
    }

    // --- NEW MOBILE NAV TOGGLE LOGIC ---
    if (hamburgerButton && mobileMenu && mobileMenuCloseButton) {
        hamburgerButton.addEventListener('click', () => {
            mobileMenu.classList.add('is-open');
            hamburgerButton.classList.add('is-active'); // Add this line
            document.body.style.overflow = 'hidden'; // Prevent scrolling background
        });


        mobileMenuCloseButton.addEventListener('click', () => {
            mobileMenu.classList.remove('is-open');
            hamburgerButton.classList.remove('is-active'); // Add this line
            document.body.style.overflow = ''; // Restore scrolling
        });


        // Close mobile menu when a link is clicked
        mobileMenuLinks.forEach(link => {
           link.addEventListener('click', () => {
               mobileMenu.classList.remove('is-open');
               hamburgerButton.classList.remove('is-active'); // Add this line
               document.body.style.overflow = '';
            });
        });
    }