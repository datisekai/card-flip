import Phaser from "phaser";
import config from "../config";
import Card from "../game-object/Card";

const { width, height, fontFamily, backgroundColor } = config;

export default class Play extends Phaser.Scene {
  constructor() {
    super("play");
  }

  create() {
    this.data = Phaser.Utils.Array.Shuffle([
      1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6,
    ]);

    this.isPlay = false;
    this.activeList = [];

    this.score = 0;
    this.timeCountDown = 90;
    this.createHeader();
    this.createCards();
    
    this.music = this.loadAudio()
    
    this.handleGameStart();

  }

  loadAudio() {
    const music = this.sound.add('backgroundMusic');
    music.play()
    return music
  }

  handleGameStart() {
    this.createDialog("Ấn Chơi để bắt đầu", "Bạn có 90 giây...", ["Chơi"])
      .setPosition(width / 2, height / 2)
      .layout()
      .modalPromise({
        // defaultBehavior: false,
        manaulClose: true,
        duration: {
          in: 500,
          out: 500,
        },
      })
      .then((data) => {
        if (data.index == 0) {
          this.isPlay = true;
          setInterval(() => {
            if (this.isPlay) {
              this.timeCountDown--;
              this.labelTime.setText(this.timeCountDown);
              if (this.timeCountDown == 0 || this.score == 60) {
                this.handleGameOver();
              }
            }
          }, 1000);
        }
      });
  }

  handleGameOver() {
    this.isPlay = false;
    this.createDialog(
      "Trò chơi kết thúc",
      this.score == 60
        ? `Chúc mừng bạn đã hoàn thành trò chơi trong ${
            90 - this.timeCountDown
          } giây`
        : "Cố gắng vào lần sau nhé",
      ["Chơi lại"]
    )
      .setPosition(width / 2, height / 2)
      .layout()
      .modalPromise({
        // defaultBehavior: false,
        manaulClose: true,
        duration: {
          in: 500,
          out: 500,
        },
      })
      .then((data) => {
        if (data.index == 0) {
          this.scene.restart();
        }
      });
  }

  increaseScore() {
    this.score += 10;
    this.labelScore.setText(this.score);
    this.labelScore.space.left = 16;
    this.labelScore.space.right = 16;

    if (this.score == 60) {
      this.handleGameOver();
    }
  }

  createHeader() {
    this.labelScore = this.rexUI.add
      .label({
        background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0xffffff),
        text: this.add.text(0, 0, "0", { fontSize: 40, color: "#000" }),
        icon: this.add.image(0, 0, "gold"),
        iconSize: 30,
        space: {
          left: 16,
          right: 16,
          top: 8,
          bottom: 8,
          icon: 10,
        },
      })
      .setPosition(80, 40)
      .layout();

    this.labelTime = this.rexUI.add
      .label({
        background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0xffffff),
        text: this.add.text(0, 0, this.timeCountDown, {
          fontSize: 40,
          color: "#000",
        }),
        icon: this.add.image(0, 0, "time"),
        iconSize: 30,
        space: {
          left: 16,
          right: 16,
          top: 8,
          bottom: 8,
          icon: 10,
        },
      })
      .setPosition(width - 80, 40)
      .layout();
  }

  createCards() {
    const cards = [];
    this.data.forEach((item) => {
      const card = new Card(this, item);
      cards.push(card);
    });

    Phaser.Actions.GridAlign(cards, {
      width: 3,
      height: 4,
      cellWidth: 70,
      cellHeight: 103,
      x: 65,
      y: 90,
    });
  }

  createDialog(title, content, buttons) {
    const dialog = this.rexUI.add
      .dialog({
        background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x1565c0),
        title: this.rexUI.add.label({
          background: this.rexUI.add.roundRectangle(
            0,
            0,
            100,
            40,
            20,
            0x003c8f
          ),
          text: this.add.text(0, 0, title, {
            fontSize: "24px",
          }),
          space: {
            left: 15,
            right: 15,
            top: 10,
            bottom: 10,
          },
        }),

        content: this.add.text(0, 0, content, {
          fontSize: "24px",
          wordWrap: { width: 300 },
        }),

        actions: [...buttons.map((item) => this.createLabel(item))],

        space: {
          title: 25,
          content: 25,
          action: 15,

          left: 20,
          right: 20,
          top: 20,
          bottom: 20,
        },

        align: {
          actions: "right", // 'center'|'left'|'right'
        },

        expand: {
          content: false, // Content is a pure text object
        },
      })
      .on("button.over", function (button, groupName, index, pointer, event) {
        button.getElement("background").setStrokeStyle(1, 0xffffff);
      })
      .on("button.out", function (button, groupName, index, pointer, event) {
        button.getElement("background").setStrokeStyle();
      });

    return dialog;
  }

  createLabel(text) {
    return this.rexUI.add.label({
      // width: 40,
      // height: 40,

      background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x16a34a),

      text: this.add.text(0, 0, text, {
        fontSize: "24px",
      }),

      space: {
        left: 16,
        right: 16,
        top: 10,
        bottom: 10,
      },
    });
  }
}
