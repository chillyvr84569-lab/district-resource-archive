/**
 * 🟡 VAULT-OS: GOLD EDITION
 * Features: Power Monitoring, Reactor Clock, Ghost Image Fallback
 */

const CONFIG = {
    jsonPath: './games.json',
    proxyPrefix: 'https://api.allorigins.win/raw?url=', 
    ghostImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTAxMDEwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZpbGw9IiNmZmNjMDAiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIHN0eWxlPSJkb21pbmFudC1iYXNlbGluZTptaWRkbGUiPltOTyBTSUdOQUxdPC90ZXh0Pjwvc3ZnPg=='
};

// --- STATUS BAR LOGIC ---
function updateStatus() {
    // Clock
    const now = new Date();
    document.getElementById('reactor-clock').innerText = `REACTOR TIME: ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    // Battery
    if (navigator.getBattery) {
        navigator.getBattery().then(battery => {
            const level = Math.floor(battery.level * 100);
            document.getElementById('battery-status').innerText = `POWER CELL: ${level}% ${battery.charging ? '⚡' : ''}`;
        });
    }
}
setInterval(updateStatus, 1000);

// --- TAB SYSTEM ---
function switchTab(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    btn.classList.add('active');
}

// --- VAULT ENGINE ---
class VaultOS {
    constructor() {
        this.db = [];
        this.init();
    }

    async init() {
        try {
            const res = await fetch(CONFIG.jsonPath);
            this.db = await res.json();
            this.render();
            this.setupProxy();
        } catch (e) {
            console.error("VAULT DATA CORRUPTED", e);
        }
    }

    setupProxy() {
        document.getElementById('proxy-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                let val = e.target.value.trim();
                if (!val) return;
                let target = val.includes('.') ? (val.startsWith('http') ? val : `https://${val}`) : `https://www.google.com/search?q=${encodeURIComponent(val)}`;
                this.launch(target, "TERMINAL SEARCH");
            }
        });
    }

    launch(url, title) {
        const win = window.open('about:blank', '_blank');
        if (!win) return alert("VAULT ACCESS DENIED: Enable Popups");

        win.document.title = "Google Drive"; // Stealth
        const iframe = win.document.createElement('iframe');
        Object.assign(iframe.style, { position: 'fixed', inset: '0', width: '100vw', height: '100vh', border: 'none', background: '#000' });
        
        // Using encodeURIComponent to bypass basic filters
        iframe.src = `${CONFIG.proxyPrefix}${encodeURIComponent(url)}`;
        win.document.body.appendChild(iframe);
    }

    render() {
        const grid = document.getElementById('games-grid');
        grid.innerHTML = this.db.map(item => `
            <div class="gold-card">
                <img src="${item.thumb}" onerror="this.src='${CONFIG.ghostImage}'">
                <div style="margin: 10px 0; font-size: 14px;">${item.title}</div>
                <button class="btn-init" onclick="Vault.launch('${item.url}', '${item.title.replace(/'/g, "\\'")}')">ACCESS</button>
            </div>
        `).join('');
    }
}

const Vault = new VaultOS();
