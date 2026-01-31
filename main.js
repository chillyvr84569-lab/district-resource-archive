const container = document.getElementById('games-container');
const searchInput = document.getElementById('searchInput');

// 1. Fetch and Display Apps
fetch('games.json')
    .then(res => res.json())
    .then(data => {
        renderCards(data);
        
        // Unified Search Logic
        searchInput.addEventListener('input', () => {
            const term = searchInput.value.toLowerCase();
            const filtered = data.filter(item => 
                item.title.toLowerCase().includes(term)
            );
            renderCards(filtered);
        });
    })
    .catch(err => console.error("Error loading JSON:", err));

// 2. The Grid Rendering Function
function renderCards(data) {
    if (!container) return;
    container.innerHTML = "";

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'game-card';
        
        // Handle Icons: Use thumb URL if it exists, otherwise use a generic emoji
        const iconHtml = (item.thumb && item.thumb.startsWith('http')) 
            ? `<img src="${item.thumb}" onerror="this.src='https://raw.githubusercontent.com/TristanLeila/App-Icons/main/Steam.png'">` 
            : `<div style="font-size: 50px; padding: 15px;">🎮</div>`;

        card.innerHTML = `
            <div class="icon-box">${iconHtml}</div>
            <h3 class="card-title">${item.title}</h3>
        `;
        
        // Direct Open to avoid X-Frame-Options blocking (Snapchat/Instagram)
        card.onclick = () => {
            window.open(item.url, '_blank');
        };
        
        container.appendChild(card);
    });
}

// 3. Huge LED Clock Logic (24-hour style to match screenshot)
function updateClock() {
    const clockElement = document.getElementById('clock');
    if (clockElement) {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        clockElement.textContent = `${h}:${m}:${s}`;
    }
}
setInterval(updateClock, 1000);
updateClock();

// 4. Panic Button (Canvas Redirect)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        window.location.href = 'https://canvas.instructure.com/login/canvas';
    }
});
