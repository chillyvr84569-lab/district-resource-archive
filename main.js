const container = document.getElementById('game-container');
const searchBar = document.getElementById('search-bar');

fetch('./games.json')
    .then(res => res.json())
    .then(data => {
        window.allItems = data;
        renderCards(data);
    })
    .catch(err => console.error("Load Error:", err));

function renderCards(data) {
    if (!container) return;
    container.innerHTML = "";
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `<img src="${item.thumb}"><h3>${item.title}</h3>`;
        card.onclick = () => {
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

if (searchBar) {
    searchBar.oninput = () => {
        const query = searchBar.value.toLowerCase();
        const filtered = window.allItems.filter(i => i.title.toLowerCase().includes(query));
        renderCards(filtered);
    };
}

window.addEventListener('keydown', (e) => {
    if (e.key === '~') window.location.replace("https://classroom.google.com");
});
