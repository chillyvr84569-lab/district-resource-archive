/* PROJECT TITAN: LEVIATHAN ENGINE v20.0 */
document.addEventListener('DOMContentLoaded', () => {
    // UI References
    const DOM = {
        grid: document.getElementById('games-grid'),
        search: document.getElementById('search'),
        filters: document.querySelectorAll('.filter-btn, button'),
        status: document.createElement('div')
    };

    // Initialize Status Bar
    DOM.status.id = 'status-bar';
    DOM.status.style.cssText = "text-align:center; padding:10px; color:#666; font-size:0.9rem;";
    if(DOM.grid) DOM.grid.before(DOM.status);

    let VAULT_DATA = [];

    // --- CORE SYSTEMS ---

    // 1. Safe-Load System
    async function initVault() {
        DOM.status.innerText = "Accessing Leviathan Vault...";
        
        try {
            const response = await fetch('./games.json');
            if (!response.ok) throw new Error(`Server returned ${response.status}`);
            
            VAULT_DATA = await response.json();
            
            // Validate Data Integrity
            if (!Array.isArray(VAULT_DATA)) throw new Error("Invalid Vault Format");
            
            renderGrid(VAULT_DATA);
            DOM.status.innerText = `Vault Loaded: ${VAULT_DATA.length} Entries Ready.`;
            
        } catch (error) {
            console.error("Vault Critical Failure:", error);
            DOM.grid.innerHTML = `
                <div style="text-align:center; color:#ff4444; padding:20px;">
                    <h2>SYSTEM CRASH</h2>
                    <p>The Leviathan JSON is corrupt.</p>
                    <p>DEBUG: ${error.message}</p>
                    <p>Check your JSON for missing commas or brackets.</p>
                </div>
            `;
        }
    }

    // 2. High-Performance Renderer
    function renderGrid(dataset) {
        if (!DOM.grid) return;
        
        DOM.grid.innerHTML = '';
        const fragment = document.createDocumentFragment();

        dataset.forEach(entry => {
            const card = document.createElement('div');
            card.className = 'game-card';
            card.setAttribute('data-category', entry.category);
            
            // Fallback for broken images
            const fallbackImg = "https://via.placeholder.com/150/000000/FFFFFF?text=No+Image";

            card.innerHTML = `
                <div class="card-img-wrapper">
                    <img src="${entry.thumb}" 
                         loading="lazy" 
                         alt="${entry.title}" 
                         onerror="this.src='${fallbackImg}'">
                </div>
                <div class="card-content">
                    <div class="card-header">
                        <h3>${entry.title}</h3>
                        <span class="badge ${entry.category.toLowerCase()}">${entry.category}</span>
                    </div>
                    <p class="meta-text">${entry.meta || 'No description'}</p>
                    <button class="launch-btn">Launch</button>
                </div>
            `;

            // Attach Click Event
            const btn = card.querySelector('.launch-btn');
            btn.addEventListener('click', () => engageStealth(entry));

            fragment.appendChild(card);
        });

        DOM.grid.appendChild(fragment);
    }

    // 3. Stealth Cloaking 2.0
    function engageStealth(entry) {
        // If site cannot be cloaked (X-Frame-Options), open normally
        if (entry.cloak === false) {
            const directWin = window.open(entry.url, '_blank');
            if(!directWin) alert("Popup Blocked! Please allow popups for this site.");
            return;
        }

        // Open blank tab
        const win = window.open('about:blank', '_blank');
        if (!win) return alert("System blocked by popup blocker. Please allow.");

        const doc = win.document;

        // FAKE TAB DISGUISE
        doc.title = "Google Classroom";
        const link = doc.createElement('link');
        link.rel = 'icon';
        link.href = 'https://ssl.gstatic.com/classroom/favicon.png';
        doc.head.appendChild(link);

        // FULLSCREEN IFRAME
        const iframe = doc.createElement('iframe');
        iframe.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; border:none; margin:0; padding:0; background:#000;";
        iframe.src = entry.url;
        
        // PERMISSIONS (Fixes FPS games mouse lock)
        iframe.allow = "fullscreen; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        // iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock'); // Optional: Use only if needed

        doc.body.appendChild(iframe);
        doc.body.style.margin = '0';
        doc.body.style.overflow = 'hidden';
    }

    // --- EVENTS ---

    // Search Logic
    if (DOM.search) {
        DOM.search.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = VAULT_DATA.filter(item => 
                item.title.toLowerCase().includes(term) || 
                item.meta.toLowerCase().includes(term)
            );
            renderGrid(filtered);
        });
    }

    // Category Buttons
    DOM.filters.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.innerText.trim();
            if (category === 'All') {
                renderGrid(VAULT_DATA);
            } else {
                renderGrid(VAULT_DATA.filter(item => item.category === category));
            }
        });
    });

    // Start Engine
    initVault();
});
