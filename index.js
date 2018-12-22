/*jshint esversion: 6 */

// http://phaser.io/tutorials/making-your-first-phaser-3-game

import GameScene from './Game.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: GameScene,
    backgroundColor: "#1d212d",
    physics: {
        default: "arcade",
        arcade: {
            gravity: {
                y: 500
            }
        }
    },
};

const game = new Phaser.Game(config);