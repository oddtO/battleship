import { Tile } from "./tile.js";
const GAMEBOARD_SIZE = 10;

export class Gameboard {
  constructor() {
    this.tiles = [];
    for (let y = 0; y < GAMEBOARD_SIZE; ++y) {
      this.tiles.push([]);
      for (let x = 0; x < GAMEBOARD_SIZE; ++x) {
        this.tiles[y].push({});
      }
    }
  }
  placeShip(ship, x, y) {}
  getTileAt(x, y) {}
  receiveAttack(x, y) {}
  areAllShipDestroyed() {}
}
