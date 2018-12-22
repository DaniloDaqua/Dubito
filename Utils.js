/*jshint esversion: 6 */

/**
 * keep track of cards on table
 * a group is the set of cards a player has put on the table
 */
export class CardGroup {

    constructor() {

        // keep 2 groups default for .current and .previous
        this.history = [[], []];
    }

    /**
     * Get all cards in all groups
     */
    get all() {
        // https://stackoverflow.com/a/10865042/196870
        return [].concat(...this.history);
    }

    /**
     * active player cards
     */
    get current() {
        return this.history[this.history.length - 1];
    }

    /**
     * previous player cards
     */
    get previous() {
        return this.history[this.history.length - 2];
    }

    /**
     * single top card or null
     */
    get top() {
        // use .top in case some empty groups exist
        const a = this.all;
        return a[a.length - 1] || null;
    }

    /**
     * add a card to .current group
     * @param {Card} card a single card
     */
    addCard(card) {
        this.history[this.history.length - 1].push(card);
        return this;
    }

    /**
     * switch to next group
     */
    pushGroup() {
        this.history.push([]);
        return this;
    }

    /**
     * return all cards and clear state
     */
    popAll() {
        const temp = this.all;
        this.history = [[], []];
        return temp;
    }
}

export class Cycle extends Array {

    constructor(items) {
        super(...items);
        this.__index = 0;
    }

    get currentIndex() {
        return this.__index;
    }

    get nextIndex() {
        const i = this.__index + 1;
        if (i > this.length - 1) {
            return 0;
        } else {
            return i;
        }
    }

    get previousIndex() {
        const i = this.__index - 1;
        if (i < 0) {
            return this.length - 1;
        } else {
            return i;
        }
    }

    get current() {
        return this[this.__index];
    }

    get next() {
        return this[this.nextIndex];
    }

    get previous() {
        return this[this.previousIndex];
    }

    step() {
        this.__index = this.nextIndex;
        return this.current;
    }

    back() {
        this.__index = this.previousIndex;
        return this.current;
    }
}

/**
 * shuffle an array
 * @param {*} arra1
 */
export function shuffle(arra1) {
    let ctr = arra1.length;
    let temp;
    let index;

    // While there are elements in the array
    while (ctr > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * ctr);
        // Decrease ctr by 1
        ctr--;
        // And swap the last element with it
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
    }
    return arra1;
}