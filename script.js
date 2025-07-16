// script.js

document.addEventListener('DOMContentLoaded', () => {
    const htmlElement = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');

    // --- MAIN MENU ELEMENTS (formerly MOBILE NAV) ---
    const hamburgerButton = document.getElementById('hamburger-button');
    const mainMenu = document.getElementById('main-menu'); // Renamed from mobileMenu
    const mainMenuCloseButton = document.getElementById('main-menu-close'); // Renamed from mobileMenuCloseButton
    // Get all links inside the main menu to close menu on click
    const mainMenuLinks = mainMenu ? mainMenu.querySelectorAll('a') : []; // Renamed from mobileMenuLinks

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

    // --- MAIN MENU TOGGLE LOGIC (formerly MOBILE NAV TOGGLE LOGIC) ---
    if (hamburgerButton && mainMenu && mainMenuCloseButton) { // Renamed mobileMenu to mainMenu
        hamburgerButton.addEventListener('click', () => {
            mainMenu.classList.add('is-open'); // Renamed mobileMenu to mainMenu
            hamburgerButton.classList.add('is-active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling background
        });

        mainMenuCloseButton.addEventListener('click', () => { // Renamed mobileMenuCloseButton to mainMenuCloseButton
            mainMenu.classList.remove('is-open'); // Renamed mobileMenu to mainMenu
            hamburgerButton.classList.remove('is-active');
            document.body.style.overflow = ''; // Restore scrolling
        });

        // Close main menu when a link is clicked
        mainMenuLinks.forEach(link => { // Renamed mobileMenuLinks to mainMenuLinks
           link.addEventListener('click', () => {
               mainMenu.classList.remove('is-open'); // Renamed mobileMenu to mainMenu
               hamburgerButton.classList.remove('is-active');
               document.body.style.overflow = '';
            });
        });
    }

    // --- UptimeRobot Integration for Plex Server Status ---
    const plexStatusIndicator = document.getElementById('plex-status-indicator');
    // REMINDER: Replace 'YOUR_UPTIMEROBOT_API_KEY' with your actual Monitor-Specific API Key from UptimeRobot
    const UPTIMEROBOT_API_KEY = 'm800933230-c48b62c4b0b1adcaf03fdc60';

    async function checkPlexStatus() {
        if (!plexStatusIndicator) {
            console.warn("Plex status indicator element not found. Skipping status check.");
            return;
        }

        plexStatusIndicator.textContent = 'Checking...';
        plexStatusIndicator.className = 'status-checking'; // Reset class for visual feedback

        try {
            const response = await fetch('https://api.uptimerobot.com/v2/getMonitors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `api_key=${UPTIMEROBOT_API_KEY}&monitors=${UPTIMEROBOT_API_KEY}&format=json&logs=0&alert_contacts=0&response_times=0&custom_uptime_ratios=1&all_time_uptime_ratio=0`
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.stat === 'ok' && data.monitors && data.monitors.length > 0) {
                const monitor = data.monitors[0];

                if (monitor.status === 2) {
                    plexStatusIndicator.textContent = 'Online';
                    plexStatusIndicator.className = 'status-online';
                } else if (monitor.status === 8 || monitor.status === 9) {
                    plexStatusIndicator.textContent = 'Offline';
                    plexStatusIndicator.className = 'status-offline';
                } else {
                    plexStatusIndicator.textContent = 'Unknown Status';
                    plexStatusIndicator.className = 'status-checking';
                    console.warn(`Plex monitor is in an unexpected status: ${monitor.status}`);
                }
            } else {
                plexStatusIndicator.textContent = 'Error: No monitor data.';
                plexStatusIndicator.className = 'status-error';
                console.error('UptimeRobot API returned an issue:', data);
            }

        } catch (error) {
            console.error('Error fetching Plex status:', error);
            plexStatusIndicator.textContent = 'Error fetching status';
            plexStatusIndicator.className = 'status-error';
        }
    }

    checkPlexStatus();
    setInterval(checkPlexStatus, 5 * 60 * 1000);
});
