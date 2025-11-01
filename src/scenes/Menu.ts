import Phaser from "phaser";

function buttonStyle(bgColor: string = "#ffd166") {
  return {
    fontFamily: "monospace",
    fontSize: "32px",
    color: "#ffffff",           // white text for contrast
    backgroundColor: bgColor,
    padding: { x: 20, y: 12 },
    stroke: "#000000",          // outline for visibility
    strokeThickness: 3,
  } as Phaser.Types.GameObjects.Text.TextStyle;
}


export class Menu extends Phaser.Scene {
  constructor() {
    super("Menu");
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height * 0.25, "Pixel Cards — Lite", {
        fontFamily: "monospace",
        fontSize: "36px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    const start = this.add
     .text(width / 2, height * 0.55, "START GAME", buttonStyle("#ffd166"))
     .setOrigin(0.5)
     .setInteractive({ useHandCursor: true });

    start.on("pointerdown", () => {
      this.scene.start("Battle");
    });

    this.add
      .text(width / 2, height * 0.8, "Rules:\nEach turn both draw 1–5.\nLower number loses 1 HP.\nFirst to 0 HP loses.", {
        fontFamily: "monospace",
        fontSize: "20px",
        color: "#cccccc",
        align: "center",
      })
      .setOrigin(0.5);
  }
}
