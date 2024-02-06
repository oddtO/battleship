export class DOMHandler {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
    this.abortController = new AbortController();
    this.htmlGameboardSymbol = Symbol("html-gameboard");
    this.enemyPlayerSymbol = Symbol("enemy-player");
    this.htmlToPlayerSymbol = Symbol("html-to-player");
    this.resetBtn = document.querySelector("button.reset");
    this.resetBtn.onclick = this.#sendResetEvent.bind(this);
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
    this.ship = document.querySelector(".ship-select-wrapper .ship");
    this.shipSelect = document.querySelector(".ship-select-wrapper");
    this.shuffleBtn = document.querySelector('button[value="shuffle"]');

    this.instructionPlayerNamePlaceholder = document.querySelector(
      ".instruction > .out1",
    );

    this.gameOverRestartBtn = document.querySelector(
      '.game-over-screen [data-function="restart"]',
    );
    this.gameOverRestartBtn.onclick = this.#sendResetEvent.bind(this);

    this.hideGameOverScreenBtn = document.querySelector(
      '.game-over-screen [data-function="hide"]',
    );
    this.hideGameOverScreenBtn.onclick = this.hideGameOverScreen.bind(this);
    this.winningPlayerNameSpan = document.querySelector(
      ".game-over-screen .out1",
    );
    this.shuffleBtn.onclick = this.#randomPlacementDispatcher;

    this.shipWrapper = document.querySelector(".ship-wrapper");
    this.shipSelectCounter = document.querySelector(
      ".ship-select-wrapper .counter",
    );
    this.#rotateShip.callCount = 0;
    this.chgDirBtn.onclick = this.#rotateShip.bind(this);
    this.ship.onclick = this.#dragShip.bind(this);
    this.ship.ondragstart = () => false;
    this.passDeviceOkBtn.onclick = this.hidePassDeviceScreen.bind(this);

    this.player1[this.enemyPlayerSymbol] = this.player2;
    this.player2[this.enemyPlayerSymbol] = this.player1;
    const gameboards = document.querySelector(".gameboards");
    gameboards.innerHTML = "";

    const player1Div = document.createElement("div");
    player1Div.className = "player1";
    const player2Div = document.createElement("div");
    player2Div.className = "player2";
    gameboards.append(player1Div, player2Div);

    this.player1[this.htmlGameboardSymbol] = player1Div;
    this.player2[this.htmlGameboardSymbol] = player2Div;
    this.player1[this.htmlGameboardSymbol][this.htmlToPlayerSymbol] =
      this.player1;
    this.player2[this.htmlGameboardSymbol][this.htmlToPlayerSymbol] =
      this.player2;
    /* this.player1[this.htmlGameboardSymbol].style.removeProperty("display");
    this.player2[this.htmlGameboardSymbol].style.removeProperty("display"); */
  }

  showGameOverScreen(winningPlayer) {
    this.renderPlayer(winningPlayer);
    this.popupList.classList.add("shown");
    this.popupList.classList.add("game-over-screen");

    this.winningPlayerNameSpan.textContent = winningPlayer.name;

    return new Promise((resolve) => {
      this.abortController.signal.onabort = () => {
        this.hideGameOverScreen();
        resolve();
      };
    });
  }

  hideGameOverScreen() {
    this.popupList.classList.remove("shown");
    this.popupList.classList.remove("game-over-screen");
  }
  #randomPlacementDispatcher() {
    document.dispatchEvent(new CustomEvent("random-placement"));
  }
  enterShipSelectMode(player) {
    this.instructionPlayerNamePlaceholder.textContent = player.name;
    const enemyPlayerGameboard =
      player[this.enemyPlayerSymbol][this.htmlGameboardSymbol];

    this.curPlayerGameboard = player[this.htmlGameboardSymbol];

    this.curPlayerGameboard.style.pointerEvents = "none";

    enemyPlayerGameboard.style.setProperty("display", "none");
    this.shipSelect.style.removeProperty("display");
  }

  leaveShipSelectMode(player) {
    const playerGameboard = player[this.htmlGameboardSymbol];
    playerGameboard.style.removeProperty("display");
    playerGameboard.style.removeProperty("pointer-events");

    this.shipSelect.style.setProperty("display", "none");
  }
  renderAskShipPlacementCoords(shipLength, lengthCount) {
    this.ship.innerHTML = "";
    for (let i = 0; i < shipLength; ++i) {
      const div = document.createElement("div");
      div.className = "ship-tile";
      this.ship.append(div);
    }
    this.shipSelectCounter.textContent = lengthCount;
  }
  #rotateShip() {
    this.ship.dataset.direction =
      this.ship.dataset.direction == "horizontal" ? "vertical" : "horizontal";
  }

  #initDragShip(event) {
    const target = event.target;

    if (!target.matches(".ship > .ship-tile")) return;
    document.onpointerdown = this.#dragShip.bind(this);
  }
  #dragShip(event) {
    const curTarget = this.ship;

    this.curPlayerGameboard.style.removeProperty("pointer-events");
    const draggedShip = curTarget;
    draggedShip.style.position = "absolute";
    draggedShip.style.zIndex = "9999";
    draggedShip.style.pointerEvents = "none";
    draggedShip.style.animationPlayState = "paused";

    this.draggedShipDir = this.ship.dataset.direction;
    document.body.append(draggedShip);
    moveAt(event.clientY, event.clientX);
    // const firstTile = draggedShip.firstElementChild;
    document.onpointermove = onMouseMove.bind(this);
    document.onpointerup = this.#leaveShip.bind(this);

    function onMouseMove(event) {
      const elemBelow = document.elementFromPoint(event.clientX, event.clientY);

      if (!elemBelow) return;
      // draggedShip.hidden = false;

      moveAt(event.clientY, event.clientX);
      const tile = elemBelow.closest(".tile");
      if (!tile) {
        this.highlightedTile?.classList.remove("can-place-here");
        this.highlightedTile?.classList.remove("forbidden-place");

        this.highlightedTile = null;
        return;
      }

      const gameboardHTML = tile.closest("[class^='player']");
      if (!gameboardHTML) return;

      const player = gameboardHTML[this.htmlToPlayerSymbol];

      if (this.highlightedTile !== tile) {
        this.highlightedTile?.classList.remove("can-place-here");
        this.highlightedTile?.classList.remove("forbidden-place");

        this.highlightedTile = tile;
        if (
          player.doesShipFit(
            +tile.dataset.y,
            +tile.dataset.x,
            draggedShip.children.length,
            this.draggedShipDir,
          )
        ) {
          this.canPlace = true;
          tile.classList.add("can-place-here");
        } else {
          this.canPlace = false;
          tile.classList.add("forbidden-place");
        }
      }
    }
    function moveAt(clientY, clientX) {
      draggedShip.style.top = clientY + "px";
      draggedShip.style.left = clientX + "px";
    }
  }
  #leaveShip(event) {
    document.onpointermove = null;
    document.onpointerup = null;
    this.highlightedTile?.classList.remove("can-place-here");
    this.highlightedTile?.classList.remove("forbidden-place");
    this.ship.style.removeProperty("position");
    this.ship.style.removeProperty("top");
    this.ship.style.removeProperty("left");
    this.ship.style.removeProperty("pointer-events");
    this.ship.style.removeProperty("animation-play-state");
    this.shipWrapper.append(this.ship);

    const elemBelow = document.elementFromPoint(event.clientX, event.clientY);
    this.curPlayerGameboard.style.pointerEvents = "none";
    if (!elemBelow) return;
    const tile = elemBelow.closest(".tile");

    if (!tile) return;

    if (!this.canPlace) return;
    document.dispatchEvent(
      new CustomEvent("ship-placement", {
        detail: {
          y: +tile.dataset.y,
          x: +tile.dataset.x,
          direction: this.draggedShipDir,
        },
      }),
    );
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
    if (this.rejectPrevGame) {
      this.rejectPrevGame();
    }
  }
  #showCustomGameMenu() {
    this.popupList.classList.add("shown");
    this.popupList.classList.add("custom-game");
    this.popupList.classList.remove("pass-device");
    this.popupList.classList.remove("game-over-screen");
  }
  #hideCustomGameMenu() {
    this.popupList.classList.remove("shown");
    this.popupList.classList.remove("custom-game");
    // this.popupList.classList.remove("pass-device");
  }
  #sendResetEvent() {
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

  renderPlayer(activePlayer) {
    const waitingPlayer = activePlayer[this.enemyPlayerSymbol];

    const syms = Object.getOwnPropertySymbols(activePlayer);

    console.log(syms[0] == this.enemyPlayerSymbol);
    const activePlayerGameboardHTML = activePlayer[this.htmlGameboardSymbol];
    const waitingPlayerGameboardHTML = waitingPlayer[this.htmlGameboardSymbol];

    /* if (!(activePlayer.isAI || waitingPlayer.isAI))
      this.showPassDeviceScreen(activePlayer.name); */

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
    console.log("asking input");
    return new Promise((resolve, reject) => {
      this.abortController.signal.onabort = () => reject();
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
