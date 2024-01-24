const clock = document.querySelector(`#clock`);
const clockCtx = clock.getContext(`2d`);
let radius = clock.height / 2;
clockCtx.translate(radius, radius);
radius *= 0.90;
setInterval(drawClock, 1000);

function drawClock() {
  drawFace(clockCtx, radius);
  drawNumbers(clockCtx, radius);
  drawTime(clockCtx, radius);
}

function drawFace(clockCtx, radius) {
  const grad = clockCtx.createRadialGradient(0, 0, radius * 0.95, 0, 0, radius * 1.05);
  grad.addColorStop(0, `grey`);
  grad.addColorStop(0.5, `white`);
  grad.addColorStop(1, `gray`);

  clockCtx.beginPath();
  clockCtx.arc(0, 0, radius, 0, 2 * Math.PI);
  clockCtx.fillStyle = `white`;
  clockCtx.fill();

  clockCtx.strokeStyle = grad;
  clockCtx.lineWidth = radius * 0.22;
  clockCtx.stroke();

  clockCtx.beginPath();
  clockCtx.arc(0, 0, radius * 0.05, 0, 2 * Math.PI);
  clockCtx.fillStyle = `black`;
  clockCtx.fill();
}

function drawNumbers(clockCtx, radius) {
  clockCtx.font = radius * 0.30 + "px arial";
  clockCtx.textBaseline = "middle";
  clockCtx.textAlign = "center";
  for (let num = 1; num < 13; num++) {
    let ang = num * Math.PI / 6;
    clockCtx.rotate(ang);
    clockCtx.translate(0, -radius * 0.70);
    clockCtx.rotate(-ang);
    clockCtx.fillText(num.toString(), 0, 0);
    clockCtx.rotate(ang);
    clockCtx.translate(0, radius * 0.70);
    clockCtx.rotate(-ang);
  }
}

function drawTime() {
  const now = new Date();
  let hour = now.getHours();
  let minute = now.getMinutes();
  let second = now.getSeconds();
  // hour
  hour = hour % 12;
  hour = (hour * Math.PI / 6) + (minute * Math.PI / (6 * 60)) + (second * Math.PI / (360 * 60));
  drawHand(clockCtx, hour, radius * 0.5, radius * 0.07);
  // minute
  minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
  drawHand(clockCtx, minute, radius * 0.8, radius * 0.07);
  // second
  second = (second * Math.PI / 30);
  drawHand(clockCtx, second, radius * 0.8, radius * 0.02);
}

function drawHand(clockCtx, pos, length, width) {
  clockCtx.beginPath();
  clockCtx.lineWidth = width;
  clockCtx.lineCap = `round`;
  clockCtx.moveTo(0, 0);
  clockCtx.rotate(pos);
  clockCtx.lineTo(0, -length);
  clockCtx.stroke();
  clockCtx.rotate(-pos);
}