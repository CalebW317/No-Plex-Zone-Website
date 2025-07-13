// script.js

document.addEventListener('DOMContentLoaded', () => {
    const htmlElement = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    const plexStatusIndicator = document.getElementById('plex-status-indicator');

    // ... (Your Light Mode / Dark Mode Logic remains the same) ...

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
