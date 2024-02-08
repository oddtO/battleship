!function(){"use strict";var e,t,i,s,n={230:function(e,t,i){i.d(t,{l:function(){return d}});class s{constructor(e){this.length=e,this.hits=0}isSunk(){return this.hits>=this.length}hit(){++this.hits}}function n(e,t){const i=t-1;return Math.round(Math.random()*(i-e)+e)}class o{getAttackOpportunities(){let e=[];const t=[[0,1],[-1,0],[0,-1],[1,0]],i=[[-1,0]],s=[[1,0]],n=[[0,1]],o=[[0,-1]],r=this.enemyGameboard.prevHitShips;if(r.length){if(1==r.length){const[i,s]=r[0];e=this.enemyGameboard.detectNeighboringLegalCoords(i,s,t).filter((e=>{let[t,i]=e;return!this.enemyGameboard.getTileAt(t,i).isHit}))}else{const[t,a]=r[0],[l,h]=r.at(-1);let c,d;if("vertical"==this.enemyGameboard.hitDirection)c=i,d=s;else{if("horizontal"!=this.enemyGameboard.hitDirection)throw new Error("hit direction is not supposed to be random");c=o,d=n}const[m,p]=this.enemyGameboard.detectNeighboringLegalCoords(t,a,c)[0]||[null,null];Number.isInteger(m)&&Number.isInteger(p)&&!this.enemyGameboard.getTileAt(m,p).isHit&&e.push([m,p]);const[u,y]=this.enemyGameboard.detectNeighboringLegalCoords(l,h,d)[0]||[null,null];Number.isInteger(u)&&Number.isInteger(y)&&!this.enemyGameboard.getTileAt(u,y).isHit&&e.push([u,y])}return e}for(let t=0;t<this.enemyGameboard.tiles.length;++t)for(let i=0;i<this.enemyGameboard.tiles[0].length;++i)this.enemyGameboard.getTileAt(t,i).isHit||e.push([t,i]);return e}getRandomCoords(){const e=this.getAttackOpportunities();return e[n(0,e.length)]}}class r{constructor(e,t){let i=arguments.length>2&&void 0!==arguments[2]&&arguments[2],s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"unknown";i&&(this.getAttackOpportunities=o.prototype.getAttackOpportunities,this.getRandomCoords=o.prototype.getRandomCoords),this.name=s,this.isAI=i,this.ownGameboard=e,this.enemyGameboard=t}generateShips(e){for(const t of e){const[e,i]=t;for(let t=0;t<i;++t)this.placeShipRandomly(new s(e))}}placeShipRandomly(e){const t=["horizontal","vertical"],i=t[n(0,t.length)],s=this.getShipPlacementOpportunities(e,i),o=n(0,s.length);console.log("rand: ",o,"input: ",s.length);const[r,a]=s[o];this.ownGameboard.placeShip(e,r,a,i)}getShipPlacementOpportunities(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"horizontal";const i=[];for(let s=0;s<this.ownGameboard.tiles.length;++s)for(let n=0;n<this.ownGameboard.tiles[0].length;++n)this.doesShipFit(s,n,e.length,t)&&i.push([s,n]);return i}doesShipFit(e,t,i,s){let n=0,o=0;"horizontal"===s?n=1:o=1;let r=e,a=t;for(let e=0;e<i;++e){if(!this.isFreeTile(r,a))return!1;r+=o,a+=n}return!0}isFreeTile(e,t){const i=[[0,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1],[1,0],[-1,0]];if(e>=this.ownGameboard.tiles.length||t>=this.ownGameboard.tiles[0].length)return!1;for(const[s,n]of i)if(e+s!==-1&&e+s<this.ownGameboard.tiles.length&&t+n!==-1&&t+n<this.ownGameboard.tiles[0].length&&this.ownGameboard.tiles[e+s][t+n].ship)return!1;return!0}}class a{constructor(e,t){this.player1=e,this.player2=t,this.abortController=new AbortController,this.htmlGameboardSymbol=Symbol("html-gameboard"),this.enemyPlayerSymbol=Symbol("enemy-player"),this.htmlToPlayerSymbol=Symbol("html-to-player"),this.resetBtn=document.querySelector("button.reset"),this.resetBtn.onclick=this.#e.bind(this),this.popupList=document.querySelector(".popup-list"),this.customGameBtn=document.querySelector("button.custom-game"),this.customGameBtn.onclick=this.#t.bind(this),this.calcelCustomGameMenuBtn=document.querySelector("input[type='button'].cancel"),this.customGameFormBtn=document.querySelector(".popup > form"),this.calcelCustomGameMenuBtn.onclick=this.#i.bind(this),this.customGameFormBtn.onsubmit=this.#s.bind(this),this.name1Elem=document.querySelector("#name1"),this.name2Elem=document.querySelector("#name2"),this.isAI1Elem=document.querySelector("[name='isAIp1']:checked"),this.isAI2Elem=document.querySelector("[name='isAIp2']:checked"),this.nextPlayerNameElem=document.querySelector(".pass-device .out1"),this.passDeviceOkBtn=document.querySelector(".pass-device .button-popup"),this.chgDirBtn=document.querySelector(".turn-dir"),this.ship=document.querySelector(".ship-select-wrapper .ship"),this.shipSelect=document.querySelector(".ship-select-wrapper"),this.shuffleBtn=document.querySelector('button[value="shuffle"]'),this.instructionPlayerNamePlaceholder=document.querySelector(".instruction > .out1"),this.gameOverRestartBtn=document.querySelector('.game-over-screen [data-function="restart"]'),this.gameOverRestartBtn.onclick=this.#e.bind(this),this.hideGameOverScreenBtn=document.querySelector('.game-over-screen [data-function="hide"]'),this.hideGameOverScreenBtn.onclick=this.hideGameOverScreen.bind(this),this.winningPlayerNameSpan=document.querySelector(".game-over-screen .out1"),this.shuffleBtn.onclick=this.#n,this.shipWrapper=document.querySelector(".ship-wrapper"),this.shipSelectCounter=document.querySelector(".ship-select-wrapper .counter"),this.#o.callCount=0,this.chgDirBtn.onclick=this.#o.bind(this),this.ship.onclick=this.#r.bind(this),this.ship.ondragstart=()=>!1,this.passDeviceOkBtn.onclick=this.hidePassDeviceScreen.bind(this),this.player1[this.enemyPlayerSymbol]=this.player2,this.player2[this.enemyPlayerSymbol]=this.player1;const i=document.querySelector(".gameboards");i.innerHTML="";const s=document.createElement("div");s.className="player1";const n=document.createElement("div");n.className="player2",i.append(s,n),this.player1[this.htmlGameboardSymbol]=s,this.player2[this.htmlGameboardSymbol]=n,this.player1[this.htmlGameboardSymbol][this.htmlToPlayerSymbol]=this.player1,this.player2[this.htmlGameboardSymbol][this.htmlToPlayerSymbol]=this.player2}showGameOverScreen(e){return this.renderPlayer(e),this.popupList.classList.add("shown"),this.popupList.classList.add("game-over-screen"),this.winningPlayerNameSpan.textContent=e.name,new Promise((e=>{this.abortController.signal.onabort=()=>{this.hideGameOverScreen(),e()}}))}hideGameOverScreen(){this.popupList.classList.remove("shown"),this.popupList.classList.remove("game-over-screen")}#n(){document.dispatchEvent(new CustomEvent("random-placement"))}enterShipSelectMode(e){this.instructionPlayerNamePlaceholder.textContent=e.name;const t=e[this.enemyPlayerSymbol][this.htmlGameboardSymbol];this.curPlayerGameboard=e[this.htmlGameboardSymbol],this.curPlayerGameboard.style.pointerEvents="none",t.style.setProperty("display","none"),this.shipSelect.style.removeProperty("display")}leaveShipSelectMode(e){e[this.htmlGameboardSymbol].style.removeProperty("pointer-events"),e[this.enemyPlayerSymbol][this.htmlGameboardSymbol].style.removeProperty("display"),this.shipSelect.style.setProperty("display","none")}renderAskShipPlacementCoords(e,t){this.ship.innerHTML="";for(let t=0;t<e;++t){const e=document.createElement("div");e.className="ship-tile",this.ship.append(e)}this.shipSelectCounter.textContent=t}#o(){this.ship.dataset.direction="horizontal"==this.ship.dataset.direction?"vertical":"horizontal"}#a(e){e.target.matches(".ship > .ship-tile")&&(document.onpointerdown=this.#r.bind(this))}#r(e){const t=this.ship;this.curPlayerGameboard.style.removeProperty("pointer-events");const i=t;if(i.style.position="absolute",i.style.zIndex="9999",i.style.pointerEvents="none",i.style.animationPlayState="paused",this.draggedShipDir=this.ship.dataset.direction,document.body.append(i),n(e.clientY,e.clientX),document.onpointermove=function(e){const t=document.elementFromPoint(e.clientX,e.clientY);if(!t)return;n(e.clientY,e.clientX);const i=t.closest(".tile");if(!i)return this.highlightedTile?.classList.remove("can-place-here"),this.highlightedTile?.classList.remove("forbidden-place"),void(this.highlightedTile=null);const o=i.closest("[class^='player']");if(!o)return;const r=o[this.htmlToPlayerSymbol];this.highlightedTile!==i&&(this.highlightedTile?.classList.remove("can-place-here"),this.highlightedTile?.classList.remove("forbidden-place"),this.highlightedTile=i),s.bind(this)(r,i)}.bind(this),document.onpointerup=this.#l.bind(this),"touch"==e.pointerType){const e=this.curPlayerGameboard[this.htmlToPlayerSymbol],t=s.bind(this),i=this.curPlayerGameboard.querySelectorAll(".tile");for(const s of i)t(e,s);this.curPlayerGameboard.onclick=this.#l.bind(this)}function s(e,t){e.doesShipFit(+t.dataset.y,+t.dataset.x,i.children.length,this.draggedShipDir)?(this.canPlace=!0,t.classList.add("can-place-here")):(this.canPlace=!1,t.classList.add("forbidden-place"))}function n(e,t){i.style.top=e+"px",i.style.left=t+"px"}}#l(e){document.onpointermove=null,document.onpointerup=null,this.highlightedTile?.classList.remove("can-place-here"),this.highlightedTile?.classList.remove("forbidden-place"),this.ship.style.removeProperty("position"),this.ship.style.removeProperty("top"),this.ship.style.removeProperty("left"),this.ship.style.removeProperty("pointer-events"),this.ship.style.removeProperty("animation-play-state"),this.shipWrapper.append(this.ship);const t=this.curPlayerGameboard.querySelectorAll(".tile");for(const e of t)e.classList.remove("can-place-here"),e.classList.remove("forbidden-place");const i=document.elementFromPoint(e.clientX,e.clientY);if(this.curPlayerGameboard.style.pointerEvents="none",!i)return;const s=i.closest(".tile");s&&this.curPlayerGameboard[this.htmlToPlayerSymbol].doesShipFit(+s.dataset.y,+s.dataset.x,this.ship.children.length,this.draggedShipDir)&&document.dispatchEvent(new CustomEvent("ship-placement",{detail:{y:+s.dataset.y,x:+s.dataset.x,direction:this.draggedShipDir}}))}init(){console.log("init"),this.#h(this.player1),this.#h(this.player2)}showPassDeviceScreen(e){this.popupList.classList.add("shown"),this.popupList.classList.add("pass-device"),this.nextPlayerNameElem.textContent=e}hidePassDeviceScreen(){this.popupList.classList.remove("shown"),this.popupList.classList.remove("pass-device")}#s(e){e.preventDefault();const t=this.name1Elem.value,i=this.name2Elem.value,s="true"===document.querySelector("[name='isAIp1']:checked")?.value,n="true"===document.querySelector("[name='isAIp2']:checked")?.value;document.body.dispatchEvent(new CustomEvent("custom-game",{detail:{name1:t,name2:i,isAI1:s,isAI2:n}})),this.#i(),this.rejectPrevGame&&this.rejectPrevGame()}#t(){this.popupList.classList.add("shown"),this.popupList.classList.add("custom-game"),this.popupList.classList.remove("pass-device"),this.popupList.classList.remove("game-over-screen")}#i(){this.popupList.classList.remove("shown"),this.popupList.classList.remove("custom-game")}#e(){const e=new CustomEvent("game-reset");document.body.dispatchEvent(e)}#h(e){e[this.htmlGameboardSymbol].innerHTML="",e[this.htmlGameboardSymbol].append(function(e){const t=document.createElement("div");t.classList.add("row"),t.classList.add("letters"),t.append(document.createElement("div"));let i="A";String.fromCodePoint(i.codePointAt(0)+1);for(let n=0;n<e;++n,s=i,i=String.fromCodePoint(s.codePointAt(0)+1))t.insertAdjacentHTML("beforeend",`<div>${i}</div>`);var s;return t}(e.ownGameboard.tiles.length));for(let t=0;t<e.ownGameboard.tiles.length;++t){const i=document.createElement("div"),s=document.createElement("div");s.textContent=t+1,s.className="number",i.append(s),i.className="row";for(let s=0;s<e.ownGameboard.tiles[0].length;++s){const e=document.createElement("div");e.dataset.y=t,e.dataset.x=s,e.classList.add("tile"),i.append(e)}e[this.htmlGameboardSymbol].append(i)}}renderPlayer(e){const t=e[this.enemyPlayerSymbol],i=Object.getOwnPropertySymbols(e);console.log(i[0]==this.enemyPlayerSymbol);const s=e[this.htmlGameboardSymbol],n=t[this.htmlGameboardSymbol];for(let t=0;t<e.ownGameboard.tiles.length;++t)for(let i=0;i<e.ownGameboard.tiles[0].length;++i){const o=e.ownGameboard.getTileAt(t,i),r=s.children[t+1].children[i+1];o.ship&&r.classList.add("ship"),o.isHit&&r.classList.add("hit");const a=e.enemyGameboard.getTileAt(t,i),l=n.children[t+1].children[i+1];a.isHit?(l.classList.add("hit"),a.ship&&l.classList.add("ship")):l.classList.remove("ship")}}askInput(e){const t=e[this.enemyPlayerSymbol];return console.log("asking input"),new Promise(((e,i)=>{this.abortController.signal.onabort=()=>i();const s=i=>{const n=i.target;n.matches(".tile")&&(t[this.htmlGameboardSymbol].removeEventListener("click",s),e([+n.dataset.y,+n.dataset.x]))};t[this.htmlGameboardSymbol].addEventListener("click",s)}))}sendInput(e,t,i){e[this.enemyPlayerSymbol][this.htmlGameboardSymbol].querySelector(`[data-y="${t}"][data-x="${i}"]`).dispatchEvent(new MouseEvent("click",{bubbles:!0}))}}class l{isHit=!1;#c=null;get ship(){return this.#c}set ship(e){if(!this.isFree)throw new Error("can't place near other ships");this.isFree=!1,this.#c=e}isFree=!0}class h{constructor(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:10;this.tiles=[],this.ships=[],this.tilesEnemySuspect=[],this.shipNeighboringTilesSymbol=Symbol("neighboring-tiles"),this.prevHitShips=[];for(let t=0;t<e;++t){this.tiles.push([]);for(let i=0;i<e;++i)this.tiles[t].push(new l)}}placeShip(e,t,i){let s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"horizontal";const n=[[1,1],[-1,1],[-1,-1],[1,-1],[0,1],[-1,0],[0,-1],[1,0]],o=new Set;this.ships.push(e),this.tiles[t][i].ship=e;let r=this.detectNeighboringTiles(t,i,n);if(r.forEach((e=>o.add(e))),"horizontal"===s)for(let s=1;s<e.length;++s)this.tiles[t][i+s].ship=e,r=this.detectNeighboringTiles(t,i+s,n),r.forEach((e=>o.add(e)));else for(let s=1;s<e.length;++s)this.tiles[t+s][i].ship=e,r=this.detectNeighboringTiles(t+s,i,n),r.forEach((e=>o.add(e)));e[this.shipNeighboringTilesSymbol]=o}detectNeighboringTiles(e,t,i){const s=[];for(const[n,o]of i)e+n<0||t+o<0||e+n>=this.tiles.length||t+o>=this.tiles[0].length||s.push(this.tiles[e+n][t+o]);return s}detectNeighboringLegalCoords(e,t,i){const s=[];for(const[n,o]of i)e+n<0||t+o<0||e+n>=this.tiles.length||t+o>=this.tiles[0].length||s.push([e+n,t+o]);return s}getTileAt(e,t){return this.tiles[e][t]}receiveAttack(e,t){const i=this.tiles[e][t];if(i.isHit=!0,i.ship){if(i.ship.hit(),i.ship.isSunk())i.ship[this.shipNeighboringTilesSymbol].forEach((e=>e.isHit=!0)),this.prevHitShips=[];else if(0==this.prevHitShips.length)this.hitDirection="random",this.prevHitShips.push([e,t]);else{const[i,s]=this.prevHitShips.at(-1);i!=e?this.hitDirection="vertical":s!=t&&(this.hitDirection="horizontal"),this.prevHitShips.push([e,t]),this.prevHitShips.sort(((e,t)=>"vertical"==this.hitDirection?e[0]-t[0]:"horizontal"==this.hitDirection?e[1]-t[1]:void 0))}return!0}return!1}areAllShipsDestroyed(){return this.ships.every((e=>e.isSunk()))}}const c=[[4,1],[3,2],[2,3],[1,4]];class d{constructor(){this.addEventListeners()}async startGame(e,t,i,s){this.abortController?.abort(),this.domHandler?.abortController.abort(),this.abortController=new AbortController;const n=new h(10),o=new h(10);this.player1=new r(n,o,e,i),this.player2=new r(o,n,t,s),this.resetGameboards()}async getInput(e){const t=this.domHandler.askInput(e);let i,s;e.isAI&&(console.log("ai"),this.domHandler.sendInput(e,...e.getRandomCoords()));try{[i,s]=await t}catch{return this.callCount=0,void this.startGame(this.player1.isAI,this.player2.isAI,this.player1.name,this.player2.name)}e.enemyGameboard.receiveAttack(i,s)}addEventListeners(){document.body.addEventListener("game-reset",(()=>{console.log("bbb"),this.startGame(this.player1.isAI,this.player2.isAI,this.player1.name,this.player2.name)})),document.body.addEventListener("custom-game",(async e=>{await this.startGame(e.detail.isAI1,e.detail.isAI2,e.detail.name1,e.detail.name2)}))}async resetGameboards(){const e=new h(10),t=new h(10);this.player1.ownGameboard=this.player2.enemyGameboard=e,this.player2.ownGameboard=this.player1.enemyGameboard=t,this.domHandler=new a(this.player1,this.player2),this.domHandler.init(),this.domHandler.leaveShipSelectMode(this.player1),this.domHandler.leaveShipSelectMode(this.player2),this.domHandler.renderPlayer(this.player1),this.callCount=0}async askShipCoordsAndPlace(e,t){let i=!1;this.domHandler.enterShipSelectMode(e);for(const n of t){const[t,o]=n;for(let n=0;n<o;++n){if(i){e.placeShipRandomly(new s(t));continue}let r,a,l;this.domHandler.renderAskShipPlacementCoords(t,o-n);try{[r,a,l]=await this.awaitShipCoords()}catch(n){if("random-placement-start"===n.message){i=!0,e.placeShipRandomly(new s(t));continue}throw n}e.ownGameboard.placeShip(new s(t),r,a,l),this.domHandler.renderPlayer(e)}}this.domHandler.leaveShipSelectMode(e)}awaitShipCoords(){return new Promise(((e,t)=>{document.addEventListener("ship-placement",(function t(i){document.removeEventListener("ship-placement",t),e([i.detail.y,i.detail.x,i.detail.direction])})),this.abortController.signal.onabort=()=>t(),document.addEventListener("random-placement",(function e(){document.removeEventListener("random-placement",e);const i=new Error("random-placement-start");t(i)}))}))}async*[Symbol.asyncIterator](){for(this.callCount=0;;){++this.callCount;try{1==this.callCount&&(this.player1.isAI?this.player1.generateShips(c):(this.player2.isAI||this.domHandler.showPassDeviceScreen(this.player1.name),await this.askShipCoordsAndPlace(this.player1,c)),this.player2.isAI?this.player2.generateShips(c):(this.player1.isAI||this.domHandler.showPassDeviceScreen(this.player2.name),await this.askShipCoordsAndPlace(this.player2,c),await new Promise((e=>setTimeout(e,10)))))}catch{continue}this.callCount%2?(this.player1.isAI||this.player2.isAI||this.domHandler.showPassDeviceScreen(this.player1.name),this.domHandler.renderPlayer(this.player1),yield this.player1):(this.player1.isAI||this.player2.isAI||this.domHandler.showPassDeviceScreen(this.player2.name),this.domHandler.renderPlayer(this.player2),yield this.player2)}}}},126:function(e,t,i){i.a(e,(async function(e,t){try{const e=new(i(230).l)(!1,!0);await e.startGame(!1,!0,"player1","player2");for await(const t of e)await e.getInput(t),t.enemyGameboard.areAllShipsDestroyed()&&await e.domHandler.showGameOverScreen(t);t()}catch(e){t(e)}}),1)}},o={};function r(e){var t=o[e];if(void 0!==t)return t.exports;var i=o[e]={exports:{}};return n[e](i,i.exports,r),i.exports}e="function"==typeof Symbol?Symbol("webpack queues"):"__webpack_queues__",t="function"==typeof Symbol?Symbol("webpack exports"):"__webpack_exports__",i="function"==typeof Symbol?Symbol("webpack error"):"__webpack_error__",s=function(e){e&&e.d<1&&(e.d=1,e.forEach((function(e){e.r--})),e.forEach((function(e){e.r--?e.r++:e()})))},r.a=function(n,o,r){var a;r&&((a=[]).d=-1);var l,h,c,d=new Set,m=n.exports,p=new Promise((function(e,t){c=t,h=e}));p[t]=m,p[e]=function(e){a&&e(a),d.forEach(e),p.catch((function(){}))},n.exports=p,o((function(n){var o;l=function(n){return n.map((function(n){if(null!==n&&"object"==typeof n){if(n[e])return n;if(n.then){var o=[];o.d=0,n.then((function(e){r[t]=e,s(o)}),(function(e){r[i]=e,s(o)}));var r={};return r[e]=function(e){e(o)},r}}var a={};return a[e]=function(){},a[t]=n,a}))}(n);var r=function(){return l.map((function(e){if(e[i])throw e[i];return e[t]}))},h=new Promise((function(t){(o=function(){t(r)}).r=0;var i=function(e){e!==a&&!d.has(e)&&(d.add(e),e&&!e.d&&(o.r++,e.push(o)))};l.map((function(t){t[e](i)}))}));return o.r?h:r()}),(function(e){e?c(p[i]=e):h(m),s(a)})),a&&a.d<0&&(a.d=0)},r.d=function(e,t){for(var i in t)r.o(t,i)&&!r.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r(126)}();