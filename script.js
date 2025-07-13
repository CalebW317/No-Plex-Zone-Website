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
            document.body.style.overflow = 'hidden'; // Prevent scrolling background
        });

        mobileMenuCloseButton.addEventListener('click', () => {
            mobileMenu.classList.remove('is-open');
            document.body.style.overflow = ''; // Restore scrolling
        });

        // Close mobile menu when a link is clicked
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('is-open');
                document.body.style.overflow = '';
            });
        });
    }


    // --- Server Status Logic (Keep your current version here) ---
    const PLEX_STATUS_API_URL = 'https://plex-status.noplexzone999.workers.dev/'; // CHANGE THIS TO YOUR ACTUAL WORKER URL

    async function checkPlexServerStatus() {
        const plexStatusIndicator = document.getElementById('plex-status-indicator');
        if (!plexStatusIndicator) return;

        plexStatusIndicator.textContent = 'Checking...';
        plexStatusIndicator.className = 'status-checking';

        try {
            const response = await fetch(PLEX_STATUS_API_URL, {
                cache: 'no-store'
            });

            if (!response.ok) {
                let errorDetails = `HTTP error! status: ${response.status}`;
                try {
                    const errorJson = await response.json();
                    if (errorJson && errorJson.message) {
                        errorDetails = errorJson.message;
                    }
                } catch (e) {
                    console.warn("Failed to parse error response as JSON:", e);
                }
                throw new Error(`Worker Service Error: ${errorDetails}`);
            }

            const data = await response.json();

            if (data.status === 'online') {
                plexStatusIndicator.textContent = 'Online';
                plexStatusIndicator.className = 'status-online';
            } else if (data.status === 'offline') {
                plexStatusIndicator.textContent = 'Offline';
                plexStatusIndicator.className = 'status-offline';
            } else if (data.status === 'paused') {
                plexStatusIndicator.textContent = 'Paused';
                plexStatusIndicator.className = 'status-checking';
            } else if (data.status === 'checking') {
                plexStatusIndicator.textContent = 'Checking...';
                plexStatusIndicator.className = 'status-checking';
            } else {
                plexStatusIndicator.textContent = 'Unknown Status';
                plexStatusIndicator.className = 'status-error';
            }
        } catch (error) {
            console.error('Error fetching Plex server status:', error);
            plexStatusIndicator.textContent = `Error (${error.message || 'Service Unreachable'})`;
            plexStatusIndicator.className = 'status-error';
        }
    }

    if (document.getElementById('plex-status-indicator')) {
        checkPlexServerStatus();
        setInterval(checkPlexServerStatus, 60000);
    }

});
