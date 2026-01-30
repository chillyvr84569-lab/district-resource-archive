card.onclick = function() {
            // We are using the URL directly now to avoid 404s
            const finalUrl = item.url; 
            
            if (item.category === "proxy") {
                window.open(finalUrl, '_blank');
            } else {
                document.getElementById('game-screen').src = finalUrl;
                document.getElementById('overlay').classList.remove('hidden');
            }
        };
