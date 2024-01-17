import { Player } from "./player.js";
import { DOMHandler } from "./dom-handler";
import { Gameboard } from "./gameboard.js";

export class Game {
  constructor(isAI1, isAI2) {
    const gameboard1 = new Gameboard(10);
    const gameboard2 = new Gameboard(10);
    this.player1 = new Player(gameboard1, gameboard2, isAI1);
    this.player2 = new Player(gameboard2, gameboard1, isAI2);

    this.resetGameboards();
    this.addEventListeners();
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

  addEventListeners() {
    document.body.addEventListener("game-reset", () => this.resetGameboards());
  }
  resetGameboards() {
    const gameboard1 = new Gameboard(10);
    const gameboard2 = new Gameboard(10);

    this.player1.ownGameboard = this.player2.enemyGameboard = gameboard1;
    this.player2.ownGameboard = this.player1.enemyGameboard = gameboard2;

    this.player1.generateShips();
    this.player2.generateShips();
    this.domHandler = new DOMHandler(this.player1, this.player2);
    this.domHandler.init();

    this.domHandler.renderPlayer(this.player1, this.player2);
    this.callCount = 1;
  }
  *[Symbol.asyncIterator]() {
    this.callCount = 0;
    while (true) {
      ++this.callCount;
      if (this.callCount % 2) {
        this.domHandler.renderPlayer(this.player1, this.player2);
        yield this.player1;
      } else {
        this.domHandler.renderPlayer(this.player2, this.player1);
        yield this.player2;
      }
    }
  }
}
