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
    constructor(suitNum = 0, number = 0) {
        const suitMap = {
            0: "clubs",
            1: "diamonds",
            2: "hearts",
            3: "spades"
        };
        const colorMap = {
            "clubs": "#0E1111",
            "diamonds": "#EC0D0D",
            "hearts": "#EC0D0D",
            "spades": "#0E1111"
        }; //why color??
        const rankMap = {
            1: "A",
            11: "J",
            12: "Q",
            13: "K"
        };
        this.number = number;
        this.suitNum = suitNum;
        this.rank = rankMap[number] || number.toString();
        this.suit = suitMap[suitNum];
        this.color = colorMap[this.suit];
    }
    getSuit() {
        return this.suit.charAt(0).toUpperCase() + this.suit.charAt(1);
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

class MyCard extends Phaser.GameObjects.Container {
    constructor(scene, x = 0, y = 0, suitNum = 0, number = 0) {
        super(scene, x, y);
        const suitMap = {
            0: "clubs",
            1: "diamonds",
            2: "hearts",
            3: "spades"
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
        this.number = number;
        this.suitNum = suitNum;
        this.rank = rankMap[number] || number.toString();
        this.suit = suitMap[suitNum];
        this.color = colorMap[this.suit];

        this.x = x;
        this.y = y;
        this.w = 100;  // card width
        this.h = 140;  // card height
        this.r = 10;   // corner radius

    }

    showCard() {
        // reset container
        this.removeAll(destroyChild = true);

        const w = this.w;  // card width
        const h = this.h;  // card height
        const r = this.r;  // corner radius

        // draw new card
        const cardGraphic = self.add.graphics();
        const hitArea = new Phaser.Geom.Rectangle(0, 0, w, h);

        const imgPad = 14;

        const t = self.add.text(5, 5, card.rank, { fontSize: `${cardFontSize}px`, fill: card.color });
        const sbl = self.add.sprite(imgPad, h - imgPad, card.suit).setScale(.02);
        const str = self.add.sprite(w - imgPad, imgPad, card.suit).setScale(.02);
        const sbr = self.add.sprite(w - imgPad, h - imgPad, card.suit).setScale(.02);

        cardGraphic.setDefaultStyles(cardStyleFront);
        cardGraphic.fillRoundedRect(0, 0, w, h, r);
        cardGraphic.strokeRoundedRect(0, 0, w, h, r);
        return this.add([cardGraphic, t, sbl, str, sbr]);
    }

    hideCard() {
        // reset container
        this.removeAll(destroyChild = true);

        // TODO
        const w = this.w;  // card width
        const h = this.h;  // card height
        const r = this.r;   // corner radius

        const hitArea = new Phaser.Geom.Rectangle(0, 0, w, h)
        const cardGraphic = scene.add.graphics();

        cardGraphic.setDefaultStyles(cardStyleBack);
        cardGraphic.fillRoundedRect(0, 0, w, h, r);
        cardGraphic.strokeRoundedRect(0, 0, w, h, r);
        return container.add(cardGraphic);
    }

    getSuit() {
        return this.suit.charAt(0).toUpperCase() + this.suit.charAt(1);
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