let myGamePiece;

function startGame() {
  myGameArea.start();
  myGamePiece = new Component(30, 30, `blue`, 30, 250 - 15);
}

let myGameArea = {
  canvas: document.createElement(`canvas`),
  start: function () {
    this.canvas.width = 1000;
    this.canvas.height = 500;
    this.canvas.classList.add(`game`);
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 1);
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
}

class Component {
  constructor(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speed = 2;
    const ctx = myGameArea.context;
    this.update = function () {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}

function updateGameArea() {
  myGameArea.clear();
  movePlayer();
  myGamePiece.update();
}

let key = {
  w: false,
  a: false,
  s: false,
  d: false,
}

window.addEventListener(`keydown`, (e) => {
  keyHandler(e.key, true);
});
window.addEventListener(`keyup`, (e) => {
  keyHandler(e.key, false);
});

function keyHandler(eKey, value) {
  if (eKey === `w`) {
    key.w = value;
  }
  if (eKey === `a`) {
    key.a = value;
  }
  if (eKey === `s`) {
    key.s = value;
  }
  if (eKey === `d`) {
    key.d = value;
  }
}

function movePlayer() {
  if (key.w && myGamePiece.y > 0) {
    myGamePiece.y -= myGamePiece.speed;
  }
  if (key.a && myGamePiece.x > 0) {
    myGamePiece.x -= myGamePiece.speed;
  }
  if (key.s && myGamePiece.y < myGameArea.canvas.height - myGamePiece.height) {
    myGamePiece.y += myGamePiece.speed;
  }
  if (key.d && myGamePiece.x < myGameArea.canvas.width - myGamePiece.width) {
    myGamePiece.x += myGamePiece.speed;
  }
}

startGame();