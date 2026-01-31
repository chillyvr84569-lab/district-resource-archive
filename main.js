const container = document.getElementById('game-container');
const searchBar = document.getElementById('search-bar');

fetch('/district-resource-archive/games.json')
    .then(res => res.json())
    .then(data => renderCards(data))
    .catch(err => console.error("Error:", err));

function renderCards(data) {
    if (!container) return;
    container.innerHTML = "";

    const categories = ["Games", "Social Media", "Movies", "Proxies"];

    categories.forEach(cat => {
        // Create a heading for each category
        const section = document.createElement('div');
        section.style.width = "100%";
        section.innerHTML = `<h2 style="color: #bc13fe; text-shadow: 0 0 10px #bc13fe; margin-top: 30px;">${cat}</h2>`;
        container.appendChild(section);

        // Filter data for this category
        const filtered = data.filter(item => item.category === cat);

        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'game-card';
            const isUrl = item.thumb.startsWith('http');
            const iconHtml = isUrl 
                ? `<img src="${item.thumb}" onerror="this.src='https://via.placeholder.com/150'">`
                : `<div style="font-size: 80px; padding: 20px;">${item.thumb}</div>`;

            card.innerHTML = `${iconHtml}<h3 class="card-title">${item.title}</h3>`;
            card.onclick = () => window.open(item.url, '_blank');
            container.appendChild(card);
        });
    });
}
// Search Logic
if (searchBar) {
    searchBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            let val = searchBar.value.trim();
            if (val.includes('.')) {
                if (!val.startsWith('http')) val = 'https://' + val;
             window.open(val, '_blank');
            }
        }
    });
}
// This function calculates the time and updates the screen
function startClock() {
    const clockElement = document.getElementById('digital-clock');
    
    // Check if the clock exists on the page
    if (clockElement) {
        setInterval(() => {
            const now = new Date();
            
            // Format time as HH:MM:SS
            let hours = String(now.getHours()).padStart(2, '0');
            let minutes = String(now.getMinutes()).padStart(2, '0');
            let seconds = String(now.getSeconds()).padStart(2, '0');
            
            clockElement.textContent = `${hours}:${minutes}:${seconds}`;
        }, 1000); // This makes it update every 1 second
    }
}

// Kick off the clock
startClock();
// The Panic Button Script
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // This instantly redirects the tab to Canvas
        window.location.href = 'https://canvas.instructure.com/login/canvas';
    }
});
