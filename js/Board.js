class Board {
    constructor(rows = 6, columns = 7) {
        this.rows = rows;
        this.columns = columns;
        this.spaces = [];
    }

    /**
     * Generates 2D array of spaces.
     */
    _createSpaces() {
        for (let x = 0; x < this.columns; x++) {
            const column = [];

            for (let y = 0; y < this.rows; y++) {
                column.push(new Space(x, y));
            }
            this.spaces.push(column);
        }
    }

    /**
     * Draws the HTML Game Board with Spaces.
     */
    _drawHTMLBoard() {
        for (const column of this.spaces) {
            for (let space of column) {
                space.applySVGSpaces();
            }
        }
    }

    /**
     * Adds the spaces to the game board
     */
    drawBoardWithSpaces() {
        this._createSpaces()
        this._drawHTMLBoard()
    }
}
