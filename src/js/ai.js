import { RandomNum } from "./random";
export class AI {
  getAttackOpportunities() {
    const coordsPossibleForAttack = [];
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
