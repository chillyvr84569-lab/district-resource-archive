card.onclick = () => {
    if (item.type === "new") {
        // This opens a 'blank' window first so Securly doesn't see your site as the 'Referrer'
        const win = window.open();
        win.opener = null; 
        win.location = item.url;
    } else {
        // ... standard iframe code
    }
};
