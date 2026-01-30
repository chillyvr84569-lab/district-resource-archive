const container = document.getElementById('game-container');
const searchBar = document.getElementById('search-bar');

// A reliable proxy prefix for school use
const proxyUrl = "https://api.allorigins.win/raw?url=";

fetch('./games.json')
    .then(res => res.json())
    .then(data => {
        window.allItems = data;
        renderCards(data);
    })
    .catch(err => console.error("Data Load Error:", err));

function renderCards(data) {
    if (!container) return;
    container.innerHTML = "";
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
            <img src="${item.thumb}" onerror="this.src='https://via.placeholder.com/150?text=Icon'">
            <h3>${item.title}</h3>
        `;
        
        card.onclick = () => {
            // Logic: Use proxy for social media/steam, direct for others
            let finalUrl = item.url;
            if (item.title === "Instagram" || item.title === "Steam Store") {
                finalUrl = proxyUrl + encodeURIComponent(item.url);
            }

            const win = window.open('about:blank', '_blank');
            if (win) {
                win.opener = null;
                win.location.href = finalUrl;
            } else {
                window.location.href = finalUrl;
            }
        };
        container.appendChild(card);
    });
}

// Panic Key
window.addEventListener('keydown', (e) => {
    if (e.key === '~') window.location.replace("https://classroom.google.com");
});
