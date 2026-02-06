document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('games-grid');
    const searchBar = document.getElementById('search');
    
    fetch('./games.json')
        .then(res => res.json())
        .then(data => {
            renderGrid(data);
            searchBar.oninput = () => renderGrid(data);
        });

    function renderGrid(list) {
        gameContainer.innerHTML = '';
        const searchTerm = searchBar.value.toLowerCase();

        list.filter(game => game.title.toLowerCase().includes(searchTerm)).forEach(game => {
            const card = document.createElement('div');
            card.className = 'game-card';
            card.innerHTML = `
                <img src="${game.thumb}" alt="${game.title}" onerror="this.src='https://via.placeholder.com/150'">
                <h3>${game.title}</h3>
                <button class="play-btn">Launch Cloaked</button>
            `;
            
            card.querySelector('.play-btn').onclick = () => {
                const win = window.open('about:blank', '_blank');
                if (!win) return alert("Pop-up blocked! Please allow pop-ups.");

                // Tab masking
                win.document.title = "Google Docs";
                win.document.body.style = "margin:0; height:100vh; overflow:hidden; background:#000;";
                
                const iframe = win.document.createElement('iframe');
                iframe.style = "width:100vw; height:100vh; border:none;";
                iframe.src = game.url;
                
                // Allow sound, fullscreen, and mouse-lock for games
                iframe.allow = "fullscreen; autoplay; cursor-lock"; 
                
                win.document.body.appendChild(iframe);
            };
            gameContainer.appendChild(card);
        });
    }
});
