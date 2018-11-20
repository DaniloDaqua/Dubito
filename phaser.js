/*jshint esversion: 6 */

const config = {
    type: Phaser.AUTO,
    width: 900,
    height: 800,
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

function preload() {
    this.load.image(
        "logo",
        "https://raw.githubusercontent.com/DaniloDaqua/Dubito/master/img/bullshit1.jpg"
    );

    this.load.setBaseURL("http://labs.phaser.io");
    this.load.image("sky", "assets/skies/space3.png");
    this.load.image("red", "assets/particles/red.png");
}

function create() {
    this.add.image(450, 400, "sky");

    const logo = this.physics.add.image(100, 10, "logo");

    //const particles = this.add.particles("red");

    /*const emitter = particles.createEmitter({
        speed: 5,
        scale: {
            start: 1,
            end: 0
        },
        blendMode: "ADD"
    });*/

    logo.setVelocity(5, 7);
    //logo.setBounce(1, 1);
    logo.setCollideWorldBounds(false);

    //emitter.startFollow(logo);
}

function update() {}