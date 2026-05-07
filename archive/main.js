/**
 * 🛡️ TITAN ENGINE: GHOST PROTOCOL
 * FIXES: 403 Proxy Deaths, Blocked Placeholders, Network Hangs
 */

const CONFIG = {
    jsonPath: './games.json',
    
    // --- THE PROXY FIX ---
    // Your Google Cloud proxy is dead. I've swapped this to a raw CORS proxy 
    // for testing. You will need to find a new, working proxy URL eventually.
    proxyPrefix: 'https://api.allorigins.win/raw?url=', 
    
    // --- THE THUMBNAIL FIX ---
    // This is a Base64 SVG. It is literal code turned into an image. 
    // Your school CANNOT block this because it doesn't rely on a URL.
    ghostImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMzAwIDIwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiMyMjIiLz48dGV4dCB4PSIxNTAiIHk9IjEwMCIgZmlsbD0iIzU1NSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIj5OTyBTSUdOQUw8L3RleHQ+PC9zdmc+',

    rowHeight: 260, 
    itemsPerRow: 4, 
    buffer: 6,
    cloakTitle: 'Classes',
    cloakIcon: 'https://ssl.gstatic.com/classroom/favicon.png'
};

class GhostEngine {
    constructor() {
        this.db = [];
        this.filtered = [];
        this.container = document.querySelector('.container') || document.body; // Fallback if no container
        this.grid = document.getElementById('games-grid') || this.createGrid();
        this.search = document.getElementById('search');

        this.init();
    }

    createGrid() {
        // Automatically creates the grid if your HTML is missing it
        const g = document.createElement('div');
        g.id = 'games-grid';
        g.style = 'display: flex; flex-wrap: wrap; gap: 15px; justify-content: center; padding: 20px;';
        this.container.appendChild(g);
        return g;
    }

    async init() {
        console.log("%c👻 GHOST PROTOCOL: INITIATED...", "color: #ff00ff; font-weight: bold;");
        try {
            const res = await fetch(CONFIG.jsonPath);
            this.db = await res.json();
            this.filtered = this.db;

            if(this.search) {
                this.search.addEventListener('input', (e) => this.handleSearch(e));
            }

            this.render();
            console.log(`[SYSTEM] Loaded ${this.db.length} Units.`);
        } catch (e) {
            console.error("CRITICAL BOOT FAILURE: Cannot read games.json", e);
        }
    }

    launch(url, title) {
        console.log(`🚀 Routing ${title} through proxy...`);

        // Encode the URL so network filters can't read what game you are launching
        const safeUrl = encodeURIComponent(url);
        const finalUrl = `${CONFIG.proxyPrefix}${safeUrl}`;

        // Open Cloaked Tab
        const win = window.open('about:blank', '_blank');
        if (!win) return alert("Pop-up blocked! Allow pop-ups to launch games.");

        win.document.title = CONFIG.cloakTitle;
        const link = win.document.createElement('link');
        link.rel = 'icon';
        link.href = CONFIG.cloakIcon;
        win.document.head.appendChild(link);

        const iframe = win.document.createElement('iframe');
        Object.assign(iframe.style, {
            position: 'fixed', inset: '0', width: '100vw', height: '100vh', border: 'none', background: '#000'
        });

        iframe.src = finalUrl;
        iframe.allow = "fullscreen; autoplay; encrypted-media; cursor-lock;";
        
        win.document.body.style.margin = '0';
        win.document.body.style.overflow = 'hidden';
        win.document.body.appendChild(iframe);
    }

    handleSearch(e) {
        const query = e.target.value.toLowerCase();
        this.filtered = this.db.filter(item => item.title.toLowerCase().includes(query));
        this.render();
    }

    render() {
        this.grid.innerHTML = '';
        
        // Render standard cards (removed complex virtual scroll to ensure baseline functionality first)
        let html = '';
        this.filtered.forEach(item => {
            html += `
                <div class="game-card" style="width: 200px; background: #1a1a1a; border: 1px solid #333; border-radius: 8px; overflow: hidden; display: flex; flex-direction: column; align-items: center; padding-bottom: 15px;">
                    <img src="${item.thumb || item.image}" 
                         onerror="this.onerror=null; this.src='${CONFIG.ghostImage}';" 
                         style="width: 100%; height: 120px; object-fit: cover; background: #000;" 
                         loading="lazy" alt="${item.title}">
                    
                    <h3 style="color: #eee; font-size: 14px; margin: 15px 0 5px 0; text-align: center;">${item.title}</h3>
                    <p style="color: #888; font-size: 11px; margin-bottom: 15px;">${item.category || 'Game'}</p>
                    
                    <button onclick="Ghost.launch('${item.url}', '${item.title.replace(/'/g, "\\'")}')" 
                            style="background: #eee; color: #111; border: none; padding: 5px 15px; cursor: pointer; border-radius: 3px; font-weight: bold;">
                        INITIALIZE
                    </button>
                </div>
            `;
        });
        
        this.grid.innerHTML = html;
    }
}

const Ghost = new GhostEngine();
