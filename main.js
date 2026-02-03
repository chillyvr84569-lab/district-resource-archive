const container = document.getElementById('games-container');
const searchInput = document.getElementById('searchInput');

// 1. Load Data from your JSON
fetch('games.json')
    .then(res => res.json())
    .then(data => {
        renderCards(data);
        searchInput.addEventListener('input', () => {
            const term = searchInput.value.toLowerCase();
            renderCards(data.filter(item => item.title.toLowerCase().includes(term)));
        });
    });

// 2. The Stealth Cloaker Function
function openInCloakedTab(url, title) {
    const win = window.open('about:blank', '_blank');
    if (!win) {
        window.open(url, '_blank');
        return;
    }

    win.document.title = title || "Google Docs";
    const body = win.document.body;
    body.style.margin = '0';
    body.style.height = '100vh';

    const iframe = win.document.createElement('iframe');
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.src = url;

    body.appendChild(iframe);
}

// 3. Render the Boring Grid
function renderCards(data) {
    if (!container) return;
    container.innerHTML = "";
    
    const categories = ["Games", "Social Media", "Movies", "Proxies"];

    categories.forEach(cat => {
        const filtered = data.filter(item => item.category === cat);
        
        if (filtered.length > 0) {
            const header = document.createElement('h2');
            header.className = "category-title";
            header.textContent = cat;
            container.appendChild(header);

            const group = document.createElement('div');
            group.className = "fat-row-grid";

            filtered.forEach(item => {
                const card = document.createElement('div');
                card.className = 'game-card';
                
                const iconHtml = (item.thumb && item.thumb.startsWith('http')) 
                    ? `<img src="${item.thumb}" class="card-img" onerror="this.style.display='none'">` 
                    : `<div style="font-size: 20px;">📄</div>`;

                card.innerHTML = `
                    <div class="icon-box">${iconHtml}</div>
                    <div class="card-title">${item.title}</div>
                `;
                
                // HYBRID LOGIC: Fixes the "Refused to Connect" error
                card.onclick = () => {
                    const sensitiveSites = ['script.google.com', 'now.gg', 'google.com', 'translate.google.com'];
                    const isSensitive = sensitiveSites.some(site => item.url.includes(site));

                    if (isSensitive) {
                        // Open normally if the site blocks iframes
                        window.open(item.url, '_blank');
                    } else {
                        // Use the cloaker for standard games/sites
                        openInCloakedTab(item.url, item.title);
                    }
                };
                group.appendChild(card);
            });
            
            container.appendChild(group);
        }
    });
}

// 4. Boring Clock for "Study" appearance
setInterval(() => {
    const clock = document.getElementById('clock');
    if (clock) clock.textContent = new Date().toLocaleTimeString();
}, 1000);

// 5. Panic Button (Escape key flips to Canvas)
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') window.location.href = 'https://canvas.instructure.com/login/canvas';
});
