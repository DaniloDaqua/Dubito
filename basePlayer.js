/*jshint esversion: 6 */

import { Card } from './Card';

export default class BasePlayer {
    /**
     * 
     * @param {string} name nome del giocatore
     * @param {Card[]} cards lista di carte
     */
    constructor(playerData, scene) {
        this.scene = scene;
        this.name = playerData['name'];
        this.num = playerData['num'];
        this.zoneX = playerData['x'];
        this.zoneY = playerData['y'];
        this.zoneVertical = playerData['vertical'];
        this.hand = [];
        this.isThePlayer = !this.num;
    }
    /**
     * aggiunge una carta
     * @param {Card} card carta da aggiungere
     */
    addCard(card) {
        this.hand.push(card);
        const sameRank = this.hand.filter(c => c.rank === card.rank);
        if (sameRank.length >= 4) {
            this.hand = this.hand.filter(c => c.rank !== card.rank);
            sameRank.map(c => c.destroy());
        }
        this.orderCards();
        return this;
    }
    addCards(cards) {
        cards.forEach(c => this.addCard(c));
    }
    removeCard(card) {
        this.hand = this.hand.filter(c => c.cardId !== card.cardId);
        this.orderCards();
        return this;
    }
    orderCards() {
        this.hand.sort(Card.compare);

        const cardSpacing = 20;
        const pw = position => position * cardSpacing * 1.6;
        const ph = position => position * cardSpacing * 1.3;
        const isPlayer = playerNumber => playerNumber === 0;

        let cardPosition = 1;

        for (const card of this.hand) {
            if (this.zoneVertical) {
                card.setPosition(this.zoneX + 35, this.zoneY + ph(cardPosition));
            } else {
                card.setPosition(this.zoneX + pw(cardPosition), this.zoneY + 45);
            }
            this.scene.children.bringToTop(card);
            cardPosition++;
        }

        if (this.isThePlayer) {
            this.hand.map(c => c.show());
        } else {
            this.hand.map(c => c.hide());
        }

        return this;
    }
    enableCards() {
        this.hand.map(c => c.enable());
        return this;
    }
    disableCards() {
        this.hand.map(c => c.disable());
        return this;
    }
    checkDone() { return null; }
    dubitato() { return null; }
}