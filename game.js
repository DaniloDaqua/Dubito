import Card from './card.js';
import Player from './player.js';

export default class GameScene extends Phaser.Scene {
    constructor(config) {
        super(config);
        this.players = [];
        this.deck = [];
        this.pile = [];
    }
    preload() {
        this.load.setBaseURL("assets/img/");
        this.load.image("logo", "bull.png");
        this.load.spritesheet(
            "cards",
            "cards.png",
            {
                frameWidth: 70,
                frameHeight: 94,
                spacing: 2,
                margin: 0,
            }
        );
    }

    create() {
        this.add.sprite(400, 300, "logo").setScale(0.4);

        this.players = [
            new Player("player"),
            new Player("bot 1"),
            new Player("bot 2"),
            new Player("bot 3"),
        ];

        this.deck = [];
        for (let number = 1; number < 14; number++) {
            for (let suit = 0; suit < 4; suit++) {
                this.deck.push(new Card(this, suit, number, (number + 1) * 25, (suit + 1) * 50));
            }
        }
        shuffle(this.deck);

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

        const cardSpacing = 20;
        const pw = position => position * cardSpacing * 1.6;
        const ph = position => position * cardSpacing * 1.3;
        const isPlayer = playerNumber => playerNumber === 0;

        console.log("dio merda");

        const playerAreas = {
            0: { x: 160, y: 450, vertical: false }, // bottom (player)
            1: { x: 160, y: 10, vertical: false },  // top
            2: { x: 10, y: 70, vertical: true },    // left
            3: { x: 690, y: 70, vertical: true },   // right
        };

        for (let i = 0; i < Object.keys(playerAreas).length; i++) {

            const player = this.players[i];
            const area = playerAreas[i];

            if (!player) {
                // nel caso fosse un gioco con meno di 4 giocatori
                continue;
            }

            let cardPosition = 1;

            for (const card of player.hand) {
                if (area.vertical) {
                    card.setPosition(area.x + 35, area.y + ph(cardPosition));
                } else {
                    card.setPosition(area.x + pw(cardPosition), area.y + 45);
                }
                cardPosition++;
            }
        }

        // Help text that has a "fixed" position on the screen
        /* this.add
            .text(16, 16, "Arrow keys or WASD to move & jump", {
                font: "18px monospace",
                fill: "#000000",
                padding: { x: 20, y: 10 },
                backgroundColor: "#ffffff"
            })
            .setScrollFactor(0); */
    }

    update(time, delta) {
        // Allow the player to respond to key presses and move itself
        /* this.player.update();

        if (this.player.sprite.y > this.groundLayer.height) {
            this.player.destroy();
            this.scene.restart();
        } */
    }
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