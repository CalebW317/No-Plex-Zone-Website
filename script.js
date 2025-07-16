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
                // For a monitor-specific key, pass the key itself as the 'monitors' parameter.
                // This tells UptimeRobot to return data for that specific monitor.
                body: `api_key=${UPTIMEROBOT_API_KEY}&monitors=${UPTIMEROBOT_API_KEY}&format=json&logs=0&alert_contacts=0&response_times=0&custom_uptime_ratios=1&all_time_uptime_ratio=0`
            });

            if (!response.ok) {
                // If the HTTP response itself is not OK (e.g., 404, 500)
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Check if the UptimeRobot API call was successful and returned monitor data
            if (data.stat === 'ok' && data.monitors && data.monitors.length > 0) {
                const monitor = data.monitors[0]; // We expect one monitor since we used a specific key

                // UptimeRobot Status Codes:
                // 0 = Paused
                // 1 = Not Checked Yet
                // 2 = Up
                // 8 = Seems Down
                // 9 = Down
                if (monitor.status === 2) {
                    plexStatusIndicator.textContent = 'Online';
                    plexStatusIndicator.className = 'status-online';
                } else if (monitor.status === 8 || monitor.status === 9) {
                    plexStatusIndicator.textContent = 'Offline';
                    plexStatusIndicator.className = 'status-offline';
                } else {
                    // For paused, not checked yet, or other unexpected statuses
                    plexStatusIndicator.textContent = 'Unknown Status';
                    plexStatusIndicator.className = 'status-checking'; // Reverts to checking color
                    console.warn(`Plex monitor is in an unexpected status: ${monitor.status}`);
                }
            } else {
                // If API response is 'ok' but no monitor data, or stat is not 'ok'
                plexStatusIndicator.textContent = 'Error: No monitor data.';
                plexStatusIndicator.className = 'status-error';
                console.error('UptimeRobot API returned an issue:', data);
            }

        } catch (error) {
            // Catch any network errors or errors thrown in the try block
            console.error('Error fetching Plex status:', error);
            plexStatusIndicator.textContent = 'Error fetching status';
            plexStatusIndicator.className = 'status-error';
        }
    }

    // Call the status check function immediately when the DOM is loaded
    checkPlexStatus();

    // Set an interval to refresh the status periodically (e.g., every 5 minutes)
    // 5 * 60 * 1000 milliseconds = 5 minutes
    setInterval(checkPlexStatus, 5 * 60 * 1000);
});
