import { Ship } from "../ship.js";

describe("ship class", () => {
  const bigShipLength = 4;

  test("ship is alive when hits are fewer than length", () => {
    const ship = new Ship(bigShipLength);

    ship.hit();

    expect(ship.isSunk()).toBeFalsy();
  });
  test("ship is destroyed when hits are equal or exceed length than length", () => {
    const ship = new Ship(bigShipLength);

    for (let i = 0; i < bigShipLength; ++i) ship.hit();

    expect(ship.isSunk()).toBeTruthy();
  });
});
