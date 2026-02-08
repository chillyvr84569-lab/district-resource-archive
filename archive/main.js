/**
 * PROJECT TITAN: TITANIUM CORE v99.9
 * ARCHITECTURE: Class-Based / Async / Event-Driven
 * STATUS: CLASSIFIED
 */

const CONFIG = {
    vaultPath: './games.json',
    version: 'Titan-OS-v4',
    chunkSize: 50, // Renders items in batches to prevent UI freeze
    searchDebounce: 300, // ms
    panicKey: 'Escape', // Double tap to activate
    panicUrl: 'https://classroom.google.com',
};

class TitanEngine {
    constructor() {
        this.state = {
            data: [],
            filtered: [],
            favorites: this.loadFavorites(),
            activeCategory: 'All',
            searchQuery: '',
            isLoading: true
        };

        this.dom = {
            grid: document.getElementById('games-grid'),
            search: document.getElementById('search'),
            filters: document.querySelectorAll('.filter-btn, button'),
            status: this.createStatusBar(),
            panicOverlay: null
        };

        // Initialize Core Systems
        this.init();
    }

    /* --- SYSTEM BOOT --- */
    async init() {
        this.log("Initializing Titanium Core...", "INFO");
        this.setupPanicProtocol();
        
        try {
            await this.loadVault();
            this.setupEventListeners();
            this.render();
            this.log("System Online. Vault Secured.", "SUCCESS");
        } catch (error) {
            this.handleCriticalError(error);
        }
    }

    /* --- DATA LAYER --- */
    async loadVault() {
        this.updateStatus("Accessing Secure Vault...");
        
        const response = await fetch(CONFIG.vaultPath);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        
        const rawData = await response.json();
        
        // Data Sanitation & Validation Pipeline
        this.state.data = rawData.map(entry => ({
            ...entry,
            id: entry.id || `gen-${Math.random().toString(36).substr(2, 9)}`,
            tags: entry.tags || [],
            meta: entry.meta || { description: "No Intel Available" },
            settings: entry.settings || { cloak: true }
        }));

        this.state.filtered = this.state.data;
        this.state.isLoading = false;
        this.updateStatus(`Vault Loaded: ${this.state.data.length} Units Ready`);
    }

    loadFavorites() {
        const saved = localStorage.getItem('titan_favs');
        return saved ? JSON.parse(saved) : [];
    }

    saveFavorites() {
        localStorage.setItem('titan_favs', JSON.stringify(this.state.favorites));
    }

    /* --- RENDERING ENGINE (VIRTUAL DOM) --- */
    render() {
        if (!this.dom.grid) return;
        
        this.dom.grid.innerHTML = '';
        
        if (this.state.filtered.length === 0) {
            this.dom.grid.innerHTML = `<div class="empty-state"><h3>No Intel Found</h3><p>Try a different query.</p></div>`;
            return;
        }

        // Chunking Strategy for Performance
        const fragment = document.createDocumentFragment();
        
        this.state.filtered.forEach(entry => {
            const isFav = this.state.favorites.includes(entry.id);
            const card = document.createElement('div');
            card.className = `game-card ${isFav ? 'favorited' : ''}`;
            
            // Complex HTML Construction
            card.innerHTML = `
                <div class="card-img-wrapper">
                    <img src="${entry.thumb}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x200?text=Signal+Lost'">
                    <div class="fav-icon">${isFav ? '★' : '☆'}</div>
                </div>
                <div class="card-content">
                    <div class="header-row">
                        <h3>${entry.title}</h3>
                        <span class="badge ${entry.category.toLowerCase()}">${entry.category}</span>
                    </div>
                    <div class="meta-row">
                        <small>${entry.meta.server || 'Unknown'} Server</small>
                        <small>${entry.status || 'Offline'}</small>
                    </div>
                    <p class="description">${entry.meta.description}</p>
                    <div class="action-row">
                        <button class="launch-btn" data-id="${entry.id}">INITIALIZE</button>
                    </div>
                </div>
            `;

            // Event Delegation
            card.querySelector('.launch-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.launchProtocol(entry);
            });
            
            card.querySelector('.fav-icon').addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleFavorite(entry.id);
            });

