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
  gameboard.placeShip(ship, x, y, "horizontal");
  gameboard.placeShip(ship2, x2, y2, "vertical");

  test("ship can be placed vertically or horizontally and seen specific coords", () => {
    for (let i = 0; i < shipLength; ++i) {
      expect(gameboard.getTileAt(x + i, y).ship).toBe(ship);
      expect(gameboard.getTileAt(x2, y2 + i).ship).toBe(ship2);
    }
  });
  test("coords with no ship return null", () => {
    expect(gameboard.getTileAt(x + shipLength, y).ship).toBeNull();
    expect(gameboard.getTileAt(x, y + 1).ship).toBeNull();
    expect(gameboard.getTileAt(x, y - 1).ship).toBeNull();
  });

  test("receive attack returns true when a ship is hit", () => {
    expect(gameboard.receiveAttack(x, y)).toBeTruthy();
    expect(gameboard.receiveAttack(x, y + 1)).toBeFalsy();
  });
  test("gameboard can track whether a tile has been hit", () => {
    expect(gameboard.getTileAt(x, y).isHit).toBeTruthy();
    expect(gameboard.getTileAt(x, y + 1).isHit).toBeTruthy();
    expect(gameboard.getTileAt(x, y + 2).isHit).toBeFalsy();
    expect(gameboard.getTileAt(x + 1, y).isHit).toBeFalsy();
  });

  test("gameboards tracking if all ships are destroyed", () => {
    for (let i = 1; i < shipLength; ++i) {
      gameboard.receiveAttack(x + i, y);
    }
    expect(gameboard.areAllShipDestroyed()).toBeFalsy();
    for (let i = 0; i < shipLength; ++i) {
      gameboard.receiveAttack(x2, y2 + i);
    }

    console.log(gameboard.tiles);
    expect(gameboard.areAllShipDestroyed()).toBeTruthy();
  });
});
