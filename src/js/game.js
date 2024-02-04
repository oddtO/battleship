import { Player } from "./player.js";
import { DOMHandler } from "./dom-handler";
import { Gameboard } from "./gameboard.js";
import { Ship } from "./ship.js";

const shipSizes = [[1, 2]];
export class Game {
  constructor() {
    this.addEventListeners();
  }

  async startGame(isAI1, isAI2, player1Name, player2Name) {
    this.abortController?.abort();
    this?.domHandler?.abortController.abort();
    this.abortController = new AbortController();
    const gameboard1 = new Gameboard(10);
    const gameboard2 = new Gameboard(10);

    this.player1 = new Player(gameboard1, gameboard2, isAI1, player1Name);
    this.player2 = new Player(gameboard2, gameboard1, isAI2, player2Name);

    this.resetGameboards();
  }
  async getInput(player) {
    const coordsPromise = this.domHandler.askInput(player);
    if (player.isAI) {
      console.log("ai");
      this.domHandler.sendInput(player, ...player.getRandomCoords());
    }
    let y, x;
    try {
      [y, x] = await coordsPromise;
    } catch {
      this.callCount = 0;
      this.startGame(
        this.player1.isAI,
        this.player2.isAI,
        this.player1.name,
        this.player2.name,
      );
      return;
    }
    player.enemyGameboard.receiveAttack(y, x);
  }

  addEventListeners() {
    document.body.addEventListener("game-reset", () => {
      console.log("bbb");
      this.startGame(
        this.player1.isAI,
        this.player2.isAI,
        this.player1.name,
        this.player2.name,
      );
    });
    document.body.addEventListener("custom-game", async (event) => {
      await this.startGame(
        event.detail.isAI1,
        event.detail.isAI2,
        event.detail.name1,
        event.detail.name2,
      );
    });
  }
  async resetGameboards() {
    const gameboard1 = new Gameboard(10);
    const gameboard2 = new Gameboard(10);

    this.player1.ownGameboard = this.player2.enemyGameboard = gameboard1;
    this.player2.ownGameboard = this.player1.enemyGameboard = gameboard2;

    this.domHandler = new DOMHandler(this.player1, this.player2);
    this.domHandler.init();

    this.domHandler.renderPlayer(this.player1);
    this.callCount = 0;
  }
  async askShipCoordsAndPlace(player, shipSizes) {
    for (const shipSize of shipSizes) {
      const [length, count] = shipSize;
      for (let i = 0; i < count; ++i) {
        this.domHandler.enterShipSelectMode(player);
        this.domHandler.renderAskShipPlacementCoords(length, count - i);

        const [y, x, direction] = await this.awaitShipCoords();
        player.ownGameboard.placeShip(new Ship(length), y, x, direction);
        this.domHandler.renderPlayer(player);
        this.domHandler.leaveShipSelectMode();
      }
    }
  }
  awaitShipCoords() {
    return new Promise((resolve, reject) => {
      document.addEventListener("ship-placement", shipCoordsHandler);
      this.abortController.signal.onabort = () => reject();
      function shipCoordsHandler(event) {
        document.removeEventListener("ship-placement", shipCoordsHandler);
        resolve([event.detail.y, event.detail.x, event.detail.direction]);
      }
    });
  }
  async *[Symbol.asyncIterator]() {
    this.callCount = 0;
    while (true) {
      ++this.callCount;

      try {
        if (this.callCount == 1) {
          if (this.player1.isAI) this.player1.generateShips(shipSizes);
          else {
            if (!this.player2.isAI)
              this.domHandler.showPassDeviceScreen(this.player1.name);
            await this.askShipCoordsAndPlace(this.player1, shipSizes);
          }
          if (this.player2.isAI) this.player2.generateShips(shipSizes);
          else {
            if (!this.player1.isAI)
              this.domHandler.showPassDeviceScreen(this.player2.name);
            await this.askShipCoordsAndPlace(this.player2, shipSizes);
            await new Promise((resolve) => setTimeout(resolve, 10));
          }
        }
      } catch {
        continue;
      }

      if (this.callCount % 2) {
        if (!(this.player1.isAI || this.player2.isAI))
          this.domHandler.showPassDeviceScreen(this.player1.name);
        this.domHandler.renderPlayer(this.player1);
        yield this.player1;
      } else {
        if (!(this.player1.isAI || this.player2.isAI))
          this.domHandler.showPassDeviceScreen(this.player2.name);
        this.domHandler.renderPlayer(this.player2);
        yield this.player2;
      }
    }
  }
}
