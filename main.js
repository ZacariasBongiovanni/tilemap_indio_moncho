import Juego from "./public/assets/scenes/Juego.js";
import Juego4 from "./public/assets/scenes/Juego4.js";
import gameOver from "./public/assets/scenes/gameOver.js";
import Juego2 from "./public/assets/scenes/juego2.js";
import Juego3 from "./public/assets/scenes/juego3.js";
import win from "./public/assets/scenes/win.js";

// Create a new Phaser config object
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 800,
      height: 600,
    },
    max: {
      width: 1600,
      height: 1200,
    },
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
      debug: true,
    },
  },
  // List of scenes to load
  // Only the first scene will be shown
  // Remember to import the scene before adding it to the list
  scene: [Juego, Juego2, gameOver,Juego3, Juego4, win],
};

// Create a new Phaser game instance
window.game = new Phaser.Game(config);
