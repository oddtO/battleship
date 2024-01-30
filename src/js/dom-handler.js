export class DOMHandler {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.htmlGameboardSymbol = Symbol("html-gameboard");
    this.enemyPlayerSymbol = Symbol("enemy-player");
    this.resetBtn = document.querySelector("button.reset");
    this.resetBtn.onclick = DOMHandler.#sendResetEvent;
    this.popupList = document.querySelector(".popup-list");
    this.customGameBtn = document.querySelector("button.custom-game");

    this.customGameBtn.onclick = this.#showCustomGameMenu.bind(this);

    this.calcelCustomGameMenuBtn = document.querySelector(
      "input[type='button'].cancel",
    );
    this.customGameFormBtn = document.querySelector(".popup > form");
    this.calcelCustomGameMenuBtn.onclick = this.#hideCustomGameMenu.bind(this);
    this.customGameFormBtn.onsubmit = this.#initCustomGame.bind(this);
    this.name1Elem = document.querySelector("#name1");
    this.name2Elem = document.querySelector("#name2");
    this.isAI1Elem = document.querySelector("[name='isAIp1']:checked");
    this.isAI2Elem = document.querySelector("[name='isAIp2']:checked");
    this.nextPlayerNameElem = document.querySelector(".pass-device .out1");
    this.passDeviceOkBtn = document.querySelector(".pass-device .button-popup");

    this.chgDirBtn = document.querySelector(".turn-dir");
    this.shipWrapper = document.querySelector(".ship-wrapper");
    this.#rotateShip.callCount = 0;
    this.chgDirBtn.onclick = this.#rotateShip.bind(this);
    this.shipWrapper.onclick = this.#dragShip.bind(this);
    this.passDeviceOkBtn.addEventListener(
      "click",
      this.hidePassDeviceScreen.bind(this),
    );

    this.player1[this.enemyPlayerSymbol] = this.player2;
    this.player2[this.enemyPlayerSymbol] = this.player1;
    this.player1[this.htmlGameboardSymbol] = document.querySelector(".player1");
    this.player2[this.htmlGameboardSymbol] = document.querySelector(".player2");
  }

  #rotateShip() {
    this.shipWrapper.style.setProperty(
      "--vertical-or-horizontal",
      `var(--${++this.#rotateShip.callCount % 2 ? "vertical" : "horizontal"})`,
    );
  }

  #dragShip(event) {
    const target = event.target;

    if (!target.matches(".ship-tile")) return;

    const curTarget = event.currentTarget;
    const wrapperBox = curTarget.getBoundingClientRect();
    const firstTileBox = curTarget.firstElementChild.getBoundingClientRect();

    const offsetTop = firstTileBox.top - wrapperBox.top;
    const offsetLeft = firstTileBox.left - wrapperBox.left;
    const draggedShip = curTarget.cloneNode(true);
    draggedShip.style.position = "absolute";
    draggedShip.style.zIndex = "9999";

    document.body.append(draggedShip);
    moveAt(event.clientY, event.clientX);
    // const firstTile = draggedShip.firstElementChild;
    document.onpointermove = (event) => moveAt(event.clientY, event.clientX);

    function moveAt(clientY, clientX) {
      draggedShip.style.top = clientY - offsetTop + "px";
      draggedShip.style.left = clientX - offsetLeft + "px";
    }
  }
  init() {
    console.log("init");
    this.#createTiles(this.player1);
    this.#createTiles(this.player2);
  }

  showPassDeviceScreen(nextPlayerName) {
    this.popupList.classList.add("shown");
    this.popupList.classList.add("pass-device");
    this.nextPlayerNameElem.textContent = nextPlayerName;
  }

  hidePassDeviceScreen() {
    this.popupList.classList.remove("shown");
    this.popupList.classList.remove("pass-device");
  }
  #initCustomGame(event) {
    event.preventDefault();
    const name1 = this.name1Elem.value;
    const name2 = this.name2Elem.value;
    const isAI1 =
      document.querySelector("[name='isAIp1']:checked")?.value === "true"
        ? true
        : false;
    const isAI2 =
      document.querySelector("[name='isAIp2']:checked")?.value === "true"
        ? true
        : false;

    document.body.dispatchEvent(
      new CustomEvent("custom-game", {
        detail: { name1, name2, isAI1, isAI2 },
      }),
    );
    this.#hideCustomGameMenu();
    this.rejectPrevGame();
  }
  #showCustomGameMenu() {
    this.popupList.classList.add("shown");
    this.popupList.classList.add("custom-game");
    this.popupList.classList.remove("pass-device");
  }
  #hideCustomGameMenu() {
    this.popupList.classList.remove("shown");
    this.popupList.classList.remove("custom-game");
    // this.popupList.classList.remove("pass-device");
  }
  static #sendResetEvent() {
    const resetEvent = new CustomEvent("game-reset");
    document.body.dispatchEvent(resetEvent);
  }
  #createTiles(player) {
    player[this.htmlGameboardSymbol].innerHTML = "";
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
        // player.ownGameboard.getTileAt(y, x)[this.htmlTileSymbol] = tile;
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

  renderPlayer(activePlayer, waitingPlayer) {
    const activePlayerGameboardHTML = activePlayer[this.htmlGameboardSymbol];
    const waitingPlayerGameboardHTML = waitingPlayer[this.htmlGameboardSymbol];

    if (!(activePlayer.isAI || waitingPlayer.isAI))
      this.showPassDeviceScreen(activePlayer.name);

    for (let y = 0; y < activePlayer.ownGameboard.tiles.length; ++y) {
      for (let x = 0; x < activePlayer.ownGameboard.tiles[0].length; ++x) {
        const tile = activePlayer.ownGameboard.getTileAt(y, x);
        const tileHTML =
          activePlayerGameboardHTML.children[y + 1].children[x + 1];
        if (tile.ship) tileHTML.classList.add("ship");
        if (tile.isHit) {
          tileHTML.classList.add("hit");
        }

        const enemyTile = activePlayer.enemyGameboard.getTileAt(y, x);
        const enemyTileHTML =
          waitingPlayerGameboardHTML.children[y + 1].children[x + 1];

        if (enemyTile.isHit) {
          enemyTileHTML.classList.add("hit");

          if (enemyTile.ship) enemyTileHTML.classList.add("ship");
        } else {
          enemyTileHTML.classList.remove("ship");
        }
      }
    }
  }
  askInput(player) {
    const enemyPlayer = player[this.enemyPlayerSymbol];
    return new Promise((resolve, reject) => {
      this.rejectPrevGame = reject;
      const resolveInput = (event) => {
        const target = event.target;
        if (target.matches(".tile")) {
          enemyPlayer[this.htmlGameboardSymbol].removeEventListener(
            "click",
            resolveInput,
          );
          resolve([+target.dataset.y, +target.dataset.x]);
        }
      };

      enemyPlayer[this.htmlGameboardSymbol].addEventListener(
        "click",
        resolveInput,
      );
    });
  }

  sendInput(player, y, x) {
    const enemyPlayer = player[this.enemyPlayerSymbol];

    const tileToClick = enemyPlayer[this.htmlGameboardSymbol].querySelector(
      `[data-y="${y}"][data-x="${x}"]`,
    );
    tileToClick.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  }
}
