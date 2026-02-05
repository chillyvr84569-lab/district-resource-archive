document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('games-grid');
    const searchBar = document.getElementById('search');
    const themeToggle = document.getElementById('theme-toggle');
    const filterBtns = document.querySelectorAll('.filter-btn');
    let games = [];
    let currentCategory = 'all';

    // 1. Fetch JSON and Load Grid
    fetch('games.json')
        .then(res => res.json())
        .then(data => {
            games = data;
            filterAndDisplay();
        })
        .catch(err => console.error("Could not load games.json", err));

    // 2. Filter & Search Logic
    function filterAndDisplay() {
        const searchTerm = searchBar.value.toLowerCase();
        const filtered = games.filter(game => {
            const matchesSearch = game.title.toLowerCase().includes(searchTerm);
            const matchesCategory = currentCategory === 'all' || game.category === currentCategory;
            return matchesSearch && matchesCategory;
        });
        
        gameContainer.innerHTML = '';
        filtered.forEach(game => {
            const card = document.createElement('div');
            card.className = 'game-card';
            card.innerHTML = `
                <img src="${game.thumb}" alt="${game.title}" loading="lazy">
                <h3>${game.title}</h3>
                <button class="play-btn">Play</button>
            `;
            // About:Blank Event
            card.querySelector('.play-btn').onclick = () => openGame(game.url);
            gameContainer.appendChild(card);
        });
    }

    // 3. About:Blank Cloaker (History Protection)
    function openGame(url) {
        const win = window.open('about:blank', '_blank');
        if (!win) return alert("Please allow popups!");
        const iframe = win.document.createElement('iframe');
        iframe.style.cssText = "width:100vw; height:100vh; border:none; position:fixed; top:0; left:0; margin:0; padding:0;";
        iframe.src = url;
        win.document.body.style.margin = '0';
        win.document.body.appendChild(iframe);
    }

    // 4. Event Listeners
    searchBar.addEventListener('input', filterAndDisplay);
    
    filterBtns.forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.filter-btn.active').classList.remove('active');
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            filterAndDisplay();
        };
    });

    themeToggle.onclick = () => document.body.classList.toggle('light-theme');
});
