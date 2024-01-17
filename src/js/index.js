import "../css/reset.css";
import "../css/style.css";
import "../css/header.css";
import "../css/body.css";
import "../css/main.css";
import "../css/tile.css";
import "../css/popup.css";
import "../css/pass-device.css";
import "../css/custom-game.css";
import "../css/media.css";

import { Game } from "./game.js";

const game = new Game(false, true);

for await (const player of game) {
  // game.domHandler.renderPlayer(player);
  await game.getInput(player);
}
