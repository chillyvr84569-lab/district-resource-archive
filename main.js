let allGames = [];

// Complex sites that need to break out of the "Stealth Cage" to avoid glitches
const unblockableSites = ["instagram.com", "snapchat.com", "yolearn.org", "discord.com"];

async function loadGames() {
    try {
        // Fetches from the same folder this JS file is in
        const response = await fetch('games.json');
        if (!response.ok) throw new Error("Database not found");
        allGames = await response.json();
        render(allGames);
    } catch (err) {
        console.error("Setup Error:", err);
    }
}

function render(data) {
    const container = document.getElementById('game-container');
    if (!container) return;
    container.innerHTML = data.map(game => `
        <div class="game-card" onclick="smartLaunch('${game.url}')">
            <img src="${game.thumb}" alt="${game.title}">
            <div class="game-info">
                <h3>${game.title}</h3>
                <span>${game.category}</span>
            </div>
        </div>
    `).join('');
}

function smartLaunch(url) {
    const needsDirectAccess = unblockableSites.some(site => url.includes(site));
    
    if (needsDirectAccess) {
        window.open(url, '_blank'); // Opens in new tab to fix glitches
    } else {
        const win = window.open('about:blank', '_blank');
        if (win) {
            win.document.body.style.margin = '0';
            const iframe = win.document.createElement('iframe');
            iframe.style = "border:none;width:100%;height:100vh;margin:0;display:block;";
            iframe.src = url;
            win.document.body.appendChild(iframe);
        }
    }
}

document.getElementById('game-search').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    render(allGames.filter(g => g.title.toLowerCase().includes(term)));
});

loadGames();
