const $section = document.querySelector(`section`);
const nameInput = document.querySelector(`.name`);
const startBtn = document.querySelector(`.startBtn`);
const rankingDiv = document.querySelector(`.ranking`);
let myGamePiece;
let myObstacles = [];
let myScore;
let backgroundImg = new Image();
let birdImg = new Image();
let flyingBirdImg = new Image();
let tree1 = new Image();
let cloud1Img = new Image();
let backX = 1000;
let rankList = [];
let playerName = ``;

backgroundImg.src = `./imgs/background1.png`;
birdImg.src = `./imgs/bird.png`;
flyingBirdImg.src = `./imgs/flying.png`;
tree1.src = `./imgs/tree1.png`;
cloud1Img.src = `./imgs/cloud1.png`;

startBtn.addEventListener(`click`, () => {
  if (nameInput.value.trim() == ``) {
    alert(`이름을 입력하세요.`);
    nameInput.focus();
    return;
  }
  startGame();
});

function startGame() {
  $section.style.visibility = `hidden`;
  nameInput.style.visibility = `hidden`;
  startBtn.style.visibility = `hidden`;
  rankingDiv.style.visibility = `hidden`;
  playerName = nameInput.value;
  nameInput.value = ``;
  rankingDiv.innerHTML = ``;
  getScore();
  myObstacles = [];
  myGameArea.start();
  myGamePiece = new Component(50, 50, `blue`, 30, 0);
  myScore = new Component(`30px`, `Consolas`, `gold`, 10, 490, `text`);
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
    this.speed = 2;
    this.gravity = 0.025;
    this.gravitySpeed = 0;
    this.update = function () {
      const ctx = myGameArea.context;
      if (this.type == `text`) {
        ctx.font = this.width + ` ` + this.height;
        ctx.fillStyle = color;
        ctx.fillText(this.text, this.x, this.y);
      } else if (color == `blue`) {
        ctx.drawImage(birdImg, this.x, this.y, this.width, this.height);
      } else if (color == `black`) {
        ctx.drawImage(cloud1Img, this.x, this.y, this.width, this.height);
      } else {
        ctx.drawImage(tree1, this.x, this.y, this.width, this.height);
      }
    }
    this.crashWith = function (otherObj) {
      let myRight = this.x + this.width;
      let myLeft = this.x;
      let myBottom = this.y + this.height;
      let myTop = this.y;

      let otherRight = otherObj.x + otherObj.width - 25;
      let otherLeft = otherObj.x + 25;
      let otherBottom = otherObj.y + otherObj.height - 25;
      let otherTop = otherObj.y + 25;

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

function endTheGame() {
  myGameArea.stop();
  setScore();
  rankingDiv.innerHTML = ``;
  getScore();
  startBtn.style.visibility = `visible`;
  rankingDiv.style.visibility = `visible`;
  nameInput.style.visibility = `visible`;
}

function updateGameArea() {
  let x, y;
  for (let i = 0; i < myObstacles.length; i += 1) {
    if (myGamePiece.crashWith(myObstacles[i])) {
      endTheGame();
      return;
    }
  }
  myGameArea.clear();
  const ctx = myGameArea.context;
  ctx.drawImage(backgroundImg, backX, 0, myGameArea.canvas.width, myGameArea.canvas.height);
  ctx.drawImage(backgroundImg, backX - myGameArea.canvas.width, 0, myGameArea.canvas.width, myGameArea.canvas.height);
  backX -= 0.5;
  if (backX <= 0) { backX = 1000; }
  myGameArea.frameNum += 1;
  if (myGameArea.frameNum == 1 || everyInterval(50)) {
    x = myGameArea.canvas.width;
    y = myGameArea.canvas.height;
    const ran = Math.random() * 150 + 50;
    myObstacles.push(new Component(ran, ran, `green`, x, y - ran));
    if (Math.random() <= 0.25) {
      const cloudSize = Math.random() * 75 + 25;
      myObstacles.push(new Component(cloudSize, cloudSize, `black`, x, Math.random() * 250 - 25));
    }
  }
  console.log(myObstacles.length);
  if (myObstacles.length > 50) myObstacles.shift();
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
  if (myGamePiece.y + (myGamePiece.height / 2) >= myGameArea.canvas.height) {
    myGamePiece.y = myGameArea.canvas.height - myGamePiece.height / 2;
  }
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
    birdImg.src = `./imgs/flying.png`;
    if (myGamePiece.y <= 0 - (myGamePiece.height / 2)) myGamePiece.y = 0 - (myGamePiece.height / 2);
  } else {
    birdImg.src = `./imgs/bird.png`;
  }
}

function getScore() {
  let gotList = JSON.parse(localStorage.getItem(`ranking`));
  if (gotList) rankList = gotList;
  rankList.sort((beforeObj, afterObj) => {
    if (beforeObj.score > afterObj.score) {
      return -1;
    } else if (beforeObj.score == afterObj.score) {
      return 0;
    } else {
      return 1;
    }
  });
  let i = 0;
  rankList.forEach((e) => {
    let $li = document.createElement(`li`);
    $li.innerHTML = `${++i}위 : ${e.name} ${e.score} 점`;
    rankingDiv.appendChild($li);
  });
}

function setScore() {
  let tempObj = {
    name: `${playerName}`,
    score: myGameArea.frameNum,
  }
  rankList.push(tempObj);

  // 로컬에 저장하기
  localStorage.setItem(`ranking`, JSON.stringify(rankList));
}

getScore();