const container = document.getElementById('game-container');
const searchBar = document.getElementById('search-bar');
const panicScreen = document.getElementById('panic-screen');
let allItems = [];

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
        card.onclick = () => {
            if (item.type === "new") {
                window.open(item.url, '_blank');
            } else {
                document.getElementById('game-screen').src = item.url;
                document.getElementById('overlay').classList.remove('hidden');
            }
        };
        container.appendChild(card);
    });
}

// Search Filter
searchBar.oninput = () => {
    const query = searchBar.value.toLowerCase();
    renderCards(allItems.filter(i => i.title.toLowerCase().includes(query)));
};

// Close Overlay
document.getElementById('close-btn').onclick = () => {
    document.getElementById('overlay').classList.add('hidden');
    document.getElementById('game-screen').src = "";
};

// PANIC KEY: Press ~ (Tilde) to hide everything
window.addEventListener('keydown', (e) => {
    if (e.key === '~') {
        document.body.innerHTML = `<iframe src="https://docs.google.com/document/d/1_9iE6V0SOnN37Y9Fp_2e_A0l0zF0O0vW/preview" style="width:100%;height:100vh;border:none;"></iframe>`;
        document.title = "Google Docs";
    }
});
