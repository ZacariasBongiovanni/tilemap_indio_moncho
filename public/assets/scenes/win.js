export default class win extends Phaser.Scene {
    constructor() {
      super("win");
    }
    preload(){
      this.load.image("win", "./public/assets/images/victoria.png");
    }
    create() {
      this.add.image(400, 300, "win")
        .setInteractive()
        .on("pointerdown", () => this.scene.start("hello-world"));
    }
  }
