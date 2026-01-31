const container = document.getElementById('game-container');
const searchBar = document.getElementById('search-bar');

// The Google Proxy that dodges school filters
const googleProxy = "https://translate.google.com/translate?sl=en&tl=en&u=";

fetch('./games.json')
    .then(res => res.json())
    .then(data => renderCards(data))
    .catch(err => console.error("Could not load resources:", err));

function renderCards(data) {
    if (!container) return;
    container.innerHTML = "";
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'game-card';
        
        // Handles URL images or the Camera Emoji
        const isUrl = item.thumb.startsWith('http');
        const iconHtml = isUrl 
            ? `<img src="${item.thumb}" onerror="this.src='https://via.placeholder.com/150'">` 
            : `<div style="font-size: 80px; padding: 20px;">${item.thumb}</div>`;

        card.innerHTML = `${iconHtml}<h3>${item.title}</h3>`;
        card.onclick = () => openProxy(item.url);
        container.appendChild(card);
    });
}

function openProxy(url) {
    let finalUrl = url;
    // Don't proxy Google Docs, but proxy everything else
    if (!url.includes("google.com")) {
        finalUrl = googleProxy + encodeURIComponent(url);
    }

    // Open in a 'cloaked' tab to strip tracking data from GoGuardian
    const win = window.open('about:blank', '_blank');
    if (win) {
        win.opener = null;
        win.location.replace(finalUrl);
    } else {
        window.location.href = finalUrl;
    }
}

// Proxy Search: Type any URL and hit ENTER
if (searchBar) {
    searchBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            let val = searchBar.value.trim();
            if (val.includes('.')) {
                if (!val.startsWith('http')) val = 'https://' + val;
                openProxy(val);
            }
        }
    });
}

// Panic Key: Press '~' to go to Google Classroom instantly
window.addEventListener('keydown', (e) => {
    if (e.key === '~' || e.key === '`') window.location.replace("https://classroom.google.com");
});
