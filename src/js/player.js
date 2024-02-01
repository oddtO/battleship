import { Ship } from "./ship";
import { AI } from "./ai";
import { Human } from "./human";
import { RandomNum } from "./random";

export class Player {
  constructor(ownGameboard, enemyGameboard, isAI = false, name = "unknown") {
    if (isAI) {
      this.getAttackOpportunities = AI.prototype.getAttackOpportunities;
      this.getRandomCoords = AI.prototype.getRandomCoords;
    }
    this.name = name;
    this.isAI = isAI;
    this.ownGameboard = ownGameboard;
    this.enemyGameboard = enemyGameboard;
  }

  generateShips(shipSizes) {
    for (const shipSize of shipSizes) {
      const [size, count] = shipSize;
      for (let i = 0; i < count; ++i) this.placeShipRandomly(new Ship(size));
    }
  }
  placeShipRandomly(ship) {
    const directions = ["horizontal", "vertical"];

    const shipDirection = directions[RandomNum(0, directions.length)];
    const placementOpportunities = this.getShipPlacementOpportunities(
      ship,
      shipDirection,
    );
    const randNam = RandomNum(0, placementOpportunities.length);
    console.log("rand: ", randNam, "input: ", placementOpportunities.length);
    const [y, x] = placementOpportunities[randNam];
    this.ownGameboard.placeShip(ship, y, x, shipDirection);
  }
  getShipPlacementOpportunities(ship, direction = "horizontal") {
    const possibleSpots = [];
    for (let y = 0; y < this.ownGameboard.tiles.length; ++y) {
      for (let x = 0; x < this.ownGameboard.tiles[0].length; ++x) {
        if (this.doesShipFit(y, x, ship.length, direction)) {
          possibleSpots.push([y, x]);
        }
      }
    }
    return possibleSpots;
  }

  doesShipFit(y, x, length, dir) {
    let x_move = 0;
    let y_move = 0;
    if (dir === "horizontal") {
      x_move = 1;
    } else {
      y_move = 1;
    }

    let yCopy = y;
    let xCopy = x;
    for (let i = 0; i < length; ++i) {
      if (!this.isFreeTile(yCopy, xCopy)) {
        return false;
      }
      yCopy += y_move;
      xCopy += x_move;
    }
    return true;
  }
  isFreeTile(y, x) {
    const neighboringIndices = [
      [0, 0],
      [0, 1],
      [0, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
      [1, 0],
      [-1, 0],
    ];

    if (
      y >= this.ownGameboard.tiles.length ||
      x >= this.ownGameboard.tiles[0].length
    )
      return false;
    for (const [y_offset, x_offset] of neighboringIndices) {
      if (
        y + y_offset !== -1 &&
        y + y_offset < this.ownGameboard.tiles.length &&
        x + x_offset !== -1 &&
        x + x_offset < this.ownGameboard.tiles[0].length
      ) {
        const curTile = this.ownGameboard.tiles[y + y_offset][x + x_offset];
        if (curTile.ship) return false;
      }
    }

    return true;
  }
}
