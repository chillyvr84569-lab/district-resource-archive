const container = document.getElementById('game-container');
const searchBar = document.getElementById('search-bar');

fetch('/district-resource-archive/games.json')
    .then(res => res.json())
    .then(data => renderCards(data))
    .catch(err => console.error("Error:", err));

function renderCards(data) {
    if (!container) return;
    container.innerHTML = "";
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'game-card';
        const isUrl = item.thumb.startsWith('http');
        const iconHtml = isUrl 
            ? `<img src="${item.thumb}" onerror="this.src='https://via.placeholder.com/150'">` 
            : `<div style="font-size: 80px; padding: 20px;">${item.thumb}</div>`;

        card.innerHTML = `${iconHtml}<h3>${item.title}</h3>`;
        // DIRECT OPEN: This fixes the "Refused to Connect" error
        card.onclick = () => window.open(item.url, '_blank');
        container.appendChild(card);
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
