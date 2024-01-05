import { Ship } from "../ship";
import { Gameboard } from "../gameboard";

describe("gameboard class ship placement", () => {
  const x = 3;
  const y = 3;
  const x2 = 3;
  const y2 = 5;
  const shipLength = 4;
  const ship = new Ship(shipLength);
  const ship2 = new Ship(shipLength);
  const gameboard = new Gameboard();
  gameboard.placeShip(ship, y, x, "horizontal");
  gameboard.placeShip(ship2, y2, x2, "vertical");

  test("ship can be placed vertically or horizontally and seen specific coords", () => {
    for (let i = 0; i < shipLength; ++i) {
      expect(gameboard.getTileAt(y, x + i).ship).toBe(ship);
      expect(gameboard.getTileAt(y2 + i, x2).ship).toBe(ship2);
    }
  });
  test("coords with no ship return null", () => {
    expect(gameboard.getTileAt(y, x + shipLength).ship).toBeNull();
    /* expect(gameboard.getTileAt(y + 1, x).ship).toBeNull();
    expect(gameboard.getTileAt(y - 1, x).ship).toBeNull(); */
  });

  test("receive attack returns true when a ship is hit", () => {
    expect(gameboard.receiveAttack(y, x)).toBeTruthy();
    expect(gameboard.receiveAttack(y + 1, x)).toBeFalsy();
  });
  test("gameboard can track whether a tile has been hit", () => {
    expect(gameboard.getTileAt(y, x).isHit).toBeTruthy();
    expect(gameboard.getTileAt(y + 1, x).isHit).toBeTruthy();
    expect(gameboard.getTileAt(y + 2, x).isHit).toBeFalsy();
    expect(gameboard.getTileAt(y, x + 1).isHit).toBeFalsy();
  });

  test("gameboards tracking if all ships are destroyed", () => {
    for (let i = 1; i < shipLength; ++i) {
      gameboard.receiveAttack(y, x + i);
    }
    expect(gameboard.areAllShipDestroyed()).toBeFalsy();
    for (let i = 0; i < shipLength; ++i) {
      gameboard.receiveAttack(y2 + i, x2);
    }

    console.log(gameboard.tiles);
    expect(gameboard.areAllShipDestroyed()).toBeTruthy();
  });
});
