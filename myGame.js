let myGamePiece;
let myObstacles = [];
let myScore;
let birdImg = new Image();
birdImg.src = `./bird.PNG`;
let flyingBirdImg = new Image();
flyingBirdImg.src = `./flying.png`;

function startGame() {
  myGamePiece = new Component(50, 50, `blue`, 30, 0);
  myScore = new Component(`30px`, `Consolas`, `gold`, 10, 30, `text`);
  myGameArea.start();
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
  constructor(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speed = 1;
    this.gravity = 0.03;
    this.gravitySpeed = 0;
    this.update = function () {
      const ctx = myGameArea.context;
      if (this.type == `text`) {
        ctx.font = this.width + ` ` + this.height;
        ctx.fillStyle = color;
        ctx.fillText(this.text, this.x, this.y);
      } else if (color == `blue`) {
        ctx.beginPath();
        ctx.drawImage(birdImg, this.x, this.y, this.width, this.height);
        ctx.closePath();
      } else {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
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
      if (myBottom >= myGameArea.canvas.height) {
        isCrash = true;
      }
      return isCrash;
    }
  }
}

function updateGameArea() {
  let x, y;
  for (let i = 0; i < myObstacles.length; i += 1) {
    if (myGamePiece.crashWith(myObstacles[i])) {
      myGameArea.stop();
      return;
    }
  }
  myGameArea.clear();
  myGameArea.frameNum += 1;
  if (myGameArea.frameNum == 1 || everyInterval(150)) {
    const ran = parseInt(Math.random() * 200);
    x = myGameArea.canvas.width;
    y = myGameArea.canvas.height;
    let gap = 300;
    myObstacles.push(new Component(100, ran, `green`, x, y - ran));
    myObstacles.push(new Component(100, y - ran - gap, `green`, x, 0));
  }
  console.log(`myObstacles.length : `, myObstacles.length);
  if (myObstacles.length > 20) myObstacles.shift();
  for (let i = 0; i < myObstacles.length; i += 1) {
    myObstacles[i].x -= 1;
    myObstacles[i].update();
  }
  myScore.text = `SCORE : ` + myGameArea.frameNum;
  myScore.update();
  movePlayer();
  myGamePiece.update();
}

let key = {
  w: false,
  a: false,
  s: false,
  d: false,
  spaceBar: false,
}

window.addEventListener(`keydown`, (e) => {
  // console.log(e);
  keyHandler(e.key, true);
});
window.addEventListener(`keyup`, (e) => {
  keyHandler(e.key, false);
});

function keyHandler(eKey, value) {
  // if (eKey === `w`) {
  //   key.w = value;
  // }
  // if (eKey === `a`) {
  //   key.a = value;
  // }
  // if (eKey === `s`) {
  //   key.s = value;
  // }
  // if (eKey === `d`) {
  //   key.d = value;
  // }
  if (eKey === ` `) {
    key.spaceBar = value;
  }
}

function movePlayer() {
  myGamePiece.gravitySpeed += myGamePiece.gravity;
  myGamePiece.y += myGamePiece.gravitySpeed;
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
  if (key.spaceBar) {
    myGamePiece.y -= myGamePiece.speed;
    myGamePiece.gravitySpeed = 0;
    birdImg.src = `./flying.png`;
  } else {
    birdImg.src = `./bird.png`;
  }
}

startGame();