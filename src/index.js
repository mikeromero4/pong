import Phaser from "phaser";
//https://labs.phaser.io/assets/games/breakout/breakout.png
var preload = function() {
  this.load.baseURL = "https://labs.phaser.io/assets/";
  this.load.crossOrigin = "anonymous";
  this.load.atlas(
    "assets",
    "games/breakout/breakout.png",
    "games/breakout/breakout.json"
  );
  this.load.image(
    "ball3",
    "https://cdn.pixabay.com/photo/2016/07/08/01/46/isolated-1503578__340.png"
  );
};

var create = function() {
  this.lives = 3;
  this.text = this.add.text(0, 0, "lives: " + this.lives, {
    fontFamily: '"Roboto Condensed"'
  });
  this.paddle = this.physics.add.sprite(10, 280, "assets", "paddle2");
  this.paddle.setImmovable(true);

  this.newBall = this.physics.add.sprite(10, 10, "assets", "ball3");
  this.newBall.setVelocity(150, 150);
  this.newBall.setBounce(1);
  this.newBall.setCollideWorldBounds(true);
  this.physics.add.collider(this.newBall, this.paddle, function(b, p) {
    b.setVelocityX(b.body.velocity.x * 1.05);
    b.setVelocityY(b.body.velocity.y * 1.05);
  });

  let rows = 10;
  let w = 64;
  let h = 32;
  let scale = 0.5;
  let columns = Math.ceil(300 / scale / w);
  let configuration = {
    immovable: true,
    key: "assets",
    frame: ["red2", "yellow2", "blue1"],
    frameQuantity: columns * 3,
    setScale: { x: scale, y: scale },
    gridAlign: {
      width: columns,
      height: rows,
      cellWidth: Math.ceil(w * scale),
      cellHeight: Math.ceil(h * scale),
      x: 30,
      y: 40
    }
  };
  this.brick = this.physics.add.group(configuration);
  this.physics.add.collider(this.newBall, this.brick, hitBrick);
  this.particles = this.add.particles("assets");

  this.pp = this.particles.createEmitter({
    frame: "particle1",
    x: 0,
    y: 0,
    follow: this.newBall,
    lifespan: 500,
    speed: { min: 4, max: 60 },
    scale: { start: 1.5, end: 0 },
    angle: { min: 20, max: 130 },
    gravityY: 90,
    quantity: 1,
    blendMode: "ADD"
  });
};
let hitBrick = function(a, b) {
  b.destroy();
};
var update = function() {
  //this.pp.x = this.newBall.x;

  //this.particles.y = this.newBall.y;
  this.paddle.x = this.input.x;
  if (this.newBall.y > 280) {
    resetBall.bind(this)();
    this.text.setText("lives " + --this.lives);
  }
};

function resetBall() {
  this.newBall.setVelocity(0, 0);
  this.newBall.y = 200;
  setTimeout(
    function() {
      let xSpeed = 150 - Math.random() * 300;
      let ySpeed = -300 + Math.abs(xSpeed);
      this.newBall.setVelocity(xSpeed, ySpeed);
    }.bind(this),
    1000
  );
}
const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 300,
  backgroundColor: "#000",
  parent: "game-container",
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  physics: {
    default: "arcade",
    arcade: {
      //debug: true
    }
  }
};

let game = new Phaser.Game(config);
