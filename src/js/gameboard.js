import { Tile } from "./tile.js";
const GAMEBOARD_SIZE = 10;

export class Gameboard {
  constructor(size = GAMEBOARD_SIZE) {
    this.tiles = [];
    this.ships = [];
    this.tilesEnemySuspect = [];
    this.isPrevTileShip = false;
    this.shipNeighboringTilesSymbol = Symbol("neighboring-tiles");
    for (let y = 0; y < size; ++y) {
      this.tiles.push([]);
      for (let x = 0; x < size; ++x) {
        this.tiles[y].push(new Tile());
      }
    }
  }
  placeShip(ship, y, x, dir = "horizontal") {
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
    // ship[this.shipNeighboringTilesSymbol] = new Set();
    const neighborTiles = new Set();
    this.ships.push(ship);
    this.tiles[y][x].ship = ship;
    let neighbors = this.#detectNeighboringTiles(ship, y, x, offsets);
    // neighborTiles.add(...neighbors);

    neighbors.forEach((neighbor) => neighborTiles.add(neighbor));
    if (dir === "horizontal") {
      for (let i = 1; i < ship.length; ++i) {
        this.tiles[y][x + i].ship = ship;

        neighbors = this.#detectNeighboringTiles(ship, y, x + i, offsets);
        // neighborTiles.add(...neighbors);
        neighbors.forEach((neighbor) => neighborTiles.add(neighbor));
      }
    } else {
      for (let i = 1; i < ship.length; ++i) {
        this.tiles[y + i][x].ship = ship;
        neighbors = this.#detectNeighboringTiles(ship, y + i, x, offsets);
        // neighborTiles.add(...neighbors);
        neighbors.forEach((neighbor) => neighborTiles.add(neighbor));
      }
    }

    ship[this.shipNeighboringTilesSymbol] = neighborTiles;
  }
  #detectNeighboringTiles(ship, y, x, offsets) {
    /* if (ship[this.shipNeighboringTilesSymbol].has(this.tiles[y][x]))
      ship[this.shipNeighboringTilesSymbol].delete(this.tiles[y][x]); */

    const neighborTiles = [];
    for (const [yOffset, xOffset] of offsets) {
      if (
        y + yOffset < 0 ||
        x + xOffset < 0 ||
        y + yOffset >= this.tiles.length ||
        x + xOffset >= this.tiles[0].length
      )
        continue;
      /* ship[this.shipNeighboringTilesSymbol].add(
        this.tiles[y + yOffset][x + xOffset],
      ); */
      neighborTiles.push(this.tiles[y + yOffset][x + xOffset]);
    }
    return neighborTiles;
  }

  getTileAt(y, x) {
    return this.tiles[y][x];
  }
  receiveAttack(y, x) {
    const leftRightOffsets = [
      [0, 1],
      [0, -1],
    ];

    const topBottomOffsets = [
      [1, 0],
      [-1, 0],
    ];
    const hitTile = this.tiles[y][x];
    hitTile.isHit = true;
    if (hitTile.ship) {
      hitTile.ship.hit();
      if (hitTile.ship.isSunk()) {
        hitTile.ship[this.shipNeighboringTilesSymbol].forEach(
          (tile) => (tile.isHit = true),
        );

        this.isPrevTileShip = false;
      } else {
        if (!this.isPrevTileShip) {
          this.hitDirection = "random";
          this.prevHitCoords = [y, x];
          this.isPrevTileShip = true;
        } else {
          const [prevY, prevX] = this.prevHitCoords;
          if (prevY != y) {
            this.hitDirection = "vertical";
          } else if (prevX != x) {
            this.hitDirection = "horizontal";
          }
        }
      }

      this.isPrevTileShip = true;
      return true;
    }
    this.isPrevTileShip = false;
    return false;
  }

  areAllShipDestroyed() {
    return this.ships.every((ship) => ship.isSunk());
  }
}
