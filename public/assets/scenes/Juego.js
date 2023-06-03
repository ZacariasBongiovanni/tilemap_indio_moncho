// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class Juego extends Phaser.Scene {
  score;
  gameOver;
  timer;
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("hello-world");
  }

  init() {
    // this is called before the scene is created
    // init variables
    // take data passed from other scenes
    // data object param {}
    this.gameOver = false;
    this.timer = 20;
  }

  preload() {
    // load assets
    this.load.tilemapTiledJSON("map", "./public/tilemaps/nivel1.json");
    this.load.image("tilesFondo", "./public/assets/images/sky.png");
    this.load.image("tilesPlataforma", "./public/assets/images/platform.png");

    this.load.image("star", "./public/assets/images/star.png");
    this.load.image("door", "./public/assets/images/door.png");
    this.load.image("bomb", "./public/assets/images/bomb.png");

    this.load.spritesheet("dude", "./public/assets/images/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    // todo / para hacer: texto de puntaje

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    const map = this.make.tilemap({ key: "map" });

    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)
    const capaFondo = map.addTilesetImage("sky", "tilesFondo");
    const capaPlataformas = map.addTilesetImage("platform", "tilesPlataforma");

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    const fondoLayer = map.createLayer("fondo", capaFondo, 0, 0);
    const plataformaLayer = map.createLayer(
      "plataformas",
      capaPlataformas,
      0,
      0
    );
    const objectosLayer = map.getObjectLayer("objetos");

    plataformaLayer.setCollisionByProperty({ colision: true });

    console.log(objectosLayer);

    // crear el jugador
    // Find in the Object Layer, the name "dude" and get position
    let spawnPoint = map.findObject("objetos", (obj) => obj.name === "jugador");
    console.log(spawnPoint);
    // The player and its settings
    this.jugador = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "dude");

    //  Player physics properties. Give the little guy a slight bounce.
    this.jugador.setBounce(0.1);
    this.jugador.setCollideWorldBounds(true);

    //  Input Events
    this.cursors = this.input.keyboard.createCursorKeys();

    // Create empty group of stars
    this.estrellas = this.physics.add.group();
    spawnPoint = map.findObject("objetos", (obj) => obj.name === "salida");
    console.log("spawn point salida ", spawnPoint);
    this.salida = this.physics.add
      .sprite(spawnPoint.x, spawnPoint.y, "door")
      .setScale(0.05);
    this.salida.visible = false;

    spawnPoint = map.findObject("objetos", (obj) => obj.name === "bomba");
    console.log("spawn point bomba", spawnPoint);
    this.bomba = this.physics.add
      .sprite(spawnPoint.x, spawnPoint.y, "bomb")
      .setScale(1)
      .setBounce(1);

    // find object layer
    // if type is "stars", add to stars group
    objectosLayer.objects.forEach((objData) => {
      //console.log(objData.name, objData.type, objData.x, objData.y);

      const { x = 0, y = 0, name } = objData;
      switch (name) {
        case "estrella": {
          // add star to scene
          // console.log("estrella agregada: ", x, y);
          const star = this.estrellas.create(x, y, "star");
          break;
        }
      }
    });

    this.physics.add.collider(this.jugador, plataformaLayer);
    this.physics.add.collider(this.estrellas, plataformaLayer);
    this.physics.add.collider(this.salida, plataformaLayer);
    this.physics.add.collider(this.bomba, plataformaLayer);
    this.physics.add.collider(
      this.jugador,
      this.estrellas,
      //this.bomba,
      this.recolectarEstrella,
      null,
      this
    );
    this.physics.add.collider(
      this.jugador,
      this.salida,
      this.pasarnivel,
      null,
      this
    );

    this.physics.add.collider(
      this.jugador,
      this.bomba,
      this.chocarbomba,
      null,
      this
    );

    this.score = 0;
    this.scoreText = this.add.text(20, 20, "Nivel:1 - Score:" + this.score, {
      fontSize: "28px",
      fontStyle: "bold",
      fill: "#ffffff",
    });
    this.timer = 30;
    this.timerText = this.add.text(700, 20, this.timer, {
      fontSize: "32px",
      fontStyle: "bold",
      fill: "#ffffff",
    });
    this.time.addEvent({
      delay: 1000,
      callback: this.onSecond,
      callbackScope: this,
      loop: true,
    });
  }

  update() {
    // update game objects
    // check input
    //move left
    if (this.cursors.left.isDown) {
      this.jugador.setVelocityX(-160);
      this.jugador.anims.play("left", true);
    }
    //move right
    else if (this.cursors.right.isDown) {
      this.jugador.setVelocityX(160);
      this.jugador.anims.play("right", true);
    }
    //stop
    else {
      this.jugador.setVelocityX(0);
      this.jugador.anims.play("turn");
    }

    //jump
    if (this.cursors.up.isDown && this.jugador.body.blocked.down) {
      this.jugador.setVelocityY(-330);
    }

    if (this.gameOver){
      this.scene.start("gameOver");
    }

  }
  onSecond() {
    this.timer--;
    this.timerText.setText(this.timer);
    if (this.timer <= 0) {
      this.gameOver = true;
    }
  }

  recolectarEstrella(jugador, estrella) {
    estrella.disableBody(true, true);

    if (this.estrellas.getTotalUsed() < 5) {
      this.salida.visible = true;
    }

    // todo / para hacer: sumar puntaje

    // todo / para hacer: controlar si el grupo esta vacio

    // todo / para hacer: ganar el juego
  }
  pasarnivel() {
    if (this.salida.visible === true) {
      this.scene.start("juego2");
    }
  }

  chocarbomba() {

    this.gameOver = true;
    
  }
}
