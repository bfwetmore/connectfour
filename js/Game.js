class Game {
    constructor() {
        this.board = new Board();
        this.players = this.createPlayers();
        this.ready = false;
    }

    get activePlayer() {
        return this.players.find(player => player.active);
    }

    /**
     * Creates two player objects
     * @returns {Player[]} An array of two player objects.
     */
    createPlayers() {
        return [new Player(prompt("Please enter Player 1 Name"), 1, "#e15258", true),
            new Player(prompt("Please enter Player 2 Name"), 2, '#e59a13')];
    }

    /**
     * Creates the game board and draws first token.
     */
    startGame() {
        this.board.drawHTMLBoard();
        this.activePlayer.activeToken.drawHTMLTokenElement();
        this.ready = true;
    }

    /**
     * Branches code, depending on what key player presses
     * @param e - Keydown event object
     */
    moveTokenHandler(e) {
        if (this.ready) {
            if (e.key === "ArrowLeft") {
                this.activePlayer.activeToken.moveTokenLeft();
            } else if (e.key === "ArrowRight") {
                this.activePlayer.activeToken.moveTokenRight(this.board.columns);

            } else if (e.key === "ArrowDown") {
                this.playToken();

            }
        }
    }

    /**
     * Finds Space object to drop Token into, drops Token.
     */
    playToken() {
        let spaces = this.board.spaces;
        let activeToken = this.activePlayer.activeToken;
        let targetColumn = spaces[activeToken.columnLocation];
        let targetSpace = null;

        for (let space of targetColumn) {
            if (space.token === null) {
                targetSpace = space;
            }
        }

        if (targetSpace !== null) {
            const game = this;
            game.ready = false;

            activeToken.dropToken(targetSpace, function () {
                game.updateGameState(activeToken, targetSpace);
            });
        }
    }

    /**
     * Checks if there is a winner on the board after each token drop.
     * @param   {Object}    target space for dropped token.
     * @return  {boolean}   Boolean value indicating whether the game has been won (true) or not (false)
     */
    checkForWin(target) {
        const owner = target.token.tokenOwner;
        let win = false;

        // vertical
        for (let x = 0; x < this.board.columns; x++) {
            for (let y = 0; y < this.board.rows - 3; y++) {
                if (this.board.spaces[x][y].tokenOwner === owner &&
                    this.board.spaces[x][y + 1].tokenOwner === owner &&
                    this.board.spaces[x][y + 2].tokenOwner === owner &&
                    this.board.spaces[x][y + 3].tokenOwner === owner) {
                    win = true;
                }
            }
        }

        // horizontal
        for (let x = 0; x < this.board.columns - 3; x++) {
            for (let y = 0; y < this.board.rows; y++) {
                if (this.board.spaces[x][y].tokenOwner === owner &&
                    this.board.spaces[x + 1][y].tokenOwner === owner &&
                    this.board.spaces[x + 2][y].tokenOwner === owner &&
                    this.board.spaces[x + 3][y].tokenOwner === owner) {
                    win = true;
                }
            }
        }

        // diagonal bottom right top left
        for (let x = 3; x < this.board.columns; x++) {
            for (let y = 0; y < this.board.rows - 3; y++) {
                if (this.board.spaces[x][y].tokenOwner === owner &&
                    this.board.spaces[x - 1][y + 1].tokenOwner === owner &&
                    this.board.spaces[x - 2][y + 2].tokenOwner === owner &&
                    this.board.spaces[x - 3][y + 3].tokenOwner === owner) {
                    win = true;
                }
            }
        }

        // diagonal bottom left top right
        for (let x = 3; x < this.board.columns; x++) {
            for (let y = 3; y < this.board.rows; y++) {
                if (this.board.spaces[x][y].tokenOwner === owner &&
                    this.board.spaces[x - 1][y - 1].tokenOwner === owner &&
                    this.board.spaces[x - 2][y - 2].tokenOwner === owner &&
                    this.board.spaces[x - 3][y - 3].tokenOwner === owner) {
                    win = true;
                }
            }
        }
        return win;
    }

    /**
     * Switches active player.
     */
    switchPlayers() {
        for (let player of this.players) {
            player.active = player.active !== true;
        }
    }

    /**
     * Displays game over message.
     * @param {string} message - Game over message.
     */
    gameOver(message) {
        const gameOverElement = document.getElementById("game-over");
        gameOverElement.style.display = "block";
        gameOverElement.textContent = message;
    }

    /**
     * Updates game state after token is dropped.
     * @param   {Object}  token  -  The token that's being dropped.
     * @param   {Object}  target -  Targeted space for dropped token.
     */
    updateGameState(token, target) {
        target.markFilledSpace(token);
        console.log(this.checkForWin(target));
        if (this.checkForWin(target)) {
            return this.gameOver(`${this.activePlayer.name} has won the game!`);
        }
        this.switchPlayers();
        if (!this.activePlayer.unusedTokenCount()) {
            return this.gameOver(`${this.activePlayer.name} has run out of tokens`);
        }
        this.activePlayer.activeToken.drawHTMLTokenElement();
        this.ready = true;

    }

}
