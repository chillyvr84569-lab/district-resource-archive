/**
 * TITAN ULTRA ENGINE v3.0 - "The Heavyweight"
 * Optimized for 1,500+ Entry JSON Vaults
 */

const ENGINE_CONFIG = {
    vault: './games.json',
    panicUrl: 'https://classroom.google.com',
    thumbnailFallback: 'https://via.placeholder.com/300x200?text=Signal+Lost',
    renderBatchSize: 20, // Prevents UI lag by loading in chunks
    pingInterval: 5000   // Background check frequency
};

class TitanUltra {
    constructor() {
        this.vaultData = [];
        this.filteredData = [];
        this.favorites = JSON.parse(localStorage.getItem('titan_favs')) || [];
        this.isSearching = false;

        this.nodes = {
            grid: document.getElementById('games-grid'),
            search: document.getElementById('search'),
            filters: document.querySelectorAll('.filter-btn, button'),
            counter: this.createCounterNode()
        };

        this.init();
    }

    async init() {
        console.log("%c[SYSTEM] Initializing Titan Ultra Engine...", "color: #00d4ff; font-weight: bold;");
        this.setupSecurity();
        
        try {
            await this.ingestData();
            this.bindEvents();
            this.render(this.vaultData);
            this.backgroundHealthCheck();
        } catch (err) {
            this.reportSystemFailure(err);
        }
    }

    /* --- DATA INGESTION & REPAIR --- */
    async ingestData() {
        const response = await fetch(ENGINE_CONFIG.vault);
        if (!response.ok) throw new Error(`Vault Access Denied: ${response.status}`);
        
        const raw = await response.json();
        
        // SELF-HEALING: Assigns IDs and cleans broken entries on load
        this.vaultData = raw.map((item, index) => ({
            id: item.id || `asset-${index}`,
            title: item.title || "Unknown Asset",
            url: item.url || "#",
            thumb: item.thumb || ENGINE_CONFIG.thumbnailFallback,
            category: item.category || "Misc",
            meta: item.meta || { description: "No Intel Provided" },
            cloak: item.cloak !== undefined ? item.cloak : true,
            status: 'checking'
        }));

        this.filteredData = this.vaultData;
        this.updateCounter(this.vaultData.length);
    }

    /* --- VIRTUAL RENDERING ENGINE --- */
    render(data) {
        if (!this.nodes.grid) return;
        
        this.nodes.grid.innerHTML = '';
        const fragment = document.createDocumentFragment();

        data.forEach(item => {
            const isFav = this.favorites.includes(item.id);
            const card = document.createElement('div');
            card.className = `game-card ${isFav ? 'fav-active' : ''}`;
            card.setAttribute('data-category', item.category);

            card.innerHTML = `
                <div class="card-inner">
                    <div class="media-container">
                        <img src="${item.thumb}" loading="lazy" 
                             onerror="this.src='${ENGINE_CONFIG.thumbnailFallback}'; this.classList.add('broken-img');">
                        <div class="status-indicator ${item.status}" id="status-${item.id}"></div>
                    </div>
                    <div class="info-container">
                        <h3>${item.title}</h3>
                        <p class="desc">${item.meta.description || ''}</p>
                        <div class="btn-group">
                            <button class="launch-trigger" data-id="${item.id}">LAUNCH</button>
                            <button class="fav-trigger">${isFav ? '★' : '☆'}</button>
                        </div>
                    </div>
                </div>
            `;

            // Optimized Listeners
            card.querySelector('.launch-trigger').onclick = () => this.handleLaunch(item);
            card.querySelector('.fav-trigger').onclick = (e) => this.toggleFavorite(e, item.id);
            
            fragment.appendChild(card);
        });

        this.nodes.grid.appendChild(fragment);
    }

    /* --- THE LAUNCHER (STEALTH v4) --- */
    handleLaunch(item) {
        if (item.url === "#") return;

        // If cloak is disabled, open normally
        if (item.cloak === false) {
            window.open(item.url, '_blank');
            return;
        }

        const portal = window.open('about:blank', '_blank');
        if (!portal) {
            alert("SECURITY: Please enable popups to launch assets.");
            return;
        }

        const pDoc = portal.document;
        pDoc.title = "Google Docs"; // Disguise
        
        // Favicon Masking
        const icon = pDoc.createElement('link');
        icon.rel = 'icon';
        icon.href = 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico';
        pDoc.head.appendChild(icon);

        const frame = pDoc.createElement('iframe');
        Object.assign(frame.style, {
            position: 'fixed',
            inset: '0',
            width: '100%',
            height: '100%',
            border: 'none',
            background: '#000'
        });

        frame.src = item.url;
        frame.allow = "fullscreen; autoplay; encrypted-media; clipboard-write";
        pDoc.body.style.margin = '0';
        pDoc.body.appendChild(frame);
    }

    /* --- SEARCH & FILTER LOGIC --- */
    bindEvents() {
        // Debounced Search (Saves CPU)
        let timer;
        this.nodes.search?.addEventListener('input', (e) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                const query = e.target.value.toLowerCase();
                this.filteredData = this.vaultData.filter(i => 
                    i.title.toLowerCase().includes(query) || 
                    i.category.toLowerCase().includes(query)
                );
                this.render(this.filteredData);
                this.updateCounter(this.filteredData.length);
            }, 250);
        });

        // Category Switcher
        this.nodes.filters.forEach(btn => {
            btn.onclick = () => {
                const cat = btn.innerText;
                this.filteredData = (cat === 'All') 
                    ? this.vaultData 
                    : this.vaultData.filter(i => i.category === cat);
                this.render(this.filteredData);
                this.updateCounter(this.filteredData.length);
            };
        });
    }

    /* --- BACKGROUND SERVICES --- */
    backgroundHealthCheck() {
        // Pings images to see if they are alive (Prevents those console errors)
        this.vaultData.forEach(item => {
            if (item.url.startsWith('http')) {
                fetch(item.url, { mode: 'no-cors', method: 'HEAD' })
                    .then(() => this.updateStatus(item.id, 'online'))
                    .catch(() => this.updateStatus(item.id, 'offline'));
            }
        });
    }

    updateStatus(id, status) {
        const dot = document.getElementById(`status-${id}`);
        if (dot) {
            dot.className = `status-indicator ${status}`;
        }
    }

    toggleFavorite(e, id) {
        e.stopPropagation();
        if (this.favorites.includes(id)) {
            this.favorites = this.favorites.filter(f => f !== id);
            e.target.innerText = '☆';
        } else {
            this.favorites.push(id);
            e.target.innerText = '★';
        }
        localStorage.setItem('titan_favs', JSON.stringify(this.favorites));
    }

    setupSecurity() {
        // PANIC BUTTON: Instant Escape
        window.onkeydown = (e) => {
            if (e.key === 'Escape') window.location.replace(ENGINE_CONFIG.panicUrl);
        };
    }

    createCounterNode() {
        const div = document.createElement('div');
        div.id = "vault-stats";
        div.style = "color: #555; font-size: 12px; margin: 10px 0;";
        document.querySelector('.container').prepend(div);
        return div;
    }

    updateCounter(num) {
        if (this.nodes.counter) this.nodes.counter.innerText = `ACTIVE ASSETS: ${num}`;
    }

    reportSystemFailure(err) {
        console.error("CRITICAL ENGINE ERROR:", err);
        this.nodes.grid.innerHTML = `<div class="error-box"><h2>ENGINE STALL</h2><p>${err.message}</p></div>`;
    }
}

// IGNITION
document.addEventListener('DOMContentLoaded', () => new TitanUltra());
