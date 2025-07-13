// script.js

document.addEventListener('DOMContentLoaded', () => {
    const htmlElement = document.documentElement; // This refers to the <html> tag
    const themeToggle = document.getElementById('theme-toggle');

    // --- Light Mode / Dark Mode Logic ---

    // Function to set the theme
    function setTheme(theme) {
        if (theme === 'dark') {
            htmlElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            // themeToggle.textContent = 'Light Mode'; // REMOVE THIS LINE
        } else {
            htmlElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            // themeToggle.textContent = 'Dark Mode'; // REMOVE THIS LINE
        }
    }

    // Check for saved theme preference or system preference on load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    } else {
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

    // --- Server Status Logic (Keep your current version here, potentially with commented out fetch) ---
    // Make sure this part is not causing errors that prevent the above from running.
    // If you had it commented out for debugging the toggle, you can try uncommenting it
    // IF your Cloudflare Worker is now successfully returning JSON (even an error JSON).
    // If your Worker is still throwing 1101s, keep this section commented out for now.

    const PLEX_STATUS_API_URL = 'https://plex-status.noplexzone999.workers.dev/'; // CHANGE THIS TO YOUR ACTUAL WORKER URL

    async function checkPlexServerStatus() {
        const plexStatusIndicator = document.getElementById('plex-status-indicator');
        if (!plexStatusIndicator) return; // Ensure the element exists on the page

        plexStatusIndicator.textContent = 'Checking...';
        plexStatusIndicator.className = 'status-checking';

        try {
            const response = await fetch(PLEX_STATUS_API_URL, {
                cache: 'no-store'
            });

            if (!response.ok) {
                // Check if the response itself is valid JSON with an error message from the worker
                let errorDetails = `HTTP error! status: ${response.status}`;
                try {
                    const errorJson = await response.json();
                    if (errorJson && errorJson.message) {
                        errorDetails = errorJson.message;
                    }
                } catch (e) {
                    // Not a JSON response, or JSON parsing error
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

    // Call on page load and periodically, only if the element exists
    if (document.getElementById('plex-status-indicator')) {
        checkPlexServerStatus(); // Initial check
        setInterval(checkPlexServerStatus, 60000); // Check every minute
    }

});
