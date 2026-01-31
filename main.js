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
            // 1. Create the Section Header
            const header = document.createElement('h2');
            header.className = "category-title";
            header.textContent = cat;
            container.appendChild(header);

            // 2. Create the "Fat" Wrapper
            const group = document.createElement('div');
            group.className = "category-group"; // This is the 'Fat Row'

            filtered.forEach(item => {
                const card = document.createElement('div');
                card.className = 'game-card';
                
                const iconHtml = (item.thumb && item.thumb.startsWith('http')) 
                    ? `<img src="${item.thumb}" onerror="this.src='https://raw.githubusercontent.com/TristanLeila/App-Icons/main/Steam.png'">` 
                    : `<div style="font-size: 40px; padding: 10px;">🎮</div>`;

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

// Clock & Panic Button
setInterval(() => {
    const clock = document.getElementById('clock');
    if (clock) clock.textContent = new Date().toLocaleTimeString('en-GB');
}, 1000);

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') window.location.href = 'https://canvas.instructure.com/login/canvas';
});
