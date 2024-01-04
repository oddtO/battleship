import { Queue } from "./queue";

export class Player {
  constructor(ownGameboard, enemyGameboard, isAI = false) {
    if (isAI) this.placeShips = AI.prototype.placeShips;
    else this.placeShips = Human.prototype.placeShips;

    this.ownGameboard = ownGameboard;
    this.enemyGameboard = enemyGameboard;
  }

  getShipPlacementOpportunities(ship, direction = "horizontal") {
    let x_move = 0;
    let y_move = 0;
    if (direction === "horizontal") {
      x_move = 1;
    } else {
      y_move = 1;
    }

    const possibleSpots = [];
    for (let y = 0; y < this.ownGameboard.tiles.length; ++y) {
      coordTest: for (let x = 0; x < this.ownGameboard.tiles[0].length; ++x) {
        let yCopy = y;
        let xCopy = x;
        for (let i = 0; i < ship.length; ++i) {
          if (!this.isFreeTile(yCopy, xCopy)) {
            continue coordTest;
          }
          yCopy += y_move;
          xCopy += x_move;
        }

        possibleSpots.push([y, x]);
      }
    }
    return possibleSpots;
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

class Human {}
class AI {
  placeShips() {}
}

console.log(1);
console.log(1);
