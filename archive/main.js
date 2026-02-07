document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('games-grid');
    const searchBar = document.getElementById('search');
    let allGames = [];

    // Load Data with error handling
    fetch('./games.json')
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
        .then(data => {
            allGames = data;
            renderGrid(allGames);
        })
        .catch(err => {
            console.error("Data Load Error:", err);
            gameContainer.innerHTML = `<div style="color:red; padding:20px;">Failed to load games. Check if games.json has a typo! Error: ${err.message}</div>`;
        });

    // Filtering Logic
    searchBar.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allGames.filter(g => g.title.toLowerCase().includes(term));
        renderGrid(filtered);
    });

    function renderGrid(list) {
        gameContainer.innerHTML = '';
        list.forEach(game => {
            const card = document.createElement('div');
            card.className = 'game-card';
            card.innerHTML = `
                <img src="${game.thumb}" alt="${game.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/150'">
                <h3>${game.title}</h3>
                <button class="play-btn">Launch</button>
            `;
            card.querySelector('.play-btn').onclick = () => launchGame(game);
            gameContainer.appendChild(card);
        });
    }

    function launchGame(game) {
        // Use about:blank for everything UNLESS marked as direct
        if (game.direct) {
            window.open(game.url, '_blank');
        } else {
            const win = window.open('about:blank', '_blank');
            if (!win) return alert("Please allow pop-ups!");

            win.document.title = "Google Docs";
            win.document.body.style = "margin:0; height:100vh; overflow:hidden; background:#000;";
            
            const iframe = win.document.createElement('iframe');
            iframe.style = "width:100vw; height:100vh; border:none;";
            iframe.src = game.url;
            // Critical permissions for games
            iframe.allow = "fullscreen; autoplay; cursor-lock; clipboard-write";
            
            win.document.body.appendChild(iframe);
        }
    }
});
