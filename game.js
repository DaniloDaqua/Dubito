import Card from './card.js';

export default class Game {
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