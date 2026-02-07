/**
 * ARCHIVE ENGINE v10.0 - "THE BEAST"
 * Fixes: Blank Screens, CORS Refusal, PointerLock issues
 */

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('games-grid');
    const search = document.getElementById('search');
    let MASTER_LIST = [];

    // 1. Fetch the data - Now with better error reporting
    fetch('./games.json')
        .then(res => res.json())
        .then(data => {
            MASTER_LIST = data;
            render(MASTER_LIST);
        })
        .catch(err => {
            console.error("Critical JSON Failure:", err);
            grid.innerHTML = `<h2 style="color:red; text-align:center;">VAULT CRASHED: Check for extra brackets in games.json!</h2>`;
        });

    // 2. Optimized Render Engine
    function render(list) {
        grid.innerHTML = '';
        list.forEach(game => {
            const card = document.createElement('div');
            card.className = 'game-card'; // Matches your existing CSS
            card.innerHTML = `
                <div class="card-img-wrapper"><img src="${game.thumb}" loading="lazy" onerror="this.src='https://via.placeholder.com/150/222/555?text=Archive'"></div>
                <div class="card-content">
                    <h3>${game.title}</h3>
                    <span class="badge">${game.category}</span>
                    <button class="launch-btn">Launch</button>
                </div>
            `;
            card.querySelector('.launch-btn').onclick = () => launch(game);
            grid.appendChild(card);
        });
    }

    // 3. Beast Mode Launcher
    function launch(game) {
        if (game.cloak === false) {
            window.open(game.url, '_blank');
            return;
        }

        // The "about:blank" fix: Create a blob window to bypass security blocks
        const win = window.open('about:blank', '_blank');
        if (!win) {
            alert("POPUP BLOCKED! Enable popups to allow cloaking.");
            return;
        }

        // Tab Masking
        win.document.title = "Google Docs";
        const link = win.document.createElement('link');
        link.rel = 'icon';
        link.href = 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico';
        win.document.head.appendChild(link);

        // BEASTLY PERMISSION INJECTION
        // This solves the black screen on FPS games (1v1.lol, etc)
        const iframe = win.document.createElement('iframe');
        iframe.style = "position:fixed; top:0; left:0; width:100%; height:100%; border:none; margin:0; padding:0; background:#000;";
        iframe.src = game.url;
        
        // Critical permissions for 2026 browsers
        iframe.allow = "fullscreen; autoplay; cursor-lock; clipboard-write; encrypted-media; camera; microphone; midi; geolocation";

        win.document.body.style.margin = "0";
        win.document.body.style.overflow = "hidden";
        win.document.body.appendChild(iframe);
    }

    // 4. Instant Search
    search.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = MASTER_LIST.filter(g => 
            g.title.toLowerCase().includes(query) || g.category.toLowerCase().includes(query)
        );
        render(filtered);
