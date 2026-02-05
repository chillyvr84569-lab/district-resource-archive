let allGames = [];

// 1. Define sites that BREAK inside iframes (Socials & Proxies)
const unblockableSites = [
    "instagram.com",
    "snapchat.com",
    "tiktok.com",
    "yolearn.org", // Truffled
    "rammerhead",
    "discord.com",
    "google.com"   // Translate/Macros often break in frames
];

async function loadGames() {
    try {
        const response = await fetch('games.json');
        if (!response.ok) throw new Error("Database not found");
        
        allGames = await response.json();
        render(allGames);
    } catch (err) {
        console.error("Error:", err);
    }
}

function render(data) {
    const container = document.getElementById('game-container');
    if (!container) return;
    
    container.innerHTML = data.map(game => `
        <div class="game-card" onclick="handleLaunch('${game.url}')">
            <img src="${game.thumb}" alt="${game.title}" loading="lazy">
            <div class="game-info">
                <h3>${game.title}</h3>
                <span class="category">${game.category}</span>
            </div>
        </div>
    `).join('');
}

// The "Smart" Launcher
function handleLaunch(url) {
    // Check if the URL contains any of the "Unblockable" domains
    const isComplex = unblockableSites.some(site => url.includes(site));

    if (isComplex) {
        // Option A: Open complex sites in a new tab (Fixes the glitches)
        window.open(url, '_blank');
    } else {
        // Option B: Open simple games in Stealth Mode (about:blank)
        launchStealth(url);
    }
}

function launchStealth(url) {
    const win = window.open('about:blank', '_blank');
    if (!win) {
        alert("Popups blocked! Please allow popups for stealth mode.");
        return;
    }
    
    win.document.body.style.margin = '0';
    win.document.body.style.background = '#000';
    
    const iframe = win.document.createElement('iframe');
    iframe.style = "border:none;width:100%;height:100vh;margin:0;display:block;";
    iframe.src = url;
    
    win.document.body.appendChild(iframe);
}

// Search Functionality
const searchInput = document.getElementById('game-search');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        render(allGames.filter(g => 
            g.title.toLowerCase().includes(term) || 
            g.category.toLowerCase().includes(term)
        ));
    });
}

// Start
loadGames();
