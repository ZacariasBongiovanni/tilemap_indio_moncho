export default class gameOver extends Phaser.Scene {
  constructor() {
    super("gameOver");
  }
  create() {
    this.add
      .setInteractive()
      .on("pointerdown", () => this.scene.start("juego"));
  }
}
