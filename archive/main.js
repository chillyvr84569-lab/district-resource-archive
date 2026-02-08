/* PROJECT TITAN: 1500-LINE HANDLER v30.0 */
document.addEventListener('DOMContentLoaded', () => {
    const DOM = {
        grid: document.getElementById('games-grid'),
        search: document.getElementById('search'),
        filters: document.querySelectorAll('.filter-btn, button'),
    };

    let TITAN_VAULT = [];

    // --- 1. BOOT SEQUENCE ---
    async function bootSystem() {
        try {
            console.log("Initializing Titan Engine...");
            const response = await fetch('./games.json');
            
            if (!response.ok) throw new Error(`Vault Offline (Status: ${response.status})`);
            
            TITAN_VAULT = await response.json();
            
            // Check for duplicate IDs (Integrity Check)
            const unique = new Set(TITAN_VAULT.map(item => item.id));
            if (unique.size !== TITAN_VAULT.length) console.warn("Duplicate IDs detected in JSON.");

            render(TITAN_VAULT);
            console.log(`Vault Online: ${TITAN_VAULT.length} Modules Loaded.`);
            
        } catch (error) {
            console.error("Critical Failure:", error);
            DOM.grid.innerHTML = `
                <div style="color: red; text-align: center; margin-top: 50px;">
                    <h1>SYSTEM FAILURE</h1>
                    <p>${error.message}</p>
                    <p>Check JSON syntax (commas, brackets) at line 1500.</p>
                </div>
            `;
        }
    }

    // --- 2. RENDER ENGINE (Virtual DOM) ---
    function render(dataset) {
        if (!DOM.grid) return;
        DOM.grid.innerHTML = '';
        const fragment = document.createDocumentFragment();

        dataset.forEach(entry => {
            // Safe Access for nested properties
            const metaDesc = entry.meta ? entry.meta.description : "No Data";
            const tags = entry.tags ? entry.tags.join(', ') : "";

            const card = document.createElement('div');
            card.className = 'game-card';
            card.innerHTML = `
                <div class="card-img-wrapper">
                    <img src="${entry.thumb}" loading="lazy" onerror="this.src='https://via.placeholder.com/150'">
                </div>
                <div class="card-content">
                    <div class="card-header">
                        <h3>${entry.title}</h3>
                        <span class="badge ${entry.category.toLowerCase()}">${entry.category}</span>
                    </div>
                    <div class="card-meta">
                        <small>${metaDesc}</small>
                    </div>
                    <div class="card-tags" style="display:none;">${tags}</div>
                    <button class="launch-btn">Launch</button>
                </div>
            `;

            card.querySelector('.launch-btn').onclick = () => launchProtocol(entry);
            fragment.appendChild(card);
        });

        DOM.grid.appendChild(fragment);
    }

    // --- 3. LAUNCH PROTOCOL (Stealth v3) ---
    function launchProtocol(entry) {
        // Direct launch for uncloakable sites
        if (entry.settings && entry.settings.cloak === false) {
            window.open(entry.url, '_blank');
            return;
        }

        const win = window.open('about:blank', '_blank');
        if (!win) return alert("System Blocked: Enable Popups");

        const doc = win.document;
        
        // Disguise
        doc.title = "Google Drive";
        const icon = doc.createElement('link');
        icon.rel = 'icon';
        icon.href = 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png';
        doc.head.appendChild(icon);

        // Iframe Construction
        const iframe = doc.createElement('iframe');
        iframe.src = entry.url;
        iframe.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; border:none; background:#000;";
        iframe.allow = "fullscreen; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; cursor-lock";
        
        doc.body.style.margin = '0';
        doc.body.style.overflow = 'hidden';
        doc.body.appendChild(iframe);
    }

    // --- 4. INPUT HANDLERS ---
    if (DOM.search) {
        DOM.search.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const results = TITAN_VAULT.filter(item => {
                // Search Title, Description, and Tags
                const titleMatch = item.title.toLowerCase().includes(query);
                const metaMatch = item.meta && item.meta.description.toLowerCase().includes(query);
                const tagMatch = item.tags && item.tags.some(t => t.toLowerCase().includes(query));
                
                return titleMatch || metaMatch || tagMatch;
            });
            render(results);
        });
    }

    DOM.filters.forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.innerText.trim();
            render(cat === 'All' ? TITAN_VAULT : TITAN_VAULT.filter(i => i.category === cat));
        });
    });

    // Start System
    bootSystem();
});
