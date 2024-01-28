import { RandomNum } from "./random";
export class AI {
  getAttackOpportunities() {
    let coordsPossibleForAttack = [];

    const possibleShipOffsets = [
      [0, 1],
      [-1, 0],
      [0, -1],
      [1, 0],
    ];

    const shipAtTopOffset = [[-1, 0]];
    const shipAtBottomOffset = [[1, 0]];
    const shipAtRightOffset = [[0, 1]];
    const shipAtLeftOffset = [[0, -1]];
    const prevHitShips = this.enemyGameboard.prevHitShips;

    if (prevHitShips.length) {
      if (prevHitShips.length == 1) {
        const [y, x] = prevHitShips[0];
        coordsPossibleForAttack = this.enemyGameboard
          .detectNeighboringLegalCoords(y, x, possibleShipOffsets)
          .filter(([y, x]) => !this.enemyGameboard.getTileAt(y, x).isHit);
      } else {
        const [yStart, xStart] = prevHitShips[0];
        const [yEnd, xEnd] = prevHitShips.at(-1);

        let startShipOffset;
        let endShipOffset;
        if (this.enemyGameboard.hitDirection == "vertical") {
          startShipOffset = shipAtTopOffset;
          endShipOffset = shipAtBottomOffset;
        } else if (this.enemyGameboard.hitDirection == "horizontal") {
          startShipOffset = shipAtLeftOffset;
          endShipOffset = shipAtRightOffset;
        } else {
          throw new Error("hit direction is not supposed to be random");
        }
        const [yBeforeStart, xBeforeStart] =
          this.enemyGameboard.detectNeighboringLegalCoords(
            yStart,
            xStart,
            startShipOffset,
          )[0] || [null, null];

        if (
          Number.isInteger(yBeforeStart) &&
          Number.isInteger(xBeforeStart) &&
          !this.enemyGameboard.getTileAt(yBeforeStart, xBeforeStart).isHit
        )
          coordsPossibleForAttack.push([yBeforeStart, xBeforeStart]);
        const [yAfterEnd, xAfterEnd] =
          this.enemyGameboard.detectNeighboringLegalCoords(
            yEnd,
            xEnd,
            endShipOffset,
          )[0] || [null, null];
        if (
          Number.isInteger(yAfterEnd) &&
          Number.isInteger(xAfterEnd) &&
          !this.enemyGameboard.getTileAt(yAfterEnd, xAfterEnd).isHit
        )
          coordsPossibleForAttack.push([yAfterEnd, xAfterEnd]);
      }

      return coordsPossibleForAttack;
    }

    for (let y = 0; y < this.enemyGameboard.tiles.length; ++y) {
      for (let x = 0; x < this.enemyGameboard.tiles[0].length; ++x) {
        if (!this.enemyGameboard.getTileAt(y, x).isHit)
          coordsPossibleForAttack.push([y, x]);
      }
    }

    return coordsPossibleForAttack;
  }

  getRandomCoords() {
    const opportunities = this.getAttackOpportunities();
    const coords = opportunities[RandomNum(0, opportunities.length)];
    return coords;
  }
  /* attackRandomly() {
    const opportunities = this.getAttackOpportunities();
    const [yAttack, xAttack] =
      opportunities[RandomNum(0, opportunities.length)];

    this.enemyGameboard.receiveAttack(yAttack, xAttack);
  } */
}
