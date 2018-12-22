/*jshint esversion: 6 */

import Player from './Player.js';

export default class Bot extends Player {

    constructor(playerData, scene) {
        super(playerData, scene);

        let nextActionTime = null;
    }

    dubitato() {

        // cards dell'ultimo giocatore
        const lc = this.scene.tableCardsTemp;

        if (!lc) {
            // non ci sono carte
            return false;
        } else if (lc.length >= 4) {
            return true;
        } else if (lc.length >= 3) {
            return Math.random() <= .75;
        } else if (lc.length >= 2) {
            return Math.random() <= .50;
        } else {
            return Math.random() <= .25;
        }
    }

    /**
     * Play some cards then pass turn
     */
    checkDone() {
        // todo: play some cards
        const randCard = this.hand[Math.floor(Math.random() * this.hand.length)];
    }
}