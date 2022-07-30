class Token {
    constructor(index, owner) {
        this.owner = owner;
        this.id = `token-${index}-${owner.id}`;
        this.dropped = false;
        this.columnLocation = 0;
    }

    /**
     * Gets associated htmlToken.
     * @returns {HTMLElement}
     */
    get htmlTokenElement() {
        return document.getElementById(this.id);
    }

    /**
     * Gets left offset of html element.
     * @return  {number}   Left offset of token object's htmlToken.
     */
    get offsetLeft() {
        return this.htmlTokenElement.offsetLeft;
    }

    /**
     * Draws ne HTML token.
     */
    drawHTMLTokenElement() {
        const createDivElement = document.createElement("div");
        document.getElementById('game-board-underlay').appendChild(createDivElement);
        createDivElement.setAttribute("id", this.id);
        createDivElement.setAttribute("class", 'token');
        createDivElement.style.backgroundColor = this.owner.color;
    }

    /**
     * Moves html token one column.
     */
    moveTokenLeft(diameter) {
        if (this.columnLocation > 0) {
            this.htmlTokenElement.style.left = this.offsetLeft - diameter;
            this.columnLocation -= 1;
        }
    }

    /**
     * Moves html token one column to right
     * @param  columns - number of columns on the game board
     */
    moveTokenRight(columns, diameter) {
        if (this.columnLocation < columns - 1) {
            this.htmlTokenElement.style.left = this.offsetLeft + diameter;
            this.columnLocation += 1;
        }
    }

    /**
     * Drops html token into targeted board space.
     * @param   {Object}   target - Targeted space for dropped token.
     * @param   {function} reset  - The reset function to call after the drop animation has completed.
     */
    dropToken(target, reset) {
        $(this.htmlTokenElement).animate({
            top: (target.y * target.diameter)
        }, 750, 'easeOutBounce', reset);
        this.dropped = true;
    }
}
