export class Renderer {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    const htmlGameboardSymbol = Symbol("html-gameboard");
    this.htmlGameboardSymbol = htmlGameboardSymbol;
    this.player1[this.htmlGameboardSymbol] = document.querySelector(".player1");
    this.player2[this.htmlGameboardSymbol] = document.querySelector(".player2");
  }

  init() {
    console.log("init");
    this.#createTiles(this.player1);
    this.#createTiles(this.player2);
  }
  #createTiles(player) {
    for (let y = 0; y < player.ownGameboard.tiles.length; ++y) {
      const row = document.createElement("div");
      const numTile = document.createElement("div");

      numTile.textContent = y + 1;
      numTile.className = "number";
      row.append(numTile);
      row.className = "row";
      for (let x = 0; x < player.ownGameboard.tiles[0].length; ++x) {
        const tile = document.createElement("div");
        tile.dataset.y = y;
        tile.dataset.x = x;
        tile.classList.add("ship");
        tile.classList.add("hit");
        row.append(tile);
      }
      player[this.htmlGameboardSymbol].append(row);
    }
  }
}
