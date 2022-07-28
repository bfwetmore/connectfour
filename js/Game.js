class Game {
    /**
     *
     * @param board
     * @param players
     */
    constructor(board, players) {
        this.board = board;
        this.players = players;
        this.ready = false;
    }

    /**
     * Retrieves the active player.
     * @returns {*} Returns the active player.
     */
    get activePlayer() {
        return this.players.find(player => player.active);
    }

    /**
     * Creates the game board and draws first token.
     */
    startGame() {
        this.board.drawBoardWithSpaces();
        this.activePlayer.activeToken.drawHTMLTokenElement();
        this.ready = true;
    }

    /**
     * Branches code, depending on what key player presses
     * @event document#keydown
     * @type {KeyboardEvent}
     */
    moveTokenHandler(e) {
        const space = new Space()
        const diameter = space.diameter
        if (this.ready) {
            if (e.key === "ArrowLeft") {
                this.activePlayer.activeToken.moveTokenLeft(diameter);
            } else if (e.key === "ArrowRight") {
                this.activePlayer.activeToken.moveTokenRight(this.board.columns, diameter);
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
        let winCheck = [
            this.checkVerticalWin,
            this.checkHorizontalWin,
            this.checkDiagonalRightWin,
            this.checkDiagonalLeftWin
        ];
        for (let check of winCheck) {
            if (check(target.token.owner, this.board.spaces, this.board.columns, this.board.rows) === true) {
                return true;
            }
        }
        return false;
    }

    checkVerticalWin(owner, spaces, columns, rows) {
        for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows - 3; y++) {
                if (spaces[x][y].tokenOwner === owner &&
                    spaces[x][y + 1].tokenOwner === owner &&
                    spaces[x][y + 2].tokenOwner === owner &&
                    spaces[x][y + 3].tokenOwner === owner) {
                    return true;
                }
            }
        }
        return false;
    }

    checkHorizontalWin(owner, spaces, columns, rows) {
        for (let x = 0; x < columns - 3; x++) {
            for (let y = 0; y < rows; y++) {
                if (spaces[x][y].tokenOwner === owner &&
                    spaces[x + 1][y].tokenOwner === owner &&
                    spaces[x + 2][y].tokenOwner === owner &&
                    spaces[x + 3][y].tokenOwner === owner) {
                    return true;
                }
            }
        }
        return false;
    }

    checkDiagonalRightWin(owner, spaces, columns, rows) {
        for (let x = 3; x < columns; x++) {
            for (let y = 0; y < rows - 3; y++) {
                if (spaces[x][y].tokenOwner === owner &&
                    spaces[x - 1][y + 1].tokenOwner === owner &&
                    spaces[x - 2][y + 2].tokenOwner === owner &&
                    spaces[x - 3][y + 3].tokenOwner === owner) {
                    return true;
                }
            }
        }
        return false;
    }

    checkDiagonalLeftWin(owner, spaces, columns, rows) {
        for (let x = 3; x < columns; x++) {
            for (let y = 3; y < rows; y++) {
                if (spaces[x][y].tokenOwner === owner &&
                    spaces[x - 1][y - 1].tokenOwner === owner &&
                    spaces[x - 2][y - 2].tokenOwner === owner &&
                    spaces[x - 3][y - 3].tokenOwner === owner) {
                    return true;
                }
            }
        }
        return false;
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
