/* PROJECT ARCHIVE - BEAST ENGINE v15.0 */
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('games-grid');
    const search = document.getElementById('search');
    const filterBtns = document.querySelectorAll('.filter-btn, button');
    let ALL_DATA = [];

    // LOAD DATA
    fetch('./games.json')
        .then(res => res.json())
        .then(data => {
            ALL_DATA = data;
            render(ALL_DATA);
        })
        .catch(err => {
            console.error("JSON Error: Check for extra commas!", err);
            if(grid) grid.innerHTML = `<h2 style="color:red; text-align:center;">VAULT CRASHED: Check JSON Line 366!</h2>`;
        });

    function render(list) {
        if(!grid) return;
        grid.innerHTML = '';
        list.forEach(item => {
            const card = document.createElement('div');
            card.className = 'game-card';
            card.innerHTML = `
                <div class="card-img-wrapper"><img src="${item.thumb}" loading="lazy" onerror="this.src='https://via.placeholder.com/150/111/444?text=Archive'"></div>
                <div class="card-content">
                    <h3>${item.title}</h3>
                    <span class="badge">${item.category}</span>
                    <button class="launch-btn">Launch</button>
                </div>
            `;
            card.querySelector('.launch-btn').onclick = () => launch(item);
            grid.appendChild(card);
        });
    }

    function launch(item) {
        if (item.cloak === false) {
            window.open(item.url, '_blank');
            return;
        }

        const win = window.open('about:blank', '_blank');
        if(!win) return alert("Please enable popups!");

        win.document.title = "Google Docs";
        const iframe = win.document.createElement('iframe');
        iframe.style = "position:fixed; top:0; left:0; width:100vw; height:100vh; border:none; margin:0; padding:0;";
        iframe.src = item.url;
        // Allows cursor-lock for 1v1.lol and Shell Shockers
        iframe.allow = "fullscreen; autoplay; cursor-lock; encrypted-media";
        
        win.document.body.appendChild(iframe);
        win.document.body.style.margin = "0";
    }

    // SEARCH & DYNAMIC FILTER
    if(search) {
        search.oninput = (e) => {
            const val = e.target.value.toLowerCase();
            render(ALL_DATA.filter(i => i.title.toLowerCase().includes(val)));
        };
    }

    filterBtns.forEach(btn => {
        btn.onclick = () => {
            const cat = btn.innerText.trim();
            render(cat === 'All' ? ALL_DATA : ALL_DATA.filter(i => i.category === cat));
        };
    });
});
