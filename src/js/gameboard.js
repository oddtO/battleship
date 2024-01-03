import { Tile } from "./tile.js";
const GAMEBOARD_SIZE = 10;

export class Gameboard {
  constructor() {
    this.tiles = [];
    this.ships = [];
    for (let y = 0; y < GAMEBOARD_SIZE; ++y) {
      this.tiles.push([]);
      for (let x = 0; x < GAMEBOARD_SIZE; ++x) {
        this.tiles[y].push(new Tile());
      }
    }
  }
  placeShip(ship, x, y, dir) {
    this.ships.push(ship);
    this.tiles[y][x].ship = ship;
    if (dir === "horizontal") {
      for (let i = 1; i < ship.length; ++i) this.tiles[y][x + i].ship = ship;
    } else {
      for (let i = 1; i < ship.length; ++i) this.tiles[y + i][x].ship = ship;
    }
  }
  getTileAt(x, y) {
    return this.tiles[y][x];
  }
  receiveAttack(x, y) {
    this.tiles[y][x].isHit = true;
    if (this.tiles[y][x].ship) {
      this.tiles[y][x].ship.hit();
      return true;
    }
    return false;
  }
  areAllShipDestroyed() {
    return this.ships.every((ship) => ship.isSunk());
  }
}
