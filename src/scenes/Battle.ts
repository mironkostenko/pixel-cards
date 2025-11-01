import Phaser from "phaser";

// --- Resolve image URLs from src/ with Vite/ESM ---
const cardUrls = [1, 2, 3, 4, 5].map(
  (i) => new URL(`../assets/images/${i}.png`, import.meta.url).href
);
// Resolve sound URL
const cardSoundUrl = new URL("../assets/sound.wav", import.meta.url).href;

function buttonStyle(bgColor: string = "#ffd166") {
  return {
    fontFamily: "monospace",
    fontSize: "32px",
    color: "#ffffff",
    backgroundColor: bgColor,
    padding: { x: 20, y: 12 },
    stroke: "#000000",
    strokeThickness: 3,
  } as Phaser.Types.GameObjects.Text.TextStyle;
}

export class Battle extends Phaser.Scene {
  private playerHP!: number;
  private enemyHP!: number;

  private playerHPText!: Phaser.GameObjects.Text;
  private enemyHPText!: Phaser.GameObjects.Text;

  private playerCardSprite?: Phaser.GameObjects.Image;
  private enemyCardSprite?: Phaser.GameObjects.Image;

  private playBtn!: Phaser.GameObjects.Text;
  private finished!: boolean;

  constructor() {
    super("Battle");
  }

  // Preload resolved URLs so Phaser can find them in dev/build
  preload() {
    // cards
    cardUrls.forEach((url, idx) => {
      this.load.image(`card_${idx + 1}`, url);
    });
    // sound
    this.load.audio("cardSound", cardSoundUrl);
  }

  init() {
    // Reset state on every (re)start
    this.playerHP = 5;
    this.enemyHP = 5;
    this.finished = false;
  }

  create() {
    const { width, height } = this.scale;

    // Title
    this.add
      .text(width / 2, 40, "Battle", {
        fontFamily: "monospace",
        fontSize: "28px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    // HP display
    this.playerHPText = this.add.text(40, 100, "", this.hudStyle());
    this.enemyHPText = this.add
      .text(width - 40, 100, "", this.hudStyle())
      .setOrigin(1, 0);
    this.updateHPTexts();

    // Labels where cards will appear
    this.add
      .text(width * 0.25, height * 0.55, "YOU", this.labelStyle())
      .setOrigin(0.5);
    this.add
      .text(width * 0.75, height * 0.55, "ENEMY", this.labelStyle())
      .setOrigin(0.5);

    // Play Turn button (green)
    this.playBtn = this.add
      .text(width / 2, height * 0.8, "PLAY TURN", buttonStyle("#06d6a0"))
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    this.playBtn.on("pointerdown", () => this.playTurn());
    this.playBtn.on("pointerover", () =>
      this.playBtn.setStyle({ backgroundColor: "#08b68b" })
    );
    this.playBtn.on("pointerout", () =>
      this.playBtn.setStyle({ backgroundColor: "#06d6a0" })
    );

    // Back to menu (dark blue)
    const back = this.add
      .text(20, 20, "← MENU", buttonStyle("#1b263b"))
      .setInteractive({ useHandCursor: true });
    back.on("pointerdown", () => this.scene.start("Menu"));
    back.on("pointerover", () =>
      back.setStyle({ backgroundColor: "#24344f" })
    );
    back.on("pointerout", () => back.setStyle({ backgroundColor: "#1b263b" }));
  }

  private playTurn() {
    if (this.finished) return;

    const { width, height } = this.scale;

    // Draw cards 1..5
    const playerCard = Phaser.Math.Between(1, 5);
    const enemyCard = Phaser.Math.Between(1, 5);

    // Remove previous card images if present
    this.playerCardSprite?.destroy();
    this.enemyCardSprite?.destroy();

    // Add new card images (integer scale for crisp pixels; your cards are 128x192)
    this.playerCardSprite = this.add
      .image(width * 0.25, height * 0.45, `card_${playerCard}`)
      .setOrigin(0.5)
      .setScale(2); // 128x192 * 2 = 256x384
    this.enemyCardSprite = this.add
      .image(width * 0.75, height * 0.45, `card_${enemyCard}`)
      .setOrigin(0.5)
      .setScale(2);

    // 🔊 Play sound when both cards appear
    this.sound.play("cardSound", { volume: 0.8 });

    // Juicy pop
    this.tweenPop(this.playerCardSprite);
    this.tweenPop(this.enemyCardSprite);

    // Rule: lower number loses 1 HP; tie = nothing
    if (playerCard < enemyCard) {
      this.playerHP = Math.max(0, this.playerHP - 1);
      this.flash(this.playerCardSprite, 0xff4d6d);
    } else if (enemyCard < playerCard) {
      this.enemyHP = Math.max(0, this.enemyHP - 1);
      this.flash(this.enemyCardSprite, 0xffd166);
    }

    this.updateHPTexts();

    // Check end states
    if (this.playerHP <= 0) {
      this.endScreen("GAME OVER", "TRY AGAIN", false);
    } else if (this.enemyHP <= 0) {
      this.endScreen("YOU WIN!", "START AGAIN", true);
    }
  }

  private endScreen(title: string, actionLabel: string, win: boolean) {
    this.finished = true;
    const { width, height } = this.scale;

    // Dim overlay
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6);

    // Title
    this.add
      .text(width / 2, height / 2 - 40, title, {
        fontFamily: "monospace",
        fontSize: "40px",
        color: win ? "#06d6a0" : "#ff4d6d",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Restart battle (yellow)
    const again = this.add
      .text(width / 2, height / 2 + 30, actionLabel, buttonStyle("#ffd166"))
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    again.on("pointerdown", () => this.scene.restart());
    again.on("pointerover", () =>
      again.setStyle({ backgroundColor: "#f3bf3d" })
    );
    again.on("pointerout", () =>
      again.setStyle({ backgroundColor: "#ffd166" })
    );

    // Back to Menu (dark blue)
    const back = this.add
      .text(width / 2, height / 2 + 95, "BACK TO MENU", buttonStyle("#1b263b"))
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    back.on("pointerdown", () => this.scene.start("Menu"));
    back.on("pointerover", () =>
      back.setStyle({ backgroundColor: "#24344f" })
    );
    back.on("pointerout", () => back.setStyle({ backgroundColor: "#1b263b" }));
  }

  private updateHPTexts() {
    this.playerHPText.setText(`YOU: ${this.playerHP} HP`);
    this.enemyHPText.setText(`ENEMY: ${this.enemyHP} HP`);
  }

  // --- style & juice helpers ---
  private hudStyle() {
    return {
      fontFamily: "monospace",
      fontSize: "28px",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 3,
    } as Phaser.Types.GameObjects.Text.TextStyle;
  }

  private labelStyle() {
    return {
      fontFamily: "monospace",
      fontSize: "22px",
      color: "#e0e0e0",
      stroke: "#000000",
      strokeThickness: 3,
    } as Phaser.Types.GameObjects.Text.TextStyle;
  }

  private tweenPop(
    target: Phaser.GameObjects.Image | Phaser.GameObjects.Text
  ) {
    this.tweens.add({
      targets: target,
      scaleX: 1.15,
      scaleY: 1.15,
      yoyo: true,
      duration: 120,
      ease: "Quad.Out",
    });
  }

  private flash(
    target: Phaser.GameObjects.Image | Phaser.GameObjects.Text,
    tint: number
  ) {
    target.setTint(tint);
    this.time.delayedCall(120, () => target.clearTint());
  }
}
