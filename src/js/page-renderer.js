export class Renderer {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.gameboardHTML1 = document.querySelector(".player1");
    this.gameboardHTML2 = document.querySelector(".player2");
  }

  init() {
    console.log("init");
    this.#createTiles(this.player1, this.gameboardHTML1);
    this.#createTiles(this.player2, this.gameboardHTML2);
  }
  #createTiles(player, gameboardHTML) {
    for (let y = 0; y < player.ownGameboard.tiles.length; ++y) {
      const row = document.createElement("div");
      for (let x = 0; x < player.ownGameboard.tiles[0].length; ++x) {
        row.append(document.createElement("div"));
        row.dataset.y = y;
        row.dataset.x = x;
      }
      gameboardHTML.append(row);
    }
  }
}
