export default class gameOver extends Phaser.Scene {
  constructor() {
    super("gameOver");
  }
  preload(){
    this.load.image("gameover", "./public/assets/images/gameover.png");
  }
  create() {
    this.add.image(400, 300, "gameover")
      .setInteractive()
      .on("pointerdown", () => this.scene.start("hello-world"));
  }
}