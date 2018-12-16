import Card from './card.js';

export default class Player {
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