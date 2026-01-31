const container = document.getElementById('game-container');
const searchBar = document.getElementById('search-bar');

fetch('./games.json')
    .then(res => res.json())
    .then(data => renderCards(data))
    .catch(err => console.error("Error loading resources:", err));

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
        card.onclick = () => openStealth(item.url);
        container.appendChild(card);
    });
}

function openStealth(url) {
    // This creates a sanitized tab that hides your portal from school filters
    const win = window.open('about:blank', '_blank');
    if (win) {
        win.opener = null; 
        win.location.replace(url);
    } else {
        window.location.href = url;
    }
}

// Proxy Search Logic: Type a site and hit Enter
if (searchBar) {
    searchBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            let val = searchBar.value.trim();
            if (val.includes('.')) {
                if (!val.startsWith('http')) val = 'https://' + val;
                openStealth(val);
            }
        }
    });
}

// Panic Key
window.addEventListener('keydown', (e) => {
    if (e.key === '~') window.location.replace("https://classroom.google.com");
});
