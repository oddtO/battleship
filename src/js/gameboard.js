import { Tile } from "./tile.js";
const GAMEBOARD_SIZE = 10;

export class Gameboard {
  constructor(size = GAMEBOARD_SIZE) {
    this.tiles = [];
    this.ships = [];
    this.shipNeighboringTilesSymbol = Symbol("neighboring-tiles");
    for (let y = 0; y < size; ++y) {
      this.tiles.push([]);
      for (let x = 0; x < size; ++x) {
        this.tiles[y].push(new Tile());
      }
    }
  }
  placeShip(ship, y, x, dir = "horizontal") {
    ship[this.shipNeighboringTilesSymbol] = new Set();
    this.ships.push(ship);
    this.tiles[y][x].ship = ship;
    this.#detectNeighboringTiles(ship, y, x);
    if (dir === "horizontal") {
      for (let i = 1; i < ship.length; ++i) {
        this.tiles[y][x + i].ship = ship;
        this.#detectNeighboringTiles(ship, y, x + i);
      }
    } else {
      for (let i = 1; i < ship.length; ++i) {
        this.tiles[y + i][x].ship = ship;
        this.#detectNeighboringTiles(ship, y + i, x);
      }
    }
  }
  #detectNeighboringTiles(ship, y, x) {
    const offsets = [
      [1, 1],
      [-1, 1],
      [-1, -1],
      [1, -1],
      [0, 1],
      [-1, 0],
      [0, -1],
      [1, 0],
    ];
    /* if (ship[this.shipNeighboringTilesSymbol].has(this.tiles[y][x]))
      ship[this.shipNeighboringTilesSymbol].delete(this.tiles[y][x]); */

    for (const [yOffset, xOffset] of offsets) {
      if (
        y + yOffset < 0 ||
        x + xOffset < 0 ||
        y + yOffset >= this.tiles.length ||
        x + xOffset >= this.tiles[0].length
      )
        continue;
      ship[this.shipNeighboringTilesSymbol].add(
        this.tiles[y + yOffset][x + xOffset],
      );
    }
  }
  getTileAt(y, x) {
    return this.tiles[y][x];
  }
  receiveAttack(y, x) {
    const hitTile = this.tiles[y][x];
    hitTile.isHit = true;
    if (hitTile.ship) {
      hitTile.ship.hit();
      if (hitTile.ship.isSunk())
        hitTile.ship[this.shipNeighboringTilesSymbol].forEach(
          (tile) => (tile.isHit = true),
        );

      return true;
    }
    return false;
  }
  areAllShipDestroyed() {
    return this.ships.every((ship) => ship.isSunk());
  }
}
