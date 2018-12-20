import Card from './card.js';
import Player from './player.js';

export default class GameScene extends Phaser.Scene {
    constructor(config) {
        super(config);
        this.players = [];
        this.deck = [];
        this.tableCards = [];
        this.tableCardsTemp = [];
        this.playerTurn = 0;
        this.activePlayer = null;
        this.currentRank = 1;
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

        const playerData = {
            0: { num: 0, x: 160, y: 450, vertical: false, name: 'Player' }, // bottom (player)
            1: { num: 1, x: 10, y: 70, vertical: true, name: 'Pippo' },     // left
            2: { num: 2, x: 160, y: 10, vertical: false, name: 'Pluto' },   // top
            3: { num: 3, x: 690, y: 70, vertical: true, name: 'Paperino' },    // right
        };

        this.players = [
            new Player(playerData[0], this),
            new Player(playerData[1], this),
            new Player(playerData[2], this),
            new Player(playerData[3], this),
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

        this.activePlayer = this.players[this.playerTurn];
        this.activePlayer.enableCards();

        this.infoText = this.add
            .text(13, 550, `${this.players[this.playerTurn].name} turn.`, {
                font: "18px monospace",
                fill: "#000000",
                padding: { x: 20, y: 10 },
                backgroundColor: "#ffffff"
            })

        //  A drop zone
        const zone = this.add.zone(400, 300, 300, 300).setRectangleDropZone(300, 300);

        //  Just a visual display of the drop zone
        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0xffff00);
        graphics.strokeRect(zone.x - zone.input.hitArea.width / 2, zone.y - zone.input.hitArea.height / 2, zone.input.hitArea.width, zone.input.hitArea.height);

        // porta la carta in evidenza
        this.input.on('dragstart', function (pointer, gameObject) {

            this.children.bringToTop(gameObject);

        }, this);

        // abilita lo spostamento
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

            gameObject.x = dragX;
            gameObject.y = dragY;

        });

        // spostamento nella zona
        this.input.on('dragenter', function (pointer, gameObject, dropZone) {

            graphics.clear();
            graphics.lineStyle(2, 0x00ffff);
            graphics.strokeRect(zone.x - zone.input.hitArea.width / 2, zone.y - zone.input.hitArea.height / 2, zone.input.hitArea.width, zone.input.hitArea.height);

        });

        // spostamento dalla zona
        this.input.on('dragleave', function (pointer, gameObject, dropZone) {

            graphics.clear();
            graphics.lineStyle(2, 0xffff00);
            graphics.strokeRect(zone.x - zone.input.hitArea.width / 2, zone.y - zone.input.hitArea.height / 2, zone.input.hitArea.width, zone.input.hitArea.height);

        });

        // lasciare la carta nella zona
        this.input.on('drop', function (pointer, gameObject, dropZone) {

            const card = gameObject;

            card.x = dropZone.x;
            card.y = dropZone.y;

            card.input.enabled = false;

            const activePlayer = card.scene.activePlayer;
            const tableCardsTemp = card.scene.tableCardsTemp;

            tableCardsTemp.push(card);
            tableCardsTemp.map(c => c.hide());
            activePlayer.removeCard(card);

        });

        // reset position
        this.input.on('dragend', function (pointer, gameObject, dropped) {

            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }

            graphics.clear();
            graphics.lineStyle(2, 0xffff00);
            graphics.strokeRect(zone.x - zone.input.hitArea.width / 2, zone.y - zone.input.hitArea.height / 2, zone.input.hitArea.width, zone.input.hitArea.height);

        });

    }

    nextPlayer() {
        let playerNum = this.playerTurn + 1;
        if (playerNum >= this.players.length) {
            playerNum = 0;
        }
        return this.players[playerNum];
    }

    prevPlayer() {
        let playerNum = this.playerTurn - 1;
        if (playerNum < 0) {
            playerNum = this.players.length - 1;
        }
        return this.players[playerNum];
    }
    logGameState() {
        console.log({
            activePlayer: this.activePlayer,
            playerTurn: this.playerTurn,
            tableCardsTemp: this.tableCardsTemp,
            tableCards: this.tableCards,
            currentRank: this.currentRank,
        })
    }
    checkDubito() {
        // controlla se le carte precedenti sono sbagliate
        const mentito = !!this.tableCardsTemp.filter(c => c.rankNum !== this.currentRank);
        this.tableCards.push(...this.tableCardsTemp);

        if (mentito) {
            // player precedente ha mentito
            console.log("if");
            this.logGameState();
            this.prevPlayer().addCards(this.tableCards);
        } else {
            // player attivo si prende le carte
            console.log("else");
            this.activePlayer.addCards(this.tableCards);
        }
        this.tableCards = [];
        this.tableCardsTemp = [];

        return mentito;
    }

    update(time, delta) {

        if (this.activePlayer.isThePlayer) {
            // il giocatore
            this.activePlayer.enableCards();

            if (this.activePlayer.passTurn()) {
                this.activePlayer.disableCards();
                this.activePlayer = this.nextPlayer();
                this.playerTurn = this.activePlayer.num;
            }
        } else {
            // i bot

            if (this.activePlayer.botDubitare()) {
                console.log(`${this.activePlayer.name} ha dubitato`);
                this.checkDubito();
            } else {
                this.tableCards.push(...this.tableCardsTemp);
            }
            //this.activePlayer = this.nextPlayer();
            this.logGameState();

            // passa il turno
            if (this.activePlayer.passTurn()) {
                this.activePlayer = this.nextPlayer();
                this.playerTurn = this.activePlayer.num;
            }

        }

        this.infoText.setText(`${this.activePlayer.name} turn -- ${this.currentRank}.`);



        // gestire passaggio del turno
        /* if (this.activePlayer.passTurn()) {
            console.log("passTurn()");
            this.activePlayer.disableCards();

            this.activePlayer = this.nextPlayer();
            this.playerTurn = this.activePlayer.num;
            this.infoText.setText(`${this.activePlayer.name} turn -- ${this.currentRank}.`);
            this.activePlayer.enableCards(); 

            // gestisci i bot
            if (!this.activePlayer.isThePlayer) {

                console.log("isThePlayerisThePlayer" + !this.activePlayer.isThePlayer);

                if (this.activePlayer.botDubitare()) {
                    console.log(`${this.activePlayer.name} ha dubitato`);

                    // controlla se le carte precedenti sono sbagliate
                    if (this.tableCardsTemp.filter(c => c.rankNum !== this.currentRank)) {
                        // player precedente ha mentito
                        console.log("if");
                        this.prevPlayer().addCards(this.tableCards);
                        this.prevPlayer().addCards(this.tableCardsTemp);
                    } else {
                        // player attivo si prende le carte
                        console.log("else");
                        this.activePlayer.addCards(this.tableCards);
                        this.activePlayer.addCards(this.tableCardsTemp);
                    }
                } else {
                    this.tableCards.push(...this.tableCardsTemp);
                }
                this.tableCardsTemp = [];
                //this.activePlayer = this.nextPlayer();
                this.logGameState();

            }
        }
 */
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