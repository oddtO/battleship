import { Player } from "../player";
import { Gameboard } from "../gameboard.js";

describe("ai", () => {
  let player1;
  let player2;
  let gameboard1;
  let gameboard2;
  beforeEach(() => {
    gameboard1 = new Gameboard(10);
    gameboard2 = new Gameboard(10);
    player1 = new Player(gameboard1, gameboard2, true);
    player2 = new Player(gameboard2, gameboard1, true);
  });
  test("filters out tiles legal for attack on empty board", () => {
    expect(player1.getAttackOpportunities()).toHaveLength(100);
  });
  test("filters out tiles legal for attack on a board with hit tiles", () => {
    player2.ownGameboard.getTileAt(2, 2).isHit = true;
    expect(player1.getAttackOpportunities()).toHaveLength(99);
  });
  test("filters out tiles legal for attack on a board with hit tiles", () => {
    player2.ownGameboard.getTileAt(2, 2).isHit = true;
    expect(player1.getAttackOpportunities()).toHaveLength(99);
  });
});
