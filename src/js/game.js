import { Player } from "./player.js";
import { DOMHandler } from "./dom-handler";
import { Gameboard } from "./gameboard.js";

export class Game {
  constructor(isAI1, isAI2, player1Name = "player1", player2Name = "player2") {
    this.startGame(isAI1, isAI2, player1Name, player2Name);
  }

  startGame(isAI1, isAI2, player1Name, player2Name) {
    const gameboard1 = new Gameboard(10);
    const gameboard2 = new Gameboard(10);

    this.player1 = new Player(gameboard1, gameboard2, isAI1, player1Name);
    this.player2 = new Player(gameboard2, gameboard1, isAI2, player2Name);

    this.resetGameboards();
    this.addEventListeners();
  }
  async getInput(player) {
    const coordsPromise = this.domHandler.askInput(player);
    if (player.isAI) {
      console.log("ai");
      this.domHandler.sendInput(player, ...player.getRandomCoords());
      setTimeout(this.domHandler.hidePassDeviceScreen.bind(this.domHandler));
    }
    let y, x;
    try {
      [y, x] = await coordsPromise;
    } catch {
      this.callCount = 0;
      return;
    }
    player.enemyGameboard.receiveAttack(y, x);
  }

  addEventListeners() {
    document.body.addEventListener("game-reset", () => this.resetGameboards());
    document.body.addEventListener("custom-game", (event) => {
      this.startGame(
        event.detail.isAI1,
        event.detail.isAI2,
        event.detail.name1,
        event.detail.name2,
      );
    });
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
    if (!this.player1.isAI && this.player2.isAI)
      setTimeout(this.domHandler.hidePassDeviceScreen.bind(this.domHandler));
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
