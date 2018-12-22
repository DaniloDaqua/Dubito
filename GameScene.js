/*jshint esversion: 6 */

import Card from './Card.js';
import Player from './Player.js';
import Bot from './Bot.js';
import {CardGroup, Cycle, shuffle} from './Utils.js';

export default class GameScene extends Phaser.Scene {

    constructor(config) {
        super(config);
        this.players = null;
        this.table = new CardGroup();
        this.ranks = new Cycle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13])
    }

    get previousPlayerLied() {
        const f = c => c.rankNum !== this.ranks.previous;
        return !!this.table.previous.filter(f);
    }

    get previousPlayerTruth() {
        return !this.previousPlayerLied;
    }

    passTurn() {
        this.players.step();
        this.ranks.step();
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
            0: {num: 0, x: 160, y: 450, vertical: false, name: 'Player'}, // bottom (player)
            1: {num: 1, x: 10, y: 70, vertical: true, name: 'Pippo'},     // left
            2: {num: 2, x: 160, y: 10, vertical: false, name: 'Pluto'},   // top
            3: {num: 3, x: 690, y: 70, vertical: true, name: 'Paperino'},    // right
        };

        this.players = new Cycle([
            new Player(playerData[0], this),
            new Bot(playerData[1], this),
            new Bot(playerData[2], this),
            new Bot(playerData[3], this),
        ]);

        const deck = [];
        for (let number = 1; number < 14; number++) {
            for (let suit = 0; suit < 4; suit++) {
                deck.push(new Card(this, suit, number, (number + 1) * 25, (suit + 1) * 50));
            }
        }
        shuffle(deck);

        // dare le carte a i giocatori finchè tutti possono averne 1 ad ogni giro
        while (deck.length >= this.players.length) {
            this.players.forEach(p => {
                p.addCard(deck.pop());
            });
        }
        // nel caso rimangono carte, mettile nel centro
        while (deck.length > 0) {
            this.table.current.push(deck.pop());
        }

        // queste carte non devono apparire in .previous
        // ma devono esistere sul tavolo
        this.table.pushGroup();
        this.table.pushGroup();

        this.infoText = this.add
            .text(13, 550, '', {
                font: "18px monospace",
                fill: "#000000",
                padding: {x: 20, y: 10},
                backgroundColor: "#ffffff"
            });

        //  A drop zone
        const zone = this.add.zone(400, 300, 300, 300).setRectangleDropZone(300, 300);

        //  Just a visual display of the drop zone
        const zoneGraphics = this.add.graphics();
        zoneGraphics.lineStyle(2, 0xffff00);
        zoneGraphics.strokeRect(zone.x - zone.input.hitArea.width / 2, zone.y - zone.input.hitArea.height / 2, zone.input.hitArea.width, zone.input.hitArea.height);

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

            zoneGraphics.clear();
            zoneGraphics.lineStyle(2, 0x00ffff);
            zoneGraphics.strokeRect(zone.x - zone.input.hitArea.width / 2, zone.y - zone.input.hitArea.height / 2, zone.input.hitArea.width, zone.input.hitArea.height);

        });

        // spostamento dalla zona
        this.input.on('dragleave', function (pointer, gameObject, dropZone) {

            zoneGraphics.clear();
            zoneGraphics.lineStyle(2, 0xffff00);
            zoneGraphics.strokeRect(zone.x - zone.input.hitArea.width / 2, zone.y - zone.input.hitArea.height / 2, zone.input.hitArea.width, zone.input.hitArea.height);

        });

        // lasciare la carta nella zona
        this.input.on('drop', function (pointer, gameObject, dropZone) {

            const card = gameObject;

            card.x = dropZone.x;
            card.y = dropZone.y;

            card.input.enabled = false;
            card.hide();

            card.scene.table.current.push(card);
            card.scene.players.current.removeCard(card);

        });

        // reset position
        this.input.on('dragend', function (pointer, gameObject, dropped) {

            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }

            zoneGraphics.clear();
            zoneGraphics.lineStyle(2, 0xffff00);
            zoneGraphics.strokeRect(zone.x - zone.input.hitArea.width / 2, zone.y - zone.input.hitArea.height / 2, zone.input.hitArea.width, zone.input.hitArea.height);

        });

    }

    dubito() {
        // chi è sfortunato prende le carte
        const prende = (this.previousPlayerLied ? this.players.previous : this.players.current);
        prende.addCards(this.table.popAll());
    }

    update(time, delta) {

        const cp = this.players.current;
        this.infoText.setText(`${cp.name} turn -- ${this.ranks.current}.`);

        // abilita / disabilita carte per giocatore
        (cp.isThePlayer ? cp.enableCards() : cp.disableCards());

        // controlla se il giocatore attivo ha dubitato
        if (cp.dubitato()) {

            // qualcuno prende le carte
            this.dubito();

            if (this.previousPlayerTruth) {
                // se il giocatore precedente non ha mentito, il 
                // giocatore attivo prende tutte le carte e passa
                this.passTurn();
                return;
            }
        }

        // controlla se il giocatore ha finito
        if (cp.checkDone()) {
            this.passTurn();
        }

    }
}