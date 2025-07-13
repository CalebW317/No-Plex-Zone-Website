// script.js

document.addEventListener('DOMContentLoaded', () => {
    const htmlElement = document.documentElement; // This refers to the <html> tag
    const themeToggle = document.getElementById('theme-toggle');
    const plexStatusIndicator = document.getElementById('plex-status-indicator');

    // --- Light Mode / Dark Mode Logic ---

    // Function to set the theme
    function setTheme(theme) {
        if (theme === 'dark') {
            htmlElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            themeToggle.textContent = 'Light Mode'; // Update button text
        } else {
            htmlElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            themeToggle.textContent = 'Dark Mode'; // Update button text
        }
    }

    // Check for saved theme preference or system preference on load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // If system prefers dark, apply dark mode
        setTheme('dark');
    } else {
        // Default to light mode if no preference saved and system prefers light
        setTheme('light');
    }

    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        if (htmlElement.classList.contains('dark')) {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    });

    // --- Server Status Logic ---

    const PLEX_STATUS_API_URL = 'https://plex-status.noplexzone999.workers.dev/';

    async function checkPlexServerStatus() {
        if (!plexStatusIndicator) return;

        plexStatusIndicator.textContent = 'Checking...';
        plexStatusIndicator.className = 'status-checking';

        try {
            const response = await fetch(PLEX_STATUS_API_URL, {
                cache: 'no-store'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // UptimeRobot returns status as a number. Map it to your desired text/class.
            if (data.status === 'online') {
                plexStatusIndicator.textContent = 'Online';
                plexStatusIndicator.className = 'status-online';
            } else if (data.status === 'offline') {
                plexStatusIndicator.textContent = 'Offline';
                plexStatusIndicator.className = 'status-offline';
            } else if (data.status === 'paused') { // Handle paused status
                plexStatusIndicator.textContent = 'Paused';
                plexStatusIndicator.className = 'status-checking'; // Use checking style for paused
            } else if (data.status === 'checking') { // Handle 'seems down' or 'not yet checked'
                plexStatusIndicator.textContent = 'Checking...';
                plexStatusIndicator.className = 'status-checking';
            } else {
                plexStatusIndicator.textContent = 'Unknown Status';
                plexStatusIndicator.className = 'status-error';
            }
        } catch (error) {
            console.error('Error fetching Plex server status:', error);
            plexStatusIndicator.textContent = 'Error (Service Unreachable)';
            plexStatusIndicator.className = 'status-error';
        }
    }

    // Initial check on page load
    checkPlexServerStatus();

    // Check status every 60 seconds (adjust as needed)
    setInterval(checkPlexServerStatus, 60000);
});
