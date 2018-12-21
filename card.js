/**
 * Un ogetto che rappresenta una carta
 * 
 * @property {number} number numero della carta da 1-13
 * @property {number} suitNum seme della carta da 0-3
 * @property {string} rank 'ace', '2', '6', 'jack', ecc
 * @property {string} suit 'clubs', 'hearts', ecc
 * @property {string} color '#EC0D0D' o '#0E1111'
 */
export default class Card extends Phaser.GameObjects.Image {
    /**
     * crea una carta
     * @param {number} suitNum seme da 0-3
     * @param {number} rankNum numero da 1-13
     */
    constructor(scene, suitNum, rankNum, x = 0, y = 0) {

        // calcola la frame da usare dalla spritesheet 'cards'
        const spriteSheetFrame = (rankNum - 1) + (suitNum * 14);

        // creare la carta
        super(scene, x, y, 'cards', spriteSheetFrame);

        // aggiungere questa carta alla scene
        scene.add.existing(this);

        // settare gli altri attributi riguardo che carta è
        const rankMap = {
            1: "Ace",
            11: "Jack",
            12: "Queen",
            13: "King"
        };
        const suitMap = {
            0: "Clubs",
            1: "Spades",
            2: "Hearts",
            3: "Diamonds"
        };

        this.rankNum = rankNum;
        this.suitNum = suitNum;
        this.rank = rankMap[rankNum] || rankNum.toString();
        this.suit = suitMap[suitNum];
        this.cardId = `${this.rank}_${this.suit}`;
        this.spriteSheetFrame = spriteSheetFrame;
        this.spriteSheetCoverFrame = 13;

    }
    static compareRank(a, b) {
        return a.rankNum - b.rankNum;
    }
    static compareSuit(a, b) {
        return a.suitNum - b.suitNum;
    }
    static compare(a, b) {
        // sorta per numero e per seme
        return Card.compareRank(a, b) || Card.compareSuit(a, b);
    }
    enable() {
        // rendere questa carta interaggibile
        this.setInteractive();
        this.scene.input.setDraggable(this);
    }
    disable() {
        // rendere questa carta interaggibile
        this.disableInteractive();
    }
    show() {
        this.setFrame(this.spriteSheetFrame);
    }
    hide() {
        this.setFrame(this.spriteSheetCoverFrame);
    }
}