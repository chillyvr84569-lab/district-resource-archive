/**
 * THE MADMAN ENGINE v3.0 - Ultimate Unblocked Edition
 * Features: Stealth Cloaking, Auto-Counter, Randomizer, and Crash Protection.
 */

document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('games-grid');
    const searchBar = document.getElementById('search');
    const randomBtn = document.getElementById('random-btn'); // Make sure you have this ID in your HTML!
    let allGames = [];

    // 1. FETCH & INITIALIZE
    fetch('./games.json')
        .then(res => {
            if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
            return res.json();
        })
        .then(data => {
            allGames = data;
            updateLibraryStats(allGames.length);
            renderGrid(allGames);
        })
        .catch(err => {
            console.error("FATAL JSON ERROR:", err);
            showErrorState(err.message);
        });

    // 2. SEARCH & FILTERING
    searchBar.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allGames.filter(g => 
            g.title.toLowerCase().includes(term) || 
            (g.category && g.category.toLowerCase().includes(term))
        );
        renderGrid(filtered);
        updateLibraryStats(filtered.length, true);
    });

    // 3. THE RANDOMIZER
    if (randomBtn) {
        randomBtn.onclick = () => {
            const randomGame = allGames[Math.floor(Math.random() * allGames.length)];
            launchGame(randomGame);
        };
    }

    // 4. THE RENDER ENGINE
    function renderGrid(list) {
        gameContainer.innerHTML = '';
        if (list.length === 0) {
            gameContainer.innerHTML = `<div class="no-results">No games found... yet.</div>`;
            return;
        }

        list.forEach(game => {
            const card = document.createElement('div');
            card.className = 'game-card';
            card.innerHTML = `
                <div class="card-img-wrapper">
                    <img src="${game.thumb}" alt="${game.title}" loading="lazy" 
                         onerror="this.src='https://via.placeholder.com/150/222/00ff88?text=App'">
                </div>
                <div class="card-content">
                    <h3>${game.title}</h3>
                    <span class="badge">${game.category || 'Game'}</span>
                    <button class="launch-button">Launch</button>
                </div>
            `;
            card.querySelector('.launch-button').onclick = () => launchGame(game);
            gameContainer.appendChild(card);
        });
    }

    // 5. THE STEALTH LAUNCHER (The "Refused to Connect" Fix)
    function launchGame(game) {
        // DIRECT MODE (Cloak: False)
        // Used for Discord, Instagram, etc. to avoid X-Frame Blocks
        if (game.cloak === false) {
            const newTab = window.open(game.url, '_blank');
            if (!newTab) alert("Popup Blocked! Please enable popups.");
            return;
        }

        // STEALTH MODE (Cloak: True)
        // Opens in about:blank to hide from history and filters
        const win = window.open('about:blank', '_blank');
        if (!win) return alert("Please allow popups for Stealth Mode!");

        // Set Stealth Metadata (Disguised as Google Drive)
        win.document.title = "Google Drive - My Files";
        const favicon = win.document.createElement('link');
        favicon.rel = 'icon';
        favicon.href = 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png';
        win.document.head.appendChild(favicon);

        win.document.body.style = "margin:0; height:100vh; background:#000; overflow:hidden;";

        const iframe = win.document.createElement('iframe');
        iframe.style = "width:100vw; height:100vh; border:none;";
        iframe.src = game.url;
        
        // Critical permissions for Shooters and Apps
        iframe.allow = "fullscreen; autoplay; cursor-lock; clipboard-write; encrypted-media; gyroscope; accelerometer";
        
        win.document.body.appendChild(iframe);
    }

    // 6. UTILITIES
    function updateLibraryStats(count, isSearching = false) {
        const titleEl = document.querySelector('h1');
        if (titleEl) {
            titleEl.innerText = isSearching ? `Found: ${count}` : `Unblocked Hub (${count} Games)`;
        }
    }

    function showErrorState(msg) {
        gameContainer.innerHTML = `
            <div style="grid-column: 1/-1; color: #ff4444; border: 2px solid #ff4444; padding: 2rem; border-radius: 15px;">
                <h2>🚨 SYSTEM ERROR: JSON FAILURE</h2>
                <p>Detailed Report: ${msg}</p>
                <p>Check if you missed a comma or used a slash inside games.json!</p>
            </div>
        `;
    }
});
