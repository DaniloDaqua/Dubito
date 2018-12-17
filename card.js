/**
 * Un ogetto che rappresenta una carta
 * 
 * @property {number} number numero della carta da 1-13
 * @property {number} suitNum seme della carta da 0-3
 * @property {string} rank 'ace', '2', '6', 'jack', ecc
 * @property {string} suit 'clubs', 'hearts', ecc
 * @property {string} color '#EC0D0D' o '#0E1111'
 */
export default class Card {
    /**
     * crea una carta
     * @param {number} suitNum seme da 0-3
     * @param {number} number numero da 1-13
     */
    constructor(scene, suitNum, number, x = 0, y = 0) {

        const suitMap = {
            0: "clubs",
            1: "spades",
            2: "hearts",
            3: "diamonds"
        };
        const colorMap = {
            "clubs": "#0E1111",
            "diamonds": "#EC0D0D",
            "hearts": "#EC0D0D",
            "spades": "#0E1111"
        };
        const rankMap = {
            1: "A",
            11: "J",
            12: "Q",
            13: "K"
        };

        this.scene = scene;
        this.x = x;
        this.y = y;
        this.number = number;
        this.suitNum = suitNum;
        this.rank = rankMap[number] || number.toString();
        this.suit = suitMap[suitNum];
        this.color = colorMap[this.suit];

        const spriteSheetFrame = (number - 1) + (suitNum * 14);
        this.image = scene.add.image(x, y, 'cards', spriteSheetFrame);
    }
    getSuit() {
        return this.suit.charAt(0).toUpperCase() + this.suit.charAt(1);
    }
    setPosition(x,y){
        this.x = x;
        this.y = y;
        this.image.setPosition(x,y);
    }
    static compareRank(a, b) {
        return a.number - b.number;
    }
    static compareSuit(a, b) {
        return a.suitNum - b.suitNum;
    }
    static compare(a, b) {
        // sorta per numero e per seme
        return Card.compareRank(a, b) || Card.compareSuit(a, b);
    }
}