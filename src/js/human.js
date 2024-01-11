import { Renderer } from "./page-renderer";
export class Human {
  async makeMove() {
    const [y, x] = await Renderer.askInput(this);

    this.enemyGameboard.receiveAttack(y, x);
  }
}
