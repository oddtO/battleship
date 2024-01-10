export class Renderer {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    const htmlGameboardSymbol = Symbol("html-gameboard");
    this.htmlGameboardSymbol = htmlGameboardSymbol;
    this.htmlTileSymbol = Symbol("html-tile");
    this.player1[this.htmlGameboardSymbol] = document.querySelector(".player1");
    this.player2[this.htmlGameboardSymbol] = document.querySelector(".player2");
  }

  init() {
    console.log("init");
    this.#createTiles(this.player1);
    this.#createTiles(this.player2);
  }
  #createTiles(player) {
    player[this.htmlGameboardSymbol].append(
      createLetters(player.ownGameboard.tiles.length),
    );
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
        tile.classList.add("tile");
        player.ownGameboard.getTileAt(y, x)[this.htmlTileSymbol] = tile;
        row.append(tile);
      }
      player[this.htmlGameboardSymbol].append(row);
    }
    function createLetters(length) {
      const START_LETTER = "A";

      const lettersRowDiv = document.createElement("div");
      lettersRowDiv.classList.add("row");
      lettersRowDiv.classList.add("letters");
      lettersRowDiv.append(document.createElement("div"));

      let curLetter = START_LETTER;

      String.fromCodePoint(curLetter.codePointAt(0) + 1);
      for (let i = 0; i < length; ++i, curLetter = getNextLetter(curLetter)) {
        lettersRowDiv.insertAdjacentHTML(
          "beforeend",
          `<div>${curLetter}</div>`,
        );
      }
      function getNextLetter(letter) {
        return String.fromCodePoint(letter.codePointAt(0) + 1);
      }
      return lettersRowDiv;
    }
  }
  render() {
    this.#renderPlayer(this.player1);
  }

  #renderPlayer(player) {
    for (let y = 0; y < player.ownGameboard.tiles.length; ++y) {
      for (let x = 0; x < player.ownGameboard.tiles[0].length; ++x) {
        const tile = player.ownGameboard.getTileAt(y, x);
        const tileHTML = tile[this.htmlTileSymbol];

        if (tile.ship) tileHTML.classList.add("ship");
        if (tile.hit) tileHTML.classList.add("hit");
      }
    }
  }
}