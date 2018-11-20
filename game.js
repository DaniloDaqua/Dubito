/*jshint esversion: 6 */


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

    log(){
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
 * @property {string} rank 'ace', '2', '6', 'jack', ecc
 * @property {string} suit 'clubs', 'hearts', ecc
 * @property {string} color 'red' o 'black'
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
            0: "black",
            1: "red",
            2: "red",
            3: "black"
        };
        const rankMap = {
            1: "ace",
            11: "jack",
            12: "queen",
            13: "king"
        };
        this.number = number;
        this.rank = rankMap[number] || number.toString();
        this.suit = suitMap[suitNum];
        this.color = colorMap[suitNum];
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
        this.hand = cards;
    }
    /**
     * aggiunge una carta
     * @param {Card} card carta da aggiungere
     */
    addCard(card) {
        this.hand.push(card);
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

const myGame = new Game([
    new Player("player"),
    new Player("bot 1"),
    new Player("bot 2"),
    new Player("bot 3"),
]);

myGame.log();

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