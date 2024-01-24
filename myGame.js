let myGamePiece;
let myObstacles = [];

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
    this.interval = setInterval(updateGameArea, 10);
    this.frameNum = 0;
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function () {
    clearInterval(this.interval);
  }
}

function everyInterval(n) {
  if ((myGameArea.frameNum / n) % 1 === 0) { return true; }
  return false;
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
    this.crashWith = function (otherObj) {
      let myRight = this.x + this.width;
      let myLeft = this.x;
      let myBottom = this.y + this.height;
      let myTop = this.y;

      let otherRight = otherObj.x + otherObj.width;
      let otherLeft = otherObj.x;
      let otherBottom = otherObj.y + otherObj.height;
      let otherTop = otherObj.y;

      let isCrash = true;

      if ((myBottom < otherTop) || (myTop > otherBottom) || (myRight < otherLeft) || (myLeft > otherRight)) {
        isCrash = false;
      }
      return isCrash;
    }
  }
}

function updateGameArea() {
  let x, y;
  for (let i = 0; i < myObstacles.length; i += 1) {
    if (myGamePiece.crashWith(myObstacles[i])) {
      myGamePiece.x -= 1;
      // console.log(`왼`, myObstacles[i].x);
      // console.log(`오`, myObstacles[i].x + myObstacles[i].width);
      // console.log(`위`, myObstacles[i].y);
      // console.log(`아래`, myObstacles[i].y + myObstacles[i].height);
      if (myGamePiece.x + myGamePiece.width >= myObstacles[i].x) {
        console.log(`오른쪽 충돌`);
        myGamePiece.x -= 1;
        key.d = false;
      } else if (myGamePiece.x <= myObstacles[i].x + myObstacles[i].width) {
        console.log(`왼쪽 충돌`);
        myGamePiece.x += 1;
        key.a = false;
      } else if (myGamePiece.y <= myObstacles[i].y + myObstacles[i].height) {
        console.log(`상단 충돌`);
        key.w = false;
      } else if (myGamePiece.y + myGamePiece.hi >= myObstacles[i].y) {
        console.log(`하단 충돌`);
        myGamePiece.y -= 1;
        key.s = false;
      }
    }
  }
  myGameArea.clear();
  myGameArea.frameNum += 1;
  if (myGameArea.frameNum == 1 || everyInterval(200)) {
    const ran = parseInt(Math.random() * 200);
    x = myGameArea.canvas.width;
    y = myGameArea.canvas.height;
    myObstacles.push(new Component(90, ran, `green`, x, y - ran));
    myObstacles.push(new Component(90, y - ran - 300, `green`, x, 0));
  }
  // console.log(`myObstacles.length : `, myObstacles.length);
  if (myObstacles.length > 25) myObstacles.shift();
  for (let i = 0; i < myObstacles.length; i += 1) {
    myObstacles[i].x -= 1;
    myObstacles[i].update();
  }
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