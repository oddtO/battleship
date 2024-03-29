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
import "../css/ship-select.css";
import "../css/game-over-screen.css";

import { Game } from "./game.js";

const game = new Game(false, true);
await game.startGame(false, true, "player1", "player2");

for await (const player of game) {
  // game.domHandler.renderPlayer(player);
  await game.getInput(player);

  if (player.enemyGameboard.areAllShipsDestroyed()) {
    await game.domHandler.showGameOverScreen(player);
  }
}
