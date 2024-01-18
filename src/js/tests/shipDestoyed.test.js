import { Ship } from "../ship";
import { Gameboard } from "../gameboard";
const x = 3;
const y = 3;
const x2 = 3;
const y2 = 5;
const shipLength = 4;
const ship = new Ship(shipLength);
const ship2 = new Ship(shipLength);
const gameboard = new Gameboard(10);

gameboard.placeShip(ship, y, x, "horizontal");
gameboard.placeShip(ship2, y2, x2, "vertical");
test("when ship is destroyed, all its neighboring tiles count as being hit", () => {
  for (let i = 0; i < shipLength; ++i) {
    gameboard.receiveAttack(y, x + i);
  }
  const offsets = [
    [1, 1],
    [-1, 1],
    [-1, -1],
    [1, -1],
    [0, 1],
    [-1, 0],
    [0, -1],
    [1, 0],
  ];

  expect(gameboard.ships[0].isSunk()).toBeTruthy();
  for (let i = 0; i < shipLength; ++i) {
    for (const [yOffset, xOffset] of offsets) {
      expect(
        gameboard.getTileAt(y + yOffset, x + i + xOffset).isHit,
      ).toBeTruthy();
    }
  }
  console.log(gameboard);
});
