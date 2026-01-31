const container = document.getElementById('game-container');
const searchBar = document.getElementById('search-bar');

fetch('./games.json')
    .then(res => res.json())
    .then(data => renderCards(data))
    .catch(err => console.error("Data Load Error:", err));

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
    // This fixes the Screenshot 214905 error by opening a new cloaked tab
    const win = window.open('about:blank', '_blank');
    if (win) {
        win.opener = null;
        win.document.write(`
            <html>
                <head>
                    <title>My Drive - Google Drive</title>
                    <link rel="icon" href="https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png">
                    <style>body,html{margin:0;padding:0;height:100vh;overflow:hidden}iframe{width:100%;height:100%;border:none}</style>
                </head>
                <body><iframe src="${url}"></iframe></body>
            </html>
        `);
    } else {
        window.location.href = url;
    }
}

// Proxy Search Logic
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
