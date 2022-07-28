const player1 = prompt("Please enter Player 1 Name");
const red = "#e15258";
const player2 = prompt("Please enter Player 2 Name");
const yellow = '#e59a13';
const game = new Game(new Board(), createPlayers(player1, player2));

/**
 * Creates two player objects
 * @returns {Array.<Player>} An array of two player objects.
 */
function createPlayers(player1, player2) {
    const playerOne = new Player(player1, 1, red, true);
    playerOne.createTokens(21);
    const playerTwo = new Player(player2, 2, yellow, null);
    playerTwo.createTokens(21);
    return [playerOne, playerTwo];
}

/**
 * Listens for click on `#begin-game` and calls startGame() on game object
 */
document.getElementById('begin-game').addEventListener("click", (e) => {
    game.startGame();
    e.target.style.display = 'none';
    document.getElementById('play-area').style.opacity = '1';
});

/**
 * Listens for user input for game controls.
 */
document.addEventListener('keydown', (e) => {
    game.moveTokenHandler(e);
});