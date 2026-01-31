const container = document.getElementById('game-container');
const searchBar = document.getElementById('search-bar');

// Stealth Google Proxy
const googleProxy = "https://translate.google.com/translate?sl=en&tl=es&u=";

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
        
        // Supports both image URLs and the Camera Emoji
        const isUrl = item.thumb.startsWith('http');
        const iconHtml = isUrl 
            ? `<img src="${item.thumb}" onerror="this.src='https://via.placeholder.com/150'">` 
            : `<div style="font-size: 80px; padding: 20px;">${item.thumb}</div>`;

        card.innerHTML = `${iconHtml}<h3>${item.title}</h3>`;
        card.onclick = () => openLink(item.url);
        container.appendChild(card);
    });
}

function openLink(url) {
    let targetUrl = url;
    // Proxy external sites, but keep Google Docs direct
    if (!url.includes("google.com")) {
        targetUrl = googleProxy + encodeURIComponent(url);
    }
    
    const win = window.open('about:blank', '_blank');
    if (win) {
        win.opener = null;
        win.document.write(`
            <html>
                <head>
                    <title>System Resource</title>
                    <meta name="google" content="notranslate">
                </head>
                <body style="margin:0;padding:0;overflow:hidden">
                    <iframe src="${targetUrl}" style="width:100%;height:100vh;border:none"></iframe>
                </body>
            </html>
        `);
    }
}

// Proxy Search: Type a site (e.g., twitter.com) in search and hit ENTER
if (searchBar) {
    searchBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            let val = searchBar.value.trim();
            if (val.includes('.')) {
                if (!val.startsWith('http')) val = 'https://' + val;
                openLink(val);
            }
        }
    });
}

// Panic Key: Press '~' to go to Classroom
window.addEventListener('keydown', (e) => {
    if (e.key === '~' || e.key === '`') window.location.replace("https://classroom.google.com");
});
