import Phaser from "phaser";
command:workbench.action.reloadWindow
class MainScene extends Phaser.Scene {
  preload() {
    this.load.image("card", "https://labs.phaser.io/assets/sprites/card.png");
  }

  create() {
    const card = this.add.image(360, 640, "card").setInteractive();
    card.on("pointerdown", () => {
      card.setScale(card.scaleX === 1 ? 1.2 : 1);
    });

    this.add.text(50, 20, "Hello, Pixel Cards!", { color: "#ffffff" });
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  backgroundColor: "#0f0f1a",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 720,
    height: 1280,
  },
  scene: [MainScene],
});
