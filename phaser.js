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
const cardStyleFront = {
    lineStyle: {
        width: 1,
        color: 0x232b2b,
        alpha: 1
    },
    fillStyle: {
        color: 0xffffff,
        alpha: 1
    }
};
const cardStyleBack = {
    lineStyle: {
        width: 1,
        color: 0x232b2b,
        alpha: 1
    },
    fillStyle: {
        color: 0x5F021F,
        alpha: 1
    }
};

function preload() {
    this.load.setBaseURL("https://raw.githubusercontent.com/DaniloDaqua/Dubito/master/img");
    this.load.image("logo","bull.png");
    this.load.image("hearts","heart.png");
    this.load.image("clubs","clubs.png");
    this.load.image("spades","spades.png");
    this.load.image("diamonds","diamonds.png");
}

const cardEvidence = [];

function create() {
    const logo = this.add.sprite(400, 300, "logo");
    logo.setScale(0.4);
    const pw = position => position * cardFontSize * 1.6;
    const ph = position => position * cardFontSize * 1.3;
    const isPlayer = playerNumber => playerNumber === 0;

    const myGame = new Game([
        new Player("player"),
        new Player("bot 1"),
        new Player("bot 2"),
        new Player("bot 3"),
    ]);
    //myGame.log();

    playerAreas = {
        0: { x: 160, y: 450, vertical: false }, // bottom (player)
        1: { x: 160, y: 10, vertical: false },  // top
        2: { x: 10, y: 70, vertical: true },    // left
        3: { x: 690, y: 70, vertical: true },   // right
    };

    for (let i = 0; i < Object.keys(playerAreas).length; i++) {
        
        const player = myGame.players[i];
        const area = playerAreas[i];

        if (!player) {
            // nel caso fosse un gioco con meno di 4 giocatori
            continue;
        }

        let cardPosition = 0;

        for (const card of player.hand) {
            if (area.vertical) {
                displayCard(this, card, area.x, area.y + ph(cardPosition), isPlayer(i));
            } else {
                displayCard(this, card, area.x + pw(cardPosition), area.y, isPlayer(i));
            }
            cardPosition++;
        }
    }
}

function update() { }

function displayCard(self, card, x, y, showCard=false) {

    const w = 100;  // card width
    const h = 140;  // card height
    const r = 10;   // corner radius

    const hitArea = new Phaser.Geom.Rectangle(0,0,w,h)
    const container = self.add.container(x, y);
    const cardGraphic = self.add.graphics();
    const selectedGraphic = self.add.graphics();

    selectedGraphic.fillStyle('0xffff00');
    selectedGraphic.fillRoundedRect(0, 0, w, h, r);
    selectedGraphic.setAlpha(0.01);

    selectedGraphic.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
    
    selectedGraphic.on('pointerup', function () {
        if (this.cardSelected)  {
            this.setAlpha(0.01);
            this.cardSelected = false;
            cardEvidence.filter(function(card) {
                return
            })

        } else {
            this.cardSelected = true;
            this.setAlpha(0.3);
            cardEvidence.push(card);
        }
        console.log(cardEvidence);
    });
   

    if (!showCard) {
        cardGraphic.setDefaultStyles(cardStyleBack);
        cardGraphic.fillRoundedRect(0, 0, w, h, r);
        cardGraphic.strokeRoundedRect(0, 0, w, h, r);
        return container.add(cardGraphic);//zona da modficare di diertro di isaac
    }

    const imgPad = 14;

    const t = self.add.text(5, 5, card.rank, { fontSize: `${cardFontSize}px`, fill: card.color });
    const sbl = self.add.sprite(imgPad, h - imgPad, card.suit).setScale(.02);
    const str = self.add.sprite(w - imgPad, imgPad, card.suit).setScale(.02);
    const sbr = self.add.sprite(w - imgPad, h - imgPad, card.suit).setScale(.02);

    cardGraphic.setDefaultStyles(cardStyleFront);
    cardGraphic.fillRoundedRect(0, 0, w, h, r);
    cardGraphic.strokeRoundedRect(0, 0, w, h, r);
    return container.add([cardGraphic, t, sbl, str, sbr, selectedGraphic]);
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