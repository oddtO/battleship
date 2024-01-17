import { DOMHandler } from "./dom-handler";
export class Human {
  async makeMove() {
    const [y, x] = await DOMHandler.askInput(this);

    this.enemyGameboard.receiveAttack(y, x);
  }
}
