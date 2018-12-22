/*jshint esversion: 6 */

import { BasePlayer } from './BasePlayer';

export default class Player extends BasePlayer {

    constructor(playerData, scene) {
        super(playerData, scene);

        // Track space bar
        const { SPACE } = Phaser.Input.Keyboard.KeyCodes;
        this.keys = scene.input.keyboard.addKeys({
            space: SPACE,
        });
    }

    dubitato() {
        // controlla se il giocatore ha dubitato prima di mettere delle carte
        const space = !!Phaser.Input.Keyboard.JustDown(this.keys.space);
        const cards = !!this.scene.tableCardsTemp;
        return space && !cards;
    }

    checkDone() {
        // controlla se il giocatore ha messo delle carte e passa
        const space = !!Phaser.Input.Keyboard.JustDown(this.keys.space);
        const cards = !!this.scene.tableCardsTemp;
        return space && cards;
    }
}