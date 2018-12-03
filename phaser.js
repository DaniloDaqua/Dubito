/*jshint esversion: 6 */

// http://phaser.io/tutorials/making-your-first-phaser-3-game

// todo: use require() to load other js split into multiple files

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {
                y: 500
            }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
const cardFontSize = 20;

function preload() {
    this.load.image(
        "logo",
        "https://raw.githubusercontent.com/DaniloDaqua/Dubito/77dc0cb14868dd96c88da168f890bbbaf636df39/img/966aa029b7f3b7b1b0669b6f6f4a6294--food-spain-drawing-cartoons.jpg"
    );

    this.load.setBaseURL("http://labs.phaser.io");
    this.load.image("sky", "assets/skies/space3.png");
    this.load.image("red", "assets/particles/red.png");
}

function create() {
    const logo = this.add.image(400, 300, "logo");
    const pw = position => position * cardFontSize * 1.6;
    const ph = position => position * cardFontSize;

    const myGame = new Game([
        new Player("player"),
        new Player("bot 1"),
        new Player("bot 2"),
        new Player("bot 3"),
    ]);
    //myGame.log();

    let x = 1;

    for (const card of myGame.players[0].hand) {
        displayCard(this, card, pw(x), 450);
        x++;
    }
}

function update() { }

function displayCard(self, card, x, y) {

    const c = self.add.container(x, y);
    const g = self.add.graphics();
    const t = self.add.text(5, 5, card.rank, { fontSize: `${cardFontSize}px`, fill: card.color });
    const s = self.add.text(5, 5 + cardFontSize, card.getSuit(), { fontSize: `${cardFontSize*.55}px`, fill: card.color });

    const w = 100;  // card width
    const h = 140;  // card height
    const r = 10;   // corner radius

    // todo: mettere questo fuori e chiamarlo
    // invece di riiniziallizzarlo ogni volta
    g.setDefaultStyles({
        lineStyle: {
            width: 1,
            color: 0x232b2b,
            alpha: 1
        },
        fillStyle: {
            color: 0xffffff,
            alpha: 1
        }
    });

    g.fillRoundedRect(0, 0, w, h, r);
    g.strokeRoundedRect(0, 0, w, h, r);
    c.add([g, t, s]);
    return c;
}

class Game {
    /**
     * 
     * @param {Player[]} players 
     */
    constructor(players) {

        this.players = players;
        this.deck = _makeDeck();
        this.pile = [];

        // dare le carte a i giocatori finchè tutti possono averne 1 ad ogni giro
        while (this.deck.length >= this.players.length) {
            this.players.forEach(p => {
                p.addCard(this.deck.pop());
            });
        }

        // nel caso rimangono carte, mettile nel centro
        while (this.deck.length > 0) {
            this.pile.push(this.deck.pop());
        }
    }

    log() {
        console.table(this.players);
        this.players.forEach(p => {
            console.table(p.hand);
        });
        console.table(this.deck);
        console.table(this.pile);
    }
}

/**
 * Un ogetto che rappresenta una carta
 * 
 * @property {number} number numero della carta da 1-13
 * @property {number} suitNum seme della carta da 0-3
 * @property {string} rank 'ace', '2', '6', 'jack', ecc
 * @property {string} suit 'clubs', 'hearts', ecc
 * @property {string} color '#EC0D0D' o '#0E1111'
 */
class Card {
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
    getSuit(){
        return this.suit.charAt(0).toUpperCase() + this.suit.charAt(1);
    }
    static compareRank(a, b) {
        return a.number - b.number;
    }
    static compareSuit(a, b) {
        return a.suitNum - b.suitNum;
    }
    static compare(a,b){
        // sorta per numero e per seme
        return Card.compareRank(a,b) || Card.compareSuit(a,b);
    }
}

class Player {
    /**
     * 
     * @param {string} name nome del giocatore
     * @param {Card[]} cards lista di carte
     */
    constructor(name, cards = []) {
        this.name = name;
        this.hand = cards.sort(Card.compare);
    }
    /**
     * aggiunge una carta
     * @param {Card} card carta da aggiungere
     */
    addCard(card) {
        this.hand.push(card);
        this.hand.sort(Card.compare);
        return this;
    }
}

/**
 * Crea un mazzo di carte miste
 * 
 * @returns {Card[]}
 */
function _makeDeck() {
    const deck = [];
    for (let number = 1; number < 14; number++) {
        for (let suit = 0; suit < 4; suit++) {
            deck.push(new Card(suit, number));
        }
    }
    return shuffle(deck);
}

/**
 * shuffle an array
 * @param {*} arra1 
 */
function shuffle(arra1) {
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