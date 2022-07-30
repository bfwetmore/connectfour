class Player {
    constructor(name, id, color, active = false) {
        this.name = name;
        this.id = id;
        this.color = color;
        this.active = active;
    }

    /**
     * Gets an array of the remaining tokens not dropped
     * @returns {array}
     */
    get unusedTokens() {
        return this.tokens.filter(token => !token.dropped);
    }

    /**
     * Gets the next active token.
     * @returns {array}
     */
    get activeToken() {
        return this.unusedTokens[0];
    }

    /**
     * Creates token objects for player.
     * @param    num - Number of token objects to be created
     * @return  {array}     tokens - an array of new token objects
     */
    createTokens(num) {
        const tokens = [];
        for (let i = 0; i < num; i++) {
            tokens.push(new Token(i, this));
        }
        return this.tokens = tokens;
    }

    /**
     * Checks if the Player still has any tokens left.
     * @returns {boolean}
     */
    unusedTokenCount() {
        return this.unusedTokens.length !== 0;
    }
}
