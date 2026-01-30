const proxyBase = "https://tinf.io/service/";
const container = document.getElementById('game-container');
const searchBar = document.getElementById('search-bar');
let allItems = [];

// Load the games from our JSON file
fetch('games.json')
    .then(res => res.json())
    .then(data => {
        allItems = data;
        renderCards(allItems);
    });

function renderCards(data) {
    container.innerHTML = "";
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `<img src="${item.thumb}"><h3>${item.title}</h3>`;
        
        card.onclick = function() {
            const proxiedUrl = proxyBase + encodeURIComponent(item.url);
            if (item.category === "proxy") {
                window.open(proxiedUrl, '_blank');
            } else {
                document.getElementById('game-screen').src = proxiedUrl;
                document.getElementById('overlay').classList.remove('hidden');
            }
        };
        container.appendChild(card);
    });
}

// Search Filter
searchBar.oninput = () => {
    const query = searchBar.value.toLowerCase();
    const filtered = allItems.filter(i => i.title.toLowerCase().includes(query));
    renderCards(filtered);
};

// Close Game Overlay
document.getElementById('close-btn').onclick = () => {
    document.getElementById('overlay').classList.add('hidden');
    document.getElementById('game-screen').src = "";
};
