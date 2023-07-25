import Phaser from "phaser";

export default class Card extends Phaser.GameObjects.Sprite {
  constructor(scene, id) {
    super(scene, 0, 0, "card-back");

    scene.add.existing(this);

    this.scene = scene;
    this.id = id;

    this.setScale(0.5);

    this.setInteractive();

    this.on("pointerdown", async () => {
      await this.backToCard();

      if (scene.activeList.length == 0) {
        scene.activeList.push(this);
        return;
      }

      if (scene.activeList.length == 1) {
        if (scene.activeList[0].id === this.id) {
          scene.activeList[0].destroy();
          this.destroy();
          scene.increaseScore();
        } else {
          scene.activeList[0].cardToBack();
          this.cardToBack();
        }

        scene.activeList = [];

        return;
      }
    });
  }

  cardToBack() {
    this.setInteractive()
    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: this,
        scaleX: 0,
        duration: 300,
        ease: "Linear",
        onComplete: () => {
          this.setTexture("card-back");
          this.scene.tweens.add({
            targets: this,
            scaleX: 0.5,
            duration: 300,
            ease: "Linear",
            onComplete: () => {
              resolve();
            },
          });
        },
      });
    });
  }

  backToCard() {
    this.disableInteractive()
    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: this,
        scaleX: 0,
        duration: 300,
        ease: "Linear",
        onComplete: () => {
          this.setTexture("card" + this.id);
          this.scene.tweens.add({
            targets: this,
            scaleX: 0.5,
            duration: 300,
            ease: "Linear",
            onComplete: () => {
              resolve();
            },
          });
        },
      });
    });
  }
}
