const container = document.getElementById('game-container');
const searchBar = document.getElementById('search-bar');

// Fetch the game data
fetch('./games.json')
    .then(res => res.json())
    .then(data => {
        window.allItems = data;
        renderCards(data);
    })
    .catch(err => console.error("Error loading JSON:", err));

function renderCards(data) {
    if (!container) return;
    container.innerHTML = "";
    
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
            <img src="${item.thumb}" onerror="this.src='https://via.placeholder.com/150?text=Resource'">
            <h3>${item.title}</h3>
        `;
        
        card.onclick = () => {
            // about:blank is a classic trick to strip the 'referrer' (where you came from)
            const win = window.open('about:blank', '_blank');
            if (win) {
                win.opener = null;
                win.location.href = item.url;
            } else {
                window.location.href = item.url;
            }
        };
        container.appendChild(card);
    });
}

// Search functionality
if (searchBar) {
    searchBar.oninput = () => {
        const query = searchBar.value.toLowerCase();
        const filtered = window.allItems.filter(i => 
            i.title.toLowerCase().includes(query)
        );
        renderCards(filtered);
    };
}

// Panic Key: Press '~' to swap to a safe page
window.addEventListener('keydown', (e) => {
    if (e.key === '~') {
        window.location.replace("https://classroom.google.com");
    }
});