            fragment.appendChild(card);
        });

        this.dom.grid.appendChild(fragment);
    }

    /* --- INTERACTION LAYER --- */
    setupEventListeners() {
        // Debounced Search
        let timeout;
        if (this.dom.search) {
            this.dom.search.addEventListener('input', (e) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    this.state.searchQuery = e.target.value.toLowerCase();
                    this.applyFilters();
                }, CONFIG.searchDebounce);
            });
        }

        // Filter Buttons
        this.dom.filters.forEach(btn => {
            btn.addEventListener('click', () => {
                // Visual feedback
                this.dom.filters.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                this.state.activeCategory = btn.innerText.trim();
                this.applyFilters();
            });
        });
    }

    applyFilters() {
        const { data, activeCategory, searchQuery, favorites } = this.state;
        
        this.state.filtered = data.filter(item => {
            const matchesCat = activeCategory === 'All' || 
                             (activeCategory === 'Favorites' && favorites.includes(item.id)) ||
                             item.category === activeCategory;
            
            const matchesSearch = item.title.toLowerCase().includes(searchQuery) || 
                                item.tags.some(t => t.toLowerCase().includes(searchQuery));

            return matchesCat && matchesSearch;
        });

        this.render();
    }

    toggleFavorite(id) {
        if (this.state.favorites.includes(id)) {
            this.state.favorites = this.state.favorites.filter(fav => fav !== id);
        } else {
            this.state.favorites.push(id);
        }
        this.saveFavorites();
        this.render(); // Re-render to update stars
    }

    /* --- STEALTH MODULE (CLOAK v4.0) --- */
    launchProtocol(entry) {
        this.log(`Launching Protocol: ${entry.title}`, "ACTION");

        // 1. Direct Access Check
        if (entry.settings && entry.settings.cloak === false) {
            window.open(entry.url, '_blank');
            return;
        }

        // 2. Cloaked Access
        const win = window.open('about:blank', '_blank');
        if (!win) return alert("SECURITY ALERT: Popup Blocker Active.");

        const doc = win.document;
        
        // 3. Inject Disguise (Google Drive)
        doc.title = "My Drive - Google Drive";
        const link = doc.createElement('link');
        link.rel = 'icon';
        link.href = 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png';
        doc.head.appendChild(link);

        // 4. Inject Iframe
        const iframe = doc.createElement('iframe');
        Object.assign(iframe.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            border: 'none',
            background: '#0f0f0f'
        });
        
        iframe.src = entry.url;
        iframe.allow = "fullscreen; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; cursor-lock";
        
        doc.body.style.margin = '0';
        doc.body.style.overflow = 'hidden';
        doc.body.appendChild(iframe);
    }

    /* --- SECURITY & UTILS --- */
    setupPanicProtocol() {
        let lastKeyTime = 0;
        document.addEventListener('keydown', (e) => {
            if (e.key === CONFIG.panicKey) {
                const currentTime = new Date().getTime();
                if (currentTime - lastKeyTime < 300) {
                    // Double tap detected
                    window.location.href = CONFIG.panicUrl;
                }
                lastKeyTime = currentTime;
            }
        });
    }

    handleCriticalError(error) {
        console.error("CRITICAL FAILURE:", error);
        if (this.dom.grid) {
            this.dom.grid.innerHTML = `
                <div style="background: #220000; color: #ff5555; padding: 20px; border: 1px solid red; text-align: center;">
                    <h2>SYSTEM FAILURE</h2>
                    <p>Titan Engine crashed. Check console logs.</p>
                    <p>DEBUG: ${error.message}</p>
                </div>
            `;
        }
    }

    createStatusBar() {
        const bar = document.createElement('div');
        bar.style.cssText = "position: fixed; bottom: 0; left: 0; width: 100%; background: #111; color: #0f0; font-family: monospace; font-size: 10px; padding: 2px 10px; z-index: 9999;";
        document.body.appendChild(bar);
        return bar;
    }

    updateStatus(msg) {
        if (this.dom.status) this.dom.status.innerText = `[TITAN-OS] > ${msg}`;
    }

    log(msg, type = "LOG") {
        console.log(`%c[${type}] ${msg}`, 'color: #0f0; background: #000; padding: 2px 5px; border-radius: 3px;');
    }
}

// IGNITION
document.addEventListener('DOMContentLoaded', () => {
    window.TitanOS = new TitanEngine();
});
