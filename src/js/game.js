import { Player } from "./player.js";
import { Renderer } from "./page-renderer.js";
import { Gameboard } from "./gameboard.js";

export class Game {
  constructor(isAI1, isAI2) {
    const gameboard1 = new Gameboard(10);
    const gameboard2 = new Gameboard(10);
    this.player1 = new Player(gameboard1, gameboard2, isAI1);
    this.player2 = new Player(gameboard2, gameboard1, isAI2);

    this.renderer = new Renderer(this.player1, this.player2);
    this.renderer.init();

    this.player1.generateShips();
    this.player2.generateShips();
  }

  async getInput(player) {
    const coordsPromise = this.renderer.askInput(player);
    if (player.isAI) {
      console.log("ai");
      this.renderer.sendInput(player, ...player.getRandomCoords());
    }
    const [y, x] = await coordsPromise;
    player.enemyGameboard.receiveAttack(y, x);
  }

  *[Symbol.asyncIterator]() {
    let callCount = 0;
    while (true) {
      ++callCount;
      if (callCount % 2) {
        yield this.player1;
      } else {
        yield this.player2;
      }
    }
  }
}
