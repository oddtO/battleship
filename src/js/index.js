import "../css/reset.css";
import "../css/style.css";
import "../css/header.css";
import "../css/body.css";
import "../css/main.css";
import "../css/tile.css";
import { Game } from "./game.js";

const game = new Game(false, false);

for await (const player of game) {
  game.renderer.renderPlayer(player);
  await game.getInput(player);
}
