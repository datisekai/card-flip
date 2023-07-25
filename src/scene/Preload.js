import Phaser from "phaser";
import WebFontFile from "../fonts/WebFontFile";
import config from "../config";

const { fontFamily } = config;

export default class Preload extends Phaser.Scene {
  constructor() {
    super("preload");
  }

  preload() {
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(40, 270, 320, 50);
    
    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
        x: width / 2,
        y: height / 2 - 50,
        text: 'Loading...',
        style: {
            font: '20px monospace',
            fill: '#ffffff'
        }
    });
    loadingText.setOrigin(0.5, 0.5);
    
    var percentText = this.make.text({
        x: width / 2,
        y: height / 2 - 5,
        text: '0%',
        style: {
            font: '18px monospace',
            fill: '#ffffff'
        }
    });
    percentText.setOrigin(0.5, 0.5);
    
    var assetText = this.make.text({
        x: width / 2,
        y: height / 2 + 50,
        text: '',
        style: {
            font: '18px monospace',
            fill: '#ffffff'
        }
    });
    assetText.setOrigin(0.5, 0.5);
    
    this.load.on('progress', function (value) {
        percentText.setText(parseInt(value * 100) + '%');
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(50, 280, 300 * value, 30);
    });
    
    this.load.on('fileprogress', function (file) {
        assetText.setText('Loading asset: ' + file.key);
    });
    this.load.on('complete', function () {
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
        percentText.destroy();
        assetText.destroy();
    });
    

    for (let i = 1; i <= 6; i++) {
      this.load.image("card" + i, `images/card${i}.png`);
    }
    this.load.image("card-back", "images/card-back.png");
    this.load.image("gold", "images/gold.png");
    this.load.image("time", "images/time.png");
    this.load.addFile(new WebFontFile(this.load, fontFamily));
    this.load.audio('backgroundMusic', 'audio/main-audio.mp3');
  }

  create() {
    this.scene.start("play");
  }
  
}
