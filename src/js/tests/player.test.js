import { Ship } from "../ship.js";
import { Gameboard } from "../gameboard";
import { Player } from "../player.js";

describe("ship placement on small gameboards", () => {
  let gameboard1;
  let gameboard2;
  let player1;
  let player2;

  beforeEach(() => {
    gameboard1 = new Gameboard(2);
    gameboard2 = new Gameboard(2);
    player1 = new Player(gameboard1, gameboard2, true);

    player2 = new Player(gameboard2, gameboard1, true);
  });

  test("placement opportunities for ship of size 1 on empty gameboard", () => {
    const ship_s1 = new Ship(1);
    expect(player1.getShipPlacementOpportunities(ship_s1)).toHaveLength(4);
  });

  test("placement opportunities for ship of size 1 on empty gameboard", () => {
    const ship_s1 = new Ship(2);
    expect(player1.getShipPlacementOpportunities(ship_s1)).toHaveLength(2);
  });

  test("placement opportunities for ship of size 1 on empty gameboard", () => {
    const ship_s1 = new Ship(2);
    expect(
      player1.getShipPlacementOpportunities(ship_s1, "vertical"),
    ).toHaveLength(2);
  });

  test("zero placement opportunities", () => {
    const ship_s1 = new Ship(1);
    gameboard1.placeShip(ship_s1, 0, 0);
    expect(player1.getShipPlacementOpportunities(ship_s1)).toHaveLength(0);
  });
});

describe("legal random ship placement", () => {
  let gameboard1;
  let gameboard2;
  let player1;
  let player2;

  beforeEach(() => {
    gameboard1 = new Gameboard();
    gameboard2 = new Gameboard();
    player1 = new Player(gameboard1, gameboard2, true);

    player2 = new Player(gameboard2, gameboard1, true);
  });

  test("placement opportunities for ship of size 1 on empty gameboard", () => {
    const ship_s1 = new Ship(1);
    expect(player1.getShipPlacementOpportunities(ship_s1)).toHaveLength(100);
  });
  test("placement opportunities for ship of size 4 on empty gameboard", () => {
    const ship_s1 = new Ship(4);
    expect(player1.getShipPlacementOpportunities(ship_s1)).toHaveLength(70);
  });
  test("VERTICAL placement opportunities for ship of size 4 on empty gameboard", () => {
    const ship_s1 = new Ship(4);
    expect(
      player1.getShipPlacementOpportunities(ship_s1, "vertical"),
    ).toHaveLength(70);
  });
  test("VERTICAL placement opportunities for ship of size 4 if one is already placed", () => {
    const ship_s1 = new Ship(4);
    gameboard1.placeShip(ship_s1, 0, 0);
    expect(
      player1.getShipPlacementOpportunities(ship_s1, "vertical"),
    ).toHaveLength(60);
  });
  test("corner placement ship size 1", () => {
    const ship_s1 = new Ship(1);
    gameboard1.placeShip(ship_s1, 0, 0);
    expect(player1.getShipPlacementOpportunities(ship_s1)).toHaveLength(96);
  });
  test("corner placement ship size 4", () => {
    const ship_s1 = new Ship(4);
    gameboard1.placeShip(ship_s1, 0, 0);
    expect(player1.getShipPlacementOpportunities(ship_s1)).toHaveLength(60);
  });
  test("opportunities for ship of size 1 on gameboard with ship of size 1 in the middle", () => {
    const ship_s1 = new Ship(1);
    gameboard1.placeShip(ship_s1, 5, 5);
    expect(player1.getShipPlacementOpportunities(ship_s1)).toHaveLength(91);
  });
  test("placement opportunities for ship of size 1 on gameboard with ship of size 2 in the middle", () => {
    const ship_s1 = new Ship(1);
    const ship_s2 = new Ship(2);
    gameboard1.placeShip(ship_s2, 5, 5, "horizontal");
    expect(player1.getShipPlacementOpportunities(ship_s1)).toHaveLength(88);
  });
  test("random ship placement on empty gameboard", () => {
    const spy = jest.spyOn(Math, "random");

    spy.mockReturnValue(0.0);

    const ship_s1 = new Ship(1);
    player1.placeShipRandomly(new Ship(4));
    expect(
      player1.getShipPlacementOpportunities(ship_s1).length,
    ).toBeGreaterThanOrEqual(82);
    expect(
      player1.getShipPlacementOpportunities(ship_s1).length,
    ).toBeLessThanOrEqual(90);
  });
});
