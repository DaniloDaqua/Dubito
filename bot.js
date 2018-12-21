/*jshint esversion: 6 */

import Player from './player.js';

export default class Bot extends Player {

    constructor(playerData, scene) {
        super(playerData, scene);
        
        let nextActionTime = null;
    }

    dubitato() {
        if (this.scene.tableCardsTemp.length >= 4) {
            return true;
        } else if (this.scene.tableCardsTemp.length >= 3) {
            return Math.random() <= .75;
        } else if (this.scene.tableCardsTemp.length >= 2) {
            return Math.random() <= .50;
        } else {
            return Math.random() <= .25;
        }
    }
    
    /**
     * Play some cards then pass turn
     */
    checkDone() {
        const randCard = this.hand[Math.floor(Math.random() * this.hand.length)];
    }
}