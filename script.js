document.addEventListener('DOMContentLoaded', () => {

    // --- Theme Toggler ---
    const themeToggleButton = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    if (themeToggleButton) {
        // Apply saved theme on page load
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            htmlElement.classList.add('dark');
        } else {
            htmlElement.classList.remove('dark');
        }

        // Add click listener for the theme toggle button
        themeToggleButton.addEventListener('click', () => {
            htmlElement.classList.toggle('dark');
            // Save the current theme preference to localStorage
            localStorage.setItem('theme', htmlElement.classList.contains('dark') ? 'dark' : 'light');
        });
    }

    // --- Main Menu (Hamburger) ---
    const mainMenu = document.getElementById('main-menu');
    const mainMenuCloseButton = document.getElementById('main-menu-close');
    const hamburgerButton = document.getElementById('hamburger-button');

    // Function to close the menu
    const closeMenu = () => {
        mainMenu.classList.remove('is-open');
        hamburgerButton.classList.remove('is-active');
        document.body.style.overflow = ''; // Restore background scrolling
    };

    // Check if all menu elements exist before adding listeners
    if (hamburgerButton && mainMenu && mainMenuCloseButton) {
        const mainMenuLinks = mainMenu.querySelectorAll('a');

        // Event listener to OPEN the menu
        hamburgerButton.addEventListener('click', () => {
            mainMenu.classList.add('is-open');
            hamburgerButton.classList.add('is-active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });

        // Event listener to CLOSE the menu via the 'X' button
        mainMenuCloseButton.addEventListener('click', closeMenu);

        // Add event listeners to each link inside the menu to close it on click
        mainMenuLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    // --- UptimeRobot Integration for Plex Server Status ---
    const plexStatusIndicator = document.getElementById('plex-status-indicator');
    const UPTIMEROBOT_API_KEY = 'm800933230-c48b62c4b0b1adcaf03fdc60';

    async function checkPlexStatus() {
        if (!plexStatusIndicator) {
            return; // Exit if the status element isn't on the page
        }

        plexStatusIndicator.textContent = 'Checking...';
        plexStatusIndicator.className = 'status-checking';

        try {
            const response = await fetch('https://api.uptimerobot.com/v2/getMonitors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `api_key=${UPTIMEROBOT_API_KEY}&format=json`
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.stat === 'ok' && data.monitors && data.monitors.length > 0) {
                const monitor = data.monitors[0];
                if (monitor.status === 2) { // Status 2 = Up
                    plexStatusIndicator.textContent = 'Online';
                    plexStatusIndicator.className = 'status-online';
                } else { // Any other status (8, 9, etc.) = Down
                    plexStatusIndicator.textContent = 'Offline';
                    plexStatusIndicator.className = 'status-offline';
                }
            } else {
                throw new Error('Invalid API response');
            }
        } catch (error) {
            console.error('Error fetching Plex status:', error);
            plexStatusIndicator.textContent = 'Error';
            plexStatusIndicator.className = 'status-error';
        }
    }

    // Run the status check if the indicator is on the page
    if (plexStatusIndicator) {
        checkPlexStatus();
        setInterval(checkPlexStatus, 5 * 60 * 1000); // Re-check every 5 minutes
    }
});
