import Phaser from "phaser";
import { Menu } from "./scenes/Menu";
import { Battle } from "./scenes/Battle";

// detect iOS (Safari, Yandex, etc.)
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const rendererType = isIOS ? "CANVAS" : "AUTO";

// ✅ create a visible banner
const banner = document.createElement("div");
banner.innerText = `Pixel Cards booting... Renderer: ${rendererType}, UA: ${navigator.userAgent}`;
banner.style.position = "fixed";
banner.style.top = "0";
banner.style.left = "0";
banner.style.right = "0";
banner.style.zIndex = "9999";
banner.style.fontFamily = "monospace";
banner.style.fontSize = "12px";
banner.style.padding = "4px";
banner.style.color = "#fff";
banner.style.background = "#333";
document.body.appendChild(banner);

console.log("Boot banner added");

// Try-catch to see if Phaser crashes on init
try {
  const game = new Phaser.Game({
    type: isIOS ? Phaser.CANVAS : Phaser.AUTO,
    backgroundColor: "#0f0f1a",
    render: {
      pixelArt: true,
      antialias: false,
      roundPixels: true,
      powerPreference: "default",
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 720,
      height: 1280,
    },
    scene: [Menu, Battle],
  });

  console.log("Phaser game created", game);
  banner.innerText += "\n✅ Phaser created successfully.";
} catch (err) {
  banner.innerText += "\n❌ Phaser failed: " + (err as Error).message;
  console.error("Phaser init error", err);
}
