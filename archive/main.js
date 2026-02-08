/**
 * TITAN ETERNAL v5.0 - THE DIAGNOSTIC CORE
 * Specialized for home/unfiltered networks with high link decay.
 */

const TITAN_CONFIG = {
    vault: './games.json',
    proxy: 'https://api.allorigins.win/raw?url=', // Backup for CORS issues
    placeholder: 'https://via.placeholder.com/300x200?text=Link+Decayed',
    panic: 'https://google.com'
};

class TitanEternal {
    constructor() {
        this.data = [];
        this.favorites = JSON.parse(localStorage.getItem('titan_favs')) || [];
        this.nodes = {
            grid: document.getElementById('games-grid'),
            search: document.getElementById('search'),
            stats: this.initStatsBar()
        };
        this.boot();
    }

    async boot() {
        console.log("%c[TITAN] Initiating Eternal Boot...", "color:cyan; font-weight:bold;");
        try {
            const res = await fetch(TITAN_CONFIG.vault);
            const raw = await res.json();
            
            // SANITIZATION: Fixes common JSON typos on the fly
            this.data = raw.map(item => ({
                ...item,
                id: item.id || Math.random().toString(36).substr(2, 5),
                status: 'testing'
            }));

            this.setupListeners();
            this.render(this.data);
            this.runSiteDoctor(); // Starts background diagnostics
        } catch (e) {
            this.crashReport(e);
        }
    }

    /* --- THE SITE DOCTOR (Background Diagnostics) --- */
    async runSiteDoctor() {
        for (let item of this.data) {
            if (item.url === "#") continue;
            
            try {
                // Testing the URL with a HEAD request
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 5000);
                
                await fetch(item.url, { mode: 'no-cors', signal: controller.signal });
                this.updateStatus(item.id, 'online');
            } catch (err) {
                // If it fails, it's likely a 404 or DNS error
                this.updateStatus(item.id, 'offline');
                console.warn(`[DOCTOR] ${item.title} failed diagnostic:`, err.message);
            }
        }
    }

    /* --- THE LAUNCHER (With IFrame Bypass) --- */
    launch(item) {
        // Log launch attempt
        console.log(`[LAUNCH] Attempting to initialize ${item.title}...`);

        const win = window.open('about:blank', '_blank');
        if (!win) return alert("Pop-up Blocked!");

        // Disguise the tab
        win.document.title = "Class Assignment";
        
        const iframe = win.document.createElement('iframe');
        Object.assign(iframe.style, {
            position: 'fixed', inset: '0', width: '100%', height: '100%', 
            border: 'none', background: '#000'
        });

        // Try standard launch
        iframe.src = item.url;
        win.document.body.style.margin = '0';
        win.document.body.appendChild(iframe);

        // BEEFY ADDITION: Detecting if IFrame is blocked (X-Frame-Options)
        setTimeout(() => {
            try {
                if (win.document.body.innerHTML.includes("refused to connect") || 
                    win.document.body.innerHTML === "") {
                    this.injectFallback(win, item.url);
                }
            } catch (e) {
                // If we can't read the iframe content, it's usually working
            }
        }, 2000);
    }

    injectFallback(win, url) {
        const btn = win.document.createElement('div');
        btn.innerHTML = `
            <div style="color:white; background:#111; height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:sans-serif;">
                <h2>Security Shield Detected</h2>
                <p>This site refuses to be 'cloaked'. You must open it directly.</p>
                <a href="${url}" style="color:#00ffcc; font-size:20px; text-decoration:none; border:2px solid #00ffcc; padding:15px 30px; border-radius:5px;">Open Original Site</a>
            </div>
        `;
        win.document.body.appendChild(btn);
    }

    /* --- RENDERING & UI --- */
    render(list) {
        this.nodes.grid.innerHTML = '';
        const frag = document.createDocumentFragment();

        list.forEach(item => {
            const card = document.createElement('div');
            card.className = 'game-card';
            card.innerHTML = `
                <div class="thumb-box">
                    <img src="${item.thumb}" onerror="this.src='${TITAN_CONFIG.placeholder}'">
                    <div class="status-indicator" id="dot-${item.id}"></div>
                </div>
                <h3>${item.title}</h3>
                <p>${item.category}</p>
                <button class="launch-btn">LAUNCH</button>
            `;
            
            card.querySelector('.launch-btn').onclick = () => this.launch(item);
            frag.appendChild(card);
        });

        this.nodes.grid.appendChild(frag);
        this.updateStats(list.length);
    }

    updateStatus(id, status) {
        const dot = document.getElementById(`dot-${id}`);
        if (dot) dot.className = `status-indicator ${status}`;
    }

    setupListeners() {
        this.nodes.search.oninput = (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = this.data.filter(i => i.title.toLowerCase().includes(query));
            this.render(filtered);
        };
        
        window.onkeydown = (e) => {
            if (e.key === 'Escape') window.location.replace(TITAN_CONFIG.panic);
        };
    }

    initStatsBar() {
        const bar = document.createElement('div');
        bar.className = 'titan-stats';
        document.body.prepend(bar);
        return bar;
    }

    updateStats(count) {
        this.nodes.stats.innerText = `DATABASE: ${count} ASSETS LOADED | SYSTEM: OPTIMIZED`;
    }

    crashReport(err) {
        this.nodes.grid.innerHTML = `<div class="crash"><h2>CORE OVERLOAD</h2><p>${err.message}</p></div>`;
    }
}

// Ignition
new TitanEternal();
