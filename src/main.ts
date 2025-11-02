// src/main.ts
import Phaser from "phaser";
import { Menu } from "./scenes/Menu";
import { Battle } from "./scenes/Battle";

// --- Debug aid (shows text immediately on page load) ---
console.log("UA:", navigator.userAgent);
document.body.style.background = "#000";
document.body.innerHTML = `
  <p style="color:white;font-family:monospace;text-align:center;margin-top:40px">
    Init OK — Phaser loading...
  </p>
`;

// --- iOS detection ---
const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);

// --- Create game ---
new Phaser.Game({
  type: isIOS ? Phaser.CANVAS : Phaser.AUTO,
  backgroundColor: "#0f0f1a",
  render: { pixelArt: true, antialias: false, roundPixels: true },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 720,
    height: 1280,
  },
  scene: [Menu, Battle],
});
