let allGames = [];

async function loadGames() {
    try {
        // Fetches from the main folder
        const response = await fetch('games.json');
        if (!response.ok) throw new Error("File not found");
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
        <div class="game-card" onclick="launch('${game.url}')">
            <img src="${game.thumb}" alt="${game.title}">
            <h3>${game.title}</h3>
            <span>${game.category}</span>
        </div>
    `).join('');
}

function launch(url) {
    const win = window.open('about:blank', '_blank');
    if (win) {
        win.document.body.style.margin = '0';
        const iframe = win.document.createElement('iframe');
        iframe.style = "border:none;width:100%;height:100vh;margin:0;";
        iframe.src = url;
        win.document.body.appendChild(iframe);
    }
}

document.getElementById('game-search').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    render(allGames.filter(g => g.title.toLowerCase().includes(term)));
});

loadGames();
