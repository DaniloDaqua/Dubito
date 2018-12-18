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
            1: "A",
            11: "J",
            12: "Q",
            13: "K"
        };
        const suitMap = {
            0: "clubs",
            1: "spades",
            2: "hearts",
            3: "diamonds"
        };
        this.rankNum = rankNum;
        this.suitNum = suitNum;
        this.rank = rankMap[rankNum] || rankNum.toString();
        this.suit = suitMap[suitNum];

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
    enable() {
        // rendere questa carta interaggibile
        this.setInteractive();
        this.scene.input.setDraggable(this);
    }
    disable() {
        // rendere questa carta interaggibile
        this.disableInteractive();
    }
}