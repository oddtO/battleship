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

  generateShips() {
    const shipSizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
    for (const shipSize of shipSizes) {
      this.placeShipRandomly(new Ship(shipSize));
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

  static doesShipFit(gameboard, y, x, length, dir) {
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
      if (!Player.isFreeTile(gameboard, yCopy, xCopy)) {
        return false;
      }
      yCopy += y_move;
      xCopy += x_move;
    }
    return true;
  }
  static isFreeTile(gameboard, y, x) {
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

    if (y >= gameboard.tiles.length || x >= gameboard.tiles[0].length)
      return false;
    for (const [y_offset, x_offset] of neighboringIndices) {
      if (
        y + y_offset !== -1 &&
        y + y_offset < gameboard.tiles.length &&
        x + x_offset !== -1 &&
        x + x_offset < gameboard.tiles[0].length
      ) {
        const curTile = gameboard.tiles[y + y_offset][x + x_offset];
        if (curTile.ship) return false;
      }
    }

    return true;
  }
}
