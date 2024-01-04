export class Tile {
  isHit = false;
  #ship = null;
  get ship() {
    return this.#ship;
  }
  set ship(val) {
    if (!this.isFree) throw new Error("can't place near other ships");

    this.isFree = false;
    this.#ship = val;
  }
  isFree = true;
}
