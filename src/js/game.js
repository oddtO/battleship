import { Player } from "./player.js";
import { DOMHandler } from "./page-renderer.js";
import { Gameboard } from "./gameboard.js";

export class Game {
  constructor(isAI1, isAI2) {
    this.resetGame(isAI1, isAI2);
  }

  async getInput(player) {
    const coordsPromise = this.domHandler.askInput(player);
    if (player.isAI) {
      console.log("ai");
      this.domHandler.sendInput(player, ...player.getRandomCoords());
    }
    const [y, x] = await coordsPromise;
    player.enemyGameboard.receiveAttack(y, x);
  }

  resetGame(isAI1, isAI2) {
    const gameboard1 = new Gameboard(10);
    const gameboard2 = new Gameboard(10);
    this.player1 = new Player(gameboard1, gameboard2, isAI1);
    this.player2 = new Player(gameboard2, gameboard1, isAI2);

    this.domHandler = new DOMHandler(this.player1, this.player2);
    this.domHandler.init();

    this.player1.generateShips();
    this.player2.generateShips();
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
