document.addEventListener('DOMContentLoaded', () => {
    // Page navigation for Astro without client-side routing
    const navLinks = document.querySelectorAll('.nav-link');
    const playButtons = document.querySelectorAll('.play-game-btn');
    const backButtons = document.querySelectorAll('.back-btn');
    
    // Note: Astro handles the page navigation so this is not strictly needed,
    // but it demonstrates how to manage different sections in a single-page app.
    // We'll keep it simple for the Astro project, linking directly to pages.

    // Search functionality
    const gameSearchInput = document.getElementById('game-search');
    const gameListContainer = document.getElementById('game-list');
    
    if (gameSearchInput && gameListContainer) {
        gameSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const gameCards = gameListContainer.querySelectorAll('.game-card');
            gameCards.forEach(card => {
                const gameName = card.dataset.gameName.toLowerCase();
                if (gameName.includes(query)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
});
