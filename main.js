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
    
    // Define the order of sections
    const categories = ["Games", "Social Media", "Movies", "Proxies"];

    categories.forEach(cat => {
        const filtered = data.filter(item => item.category === cat);
        
        if (filtered.length > 0) {
            // Create the Section Header (The "Fat Row" title)
            const sectionHeader = document.createElement('h2');
            sectionHeader.className = "category-title";
            sectionHeader.textContent = cat;
            container.appendChild(sectionHeader);

            // Create a wrapper for the icons so they stay grouped but "fat"
            const group = document.createElement('div');
            group.className = "category-group";

            filtered.forEach(item => {
                const card = document.createElement('div');
                card.className = 'game-card';
                
                const iconHtml = (item.thumb && item.thumb.startsWith('http')) 
                    ? `<img src="${item.thumb}" onerror="this.src='https://raw.githubusercontent.com/TristanLeila/App-Icons/main/Steam.png'">` 
                    : `<div style="font-size: 50px; padding: 15px;">🎮</div>`;

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

// Clock Logic
function updateClock() {
    const clock = document.getElementById('clock');
    if (clock) {
        const now = new Date();
        clock.textContent = now.getHours().toString().padStart(2, '0') + ":" + 
                           now.getMinutes().toString().padStart(2, '0') + ":" + 
                           now.getSeconds().toString().padStart(2, '0');
    }
}
setInterval(updateClock, 1000);
updateClock();

// Panic Button
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') window.location.href = 'https://canvas.instructure.com/login/canvas';
});
