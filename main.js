const container = document.getElementById('games-container');
const searchInput = document.getElementById('searchInput');

fetch('games.json')
    .then(res => res.json())
    .then(data => {
        renderCards(data);
        searchInput.addEventListener('input', () => {
            const term = searchInput.value.toLowerCase();
            renderCards(data.filter(item => item.title.toLowerCase().includes(term)));
        });
    });

function renderCards(data) {
    if (!container) return;
    container.innerHTML = "";
    
    const categories = ["Games", "Social Media", "Movies", "Proxies"];

    categories.forEach(cat => {
        const filtered = data.filter(item => item.category === cat);
        
        if (filtered.length > 0) {
            // Add the category name as a section header
            const header = document.createElement('h2');
            header.className = "category-title";
            header.textContent = cat;
            container.appendChild(header);

            // Create a wrapper that allows icons to fill multiple rows
            const group = document.createElement('div');
            group.className = "fat-row-grid";

            filtered.forEach(item => {
                const card = document.createElement('div');
                card.className = 'game-card';
                
                const iconHtml = (item.thumb && item.thumb.startsWith('http')) 
                    ? `<img src="${item.thumb}" class="card-img" onerror="this.src='https://raw.githubusercontent.com/TristanLeila/App-Icons/main/Steam.png'">` 
                    : `<div class="card-emoji">🎮</div>`;

                card.innerHTML = `
                    <div class="icon-box">${iconHtml}</div>
                    <h3 class="card-title">${item.title}</h3>
                `;
                
                card.onclick = () => window.open(item.url, '_blank');
                group.appendChild(card);
            });
            
            container.appendChild(group);
        }
    });
}

// 24hr Clock Logic
setInterval(() => {
    const clock = document.getElementById('clock');
    if (clock) {
        const now = new Date();
        clock.textContent = now.getHours().toString().padStart(2, '0') + ":" + 
                           now.getMinutes().toString().padStart(2, '0') + ":" + 
                           now.getSeconds().toString().padStart(2, '0');
    }
}, 1000);

// Panic Button
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') window.location.href = 'https://canvas.instructure.com/login/canvas';
});
