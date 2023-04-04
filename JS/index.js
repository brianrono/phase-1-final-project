const form = document.querySelector('form');
const gameDetails = document.querySelector('.game-details');
const baseUrl = 'http://localhost:3000';

form.addEventListener('submit', e => {
    e.preventDefault();

    const gameId = document.querySelector('#game-id').value;

    fetch(`${baseUrl}/games?id=${gameId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .then(games => {
            if (games.length === 0) {
                throw new Error('Game not found');
            }
            const game = games[0];
            const gameHtml = `
                <img src="${game.thumbnail}" alt="${game.title}">
                <h2>${game.title}</h2>
                <p><strong>Genre:</strong> ${game.genre}</p>
                <p><strong>Platform:</strong> ${game.platform}</p>
                <p><strong>Publisher:</strong> ${game.publisher}</p>
                <p><strong>Developer:</strong> ${game.developer}</p>
                <p><strong>Release Date:</strong> ${game.release_date}</p>
                <p>${game.short_description}</p>
            `;

            gameDetails.innerHTML = gameHtml;
            gameDetails.style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching game details:', error);
            gameDetails.innerHTML = error.message;
            gameDetails.style.display = 'block';
        });
});
function displayExampleGame() {
    const exampleGame = {
        id: 452,
        title: "Call Of Duty: Warzone",
        thumbnail: "https://www.freetogame.com/g/452/thumbnail.jpg",
        short_description: "A standalone free-to-play battle royale and modes accessible via Call of Duty: Modern Warfare.",
        game_url: "https://www.freetogame.com/open/call-of-duty-warzone",
        genre: "Shooter",
        platform: "PC (Windows)",
        publisher: "Activision",
        developer: "Infinity Ward",
        release_date: "2020-03-10",
        freetogame_profile_url: "https://www.freetogame.com/call-of-duty-warzone"
    };
  
    const gameHtml = `
      <img src="${exampleGame.thumbnail}" alt="${exampleGame.title}">
      <h2>${exampleGame.title}</h2>
      <p><strong>Genre:</strong> ${exampleGame.genre}</p>
      <p><strong>Platform:</strong> ${exampleGame.platform}</p>
      <p><strong>Publisher:</strong> ${exampleGame.publisher}</p>
      <p><strong>Developer:</strong> ${exampleGame.developer}</p>
      <p><strong>Release Date:</strong> ${exampleGame.release_date}</p>
      <p>${exampleGame.short_description}</p>
    `;
  
    gameDetails.innerHTML = gameHtml;
    gameDetails.style.display = 'block';
  }
  window.addEventListener('load', displayExampleGame);
  