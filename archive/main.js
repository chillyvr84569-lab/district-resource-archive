document.addEventListener('DOMContentLoaded', () => {
    const gameGrid = document.getElementById('games-grid');
    const searchInput = document.getElementById('search');
    let gameLibrary = [];

    // Load and validate data
    fetch('./games.json')
        .then(response => {
            if (!response.ok) throw new Error('JSON file not found');
            return response.json();
        })
        .then(data => {
            gameLibrary = data;
            displayGames(gameLibrary);
        })
        .catch(error => {
            console.error('Crash avoided:', error);
            gameGrid.innerHTML = `<h2 style="color:red; grid-column:1/-1;">Error: Check games.json for typos!</h2>`;
        });

    function displayGames(games) {
        gameGrid.innerHTML = '';
        games.forEach(game => {
            const card = document.createElement('div');
            card.className = 'game-card';
            card.innerHTML = `
                <img src="${game.thumb}" alt="${game.title}" onerror="this.src='https://via.placeholder.com/150?text=App'">
                <h3>${game.title}</h3>
                <button class="launch-btn">Play</button>
            `;
            card.querySelector('.launch-btn').onclick = () => handleLaunch(game);
            gameGrid.appendChild(card);
        });
    }

    function handleLaunch(game) {
        if (game.cloak === false) {
            // Direct launch for sites that block iframes (Instagram, Discord)
            const newWin = window.open();
            newWin.location.href = game.url;
        } else {
            // Stealth cloak for games and proxies
            const win = window.open('about:blank', '_blank');
            if (!win) {
                alert("Please allow pop-ups for stealth mode!");
                return;
            }

            win.document.title = "Google Docs";
            win.document.body.style = "margin:0; height:100vh; background:#000;";
            
            const iframe = win.document.createElement('iframe');
            iframe.style = "width:100vw; height:100vh; border:none;";
            iframe.src = game.url;
            iframe.allow = "fullscreen; autoplay; cursor-lock; clipboard-write";
            
            win.document.body.appendChild(iframe);
        }
    }

    // Search filter logic
    searchInput.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        const filtered = gameLibrary.filter(g => g.title.toLowerCase().includes(val));
        displayGames(filtered);
    });
});
