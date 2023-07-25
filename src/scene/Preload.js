import Phaser from "phaser";
import WebFontFile from "../fonts/WebFontFile";
import config from "../config";

const { fontFamily } = config;

export default class Preload extends Phaser.Scene {
  constructor() {
    super("preload");
  }

  preload() {
    for (let i = 1; i <= 6; i++) {
      this.load.image("card" + i, `images/card${i}.png`);
    }
    this.load.image("card-back", "images/card-back.png");
    this.load.image("gold", "images/gold.png");
    this.load.addFile(new WebFontFile(this.load, fontFamily));
  }

  create() {
    this.scene.start("play");
  }
}
