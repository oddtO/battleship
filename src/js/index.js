import "../css/reset.css";
import "../css/style.css";
import "../css/header.css";
import "../css/body.css";
import "../css/main.css";
import "../css/tile.css";
import { Player } from "./player.js";
import { Renderer } from "./page-renderer.js";
import { Gameboard } from "./gameboard.js";

const gameboard1 = new Gameboard(10);
const gameboard2 = new Gameboard(10);
const player1 = new Player(gameboard1, gameboard2, true);
const player2 = new Player(gameboard2, gameboard1, true);

const renderer = new Renderer(player1, player2);
renderer.init();

player1.generateShips();
renderer.render();
