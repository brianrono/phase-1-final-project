// fetch('https://www.freetogame.com/api/games')
//   .then(response => response.text())
//   .then(data => console.log(data))
//   .catch(error => console.error(error));


const form = document.querySelector('form');
const gameDetails = document.querySelector('.game-details');
const baseUrl = 'http://localhost:3000';


form.addEventListener('submit', e => {
    e.preventDefault();

    const gameId = document.querySelector('#game-id').value;

    fetch(`${baseUrl}/games?id=${gameId}`) // fetch(`url` mode: no-cors) ???
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

const header = document.querySelector('h1'); // when the header is clicked it refreshes the game details
  header.addEventListener('click',() => {
      location.reload();
  });

// this function displays the web page with an example of how the data is loaded
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

//   this' a function to sort games by platform
  function sortByPlatform() {
    event.preventDefault();
    fetch(`${baseUrl}/games?_sort=platform`)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(games => {
        if (games.length === 0) {
          throw new Error('No games found');
        }
        const gamesHtml = games.slice(0, 10).map(game => { // since the database is heavy, I only generated the first 10 games
          return `
            <li data-game-id="${game.id}">
              <img src="${game.thumbnail}" alt="${game.title}">
              <h2>${game.title}</h2>
              <p><strong>Genre:</strong> ${game.genre}</p>
              <p><strong>Platform:</strong> ${game.platform}</p>
              <p><strong>Publisher:</strong> ${game.publisher}</p>
              <p><strong>Developer:</strong> ${game.developer}</p>
              <p><strong>Release Date:</strong> ${game.release_date}</p>
              <p>${game.short_description}</p>
              <p><strong>Plays:</strong> ${game.plays}</p>
              <button class="upvote-button" data-game-id="${game.id}" onclick="upvoteGame(${game.id})">Upvote</button>
              <span class="upvote-count" id="upvote-count-${game.id}">${game.upvotes || 0}</span>
            </li>
          `;
        }).join('');

        const gameList = document.querySelector('#game-details ul');
        document.addEventListener('DOMContentLoaded', () => {
          // Your JavaScript code here        
          gameList.addEventListener('click', event => {
            if (event.target.classList.contains('upvote-button')) {
              const gameElement = event.target.closest('li');
              const gameId = gameElement.dataset.gameId;
              const upvoteCount = gameElement.querySelector('.upvote-count');
              const currentUpvotes = parseInt(upvoteCount.textContent);
              const newUpvotes = currentUpvotes + 1;
              fetch(`${baseUrl}/games/${gameId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  upvotes: newUpvotes
                })
              })
              .then(response => {
                if (!response.ok) {
                  throw new Error(response.statusText);
                }
                return response.json();
              })
              .then(game => {
                upvoteCount.textContent = game.upvotes;
              })
              .catch(error => {
                console.error('Error updating upvotes:', error);
              });
            }
          });
        });
  
        gameDetails.innerHTML = `<ul>${gamesHtml}</ul>`;
        gameDetails.style.display = 'block';

        // add event listener to the upvote buttons to display the votes
        const upvoteButtons = document.querySelectorAll('.upvote-button');
        upvoteButtons.forEach(button => {
          button.addEventListener('click', function(e) {
            const upvoteCountEl = e.target.nextElementSibling;
            let upvoteCount = parseInt(upvoteCountEl.textContent);
            upvoteCount++;
            upvoteCountEl.textContent = upvoteCount;
          });
        });
      })
      
      .catch(error => {
        console.error('Error fetching games:', error);
        gameDetails.innerHTML = error.message;
        gameDetails.style.display = 'block';        
      });
    }