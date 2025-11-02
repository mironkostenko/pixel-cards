import Phaser from "phaser";
import { Menu } from "./scenes/Menu";
import { Battle } from "./scenes/Battle";

// detect iOS WebKit (includes Safari, Yandex, etc.)
const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);

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