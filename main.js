/** * MASTER JS PORTAL CODE 
 * Optimized for Home Testing & School Success
 */

const container = document.getElementById('game-container');
const searchBar = document.getElementById('search-bar');

// 1. Fetching Logic (Fixed for Subfolders)
fetch('./games.json')
    .then(res => res.json())
    .then(data => {
        renderCards(data);
        window.allItems = data; 
    })
    .catch(err => console.error("Could not load games.json. Check for commas!", err));

// 2. Card Rendering Logic
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
            handleRedirection(item);
        };
        container.appendChild(card);
    });
}

// 3. The Redirection Engine (Bypass + Stealth)
function handleRedirection(item) {
    let targetUrl = item.url;

    // Check if the URL is encoded (Stealth Mode)
    if (item.type === "stealth") {
        targetUrl = atob(item.url); 
    }

    // Success Hack: Add a safety suffix (Bypasses some school filters)
    const bypassSuffix = "#translate.google.com";
    const finalUrl = targetUrl + (targetUrl.includes('?') ? '&' : '') + bypassSuffix;

    // Open in New Tab with Referrer Stripping (High Success Rate)
    const win = window.open('about:blank', '_blank');
    if (win) {
        win.opener = null; // Cuts the cord between your site and social media
        win.location.replace(finalUrl);
    } else {
        alert("Please allow pop-ups to open resources!");
    }
}

// 4. Panic Key Logic (Press ~ to hide)
window.addEventListener('keydown', (e) => {
    if (e.key === '~' || e.key === '`') {
        window.location.replace("https://docs.google.com/document/u/0/");
    }
});

// 5. Search Filtering
if (searchBar) {
    searchBar.oninput = () => {
        const query = searchBar.value.toLowerCase();
        const filtered = window.allItems.filter(i => 
            i.title.toLowerCase().includes(query)
        );
        renderCards(filtered);
    };
}

// 6. Overlay Controls
const closeBtn = document.getElementById('close-btn');
if (closeBtn) {
    closeBtn.onclick = () => {
        document.getElementById('overlay').classList.add('hidden');
        document.getElementById('game-screen').src = "";
    };
}
