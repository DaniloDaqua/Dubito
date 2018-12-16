/*jshint esversion: 6 */

// http://phaser.io/tutorials/making-your-first-phaser-3-game

import Player from './player.js';
import Game from './game.js';

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
    this.load.setBaseURL("img/");
    this.load.spritesheet('cards', 'cards.png', {
        frameWidth: 70,
        frameHeight: 95,
        spacing: 2,
        margin: 0,
    });
    this.load.image("logo", "bull.png");
    this.load.image("hearts", "heart.png");
    this.load.image("clubs", "clubs.png");
    this.load.image("spades", "spades.png");
    this.load.image("diamonds", "diamonds.png");
}

let cardEvidence = [];

function create() {
    this.add.image(50, 50, 'cards', 0);

    this.add.image(100, 100, 'cards', 12);
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

    const playerAreas = {
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

function displayCard(self, card, x, y, showCard = false) {

    const w = 100;  // card width
    const h = 140;  // card height
    const r = 10;   // corner radius

    const hitArea = new Phaser.Geom.Rectangle(0, 0, w, h)
    const container = self.add.container(x, y);
    const cardGraphic = self.add.graphics();
    const selectedGraphic = self.add.graphics();

    selectedGraphic.fillStyle('0xffff00');
    selectedGraphic.fillRoundedRect(0, 0, w, h, r);
    selectedGraphic.setAlpha(0.01);

    selectedGraphic.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

    selectedGraphic.on('pointerup', function () {
        if (this.cardSelected) {
            this.setAlpha(0.01);
            this.cardSelected = false;
            cardEvidence = cardEvidence.filter(e => e !== card)

        } else if (cardEvidence.length < 3) {
            this.cardSelected = true;
            this.setAlpha(0.3);
            cardEvidence.push(card);
        }
        console.log(cardEvidence.map(a => JSON.stringify(a)));
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