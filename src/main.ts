import Phaser from "phaser";
import { Menu } from "./scenes/Menu.ts";
import { Battle } from "./scenes/Battle.ts";

new Phaser.Game({
  type: Phaser.CANVAS,  // <— TEMP: force Canvas
  backgroundColor: "#0f0f1a",
  render: { pixelArt: true, antialias: false },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 720, height: 1280 },
  scene: [Menu, Battle],
});
