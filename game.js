const cvs = document.getElementById("game");
const ctx = cvs.getContext("2d");
cvs.width = window.innerWidth;
cvs.height = window.innerHeight;

const drawRect = (x, y, w, h, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
};

const drawCİrcleF = (x, y, r, color) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI, false);
  ctx.closePath();
  ctx.fill();
};

const drawCİrcleS = (x, y, r, w, color) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI, false);
  ctx.closePath();
  ctx.stroke();
};

const drawText = (text, x, y, color) => {
  ctx.fillStyle = color;
  ctx.font = "30px sans-serif";
  ctx.fillText(text, x, y);
};

const user = {
  x: 20,
  y: cvs.height / 2 - 50,
  w: 10,
  h: 100,
  color: "white",
  score: 0,
};

const com = {
  x: cvs.width - 30,
  y: cvs.height / 2 - 50,
  w: 10,
  h: 100,
  color: "white",
  score: 0,
};

const ball = {
  x: cvs.width / 2,
  y: cvs.height / 2,
  r: 16,
  color: "#a51890",
  speed: 10,
  velocityX: 10,
  velocityY: 10,
  stop: true,
};

const movePaddle = (e) => {
  let rect = cvs.getBoundingClientRect();
  user.y = e.clientY - rect.top - user.h / 2;
  ball.stop = false;
};

cvs.addEventListener("mousemove", movePaddle);

const collisions = (b, p) => {
  b.top = b.y - b.r;
  b.bottom = b.y + b.r;
  b.left = b.x - b.r;
  b.right = b.x + b.r;

  p.top = p.y;
  p.bottom = p.y + p.h;
  p.left = p.x;
  p.right = p.x + p.w;

  return (
    b.top < p.bottom && b.bottom > p.top && b.left < p.right && b.right > p.left
  );
};

const resetBall = () => {
  ball.x = cvs.width / 2;
  ball.y = cvs.height / 2;
  ball.speed = 10;
  ball.velocityX = 10;
  ball.velocityY = 10;
  ball.stop = true;
};

const update = () => {
  if (!ball.stop) {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
  }

  if (ball.x < 0) {
    //Bilgisayar Kazandı
    com.score++;
    resetBall();
  } else if (ball.x > cvs.width) {
    //User Kazandı
    user.score++;
    resetBall();
  }

  if (ball.y + ball.r > cvs.height || ball.y - ball.r < 0) {
    ball.velocityY = -ball.velocityY;
    ball.speed += 2;
  }

  const player = ball.x < cvs.width / 2 ? user : com;

  if (collisions(ball, player)) {
    let intersectY = ball.y - (player.y + player.h / 2);
    intersectY /= player.h / 2;

    let maxBaounceRate = Math.PI / 3;
    let bounceAngle = intersectY * maxBaounceRate;

    let direction = ball.x < cvs.width / 2 ? 1 : -1;

    ball.velocityX = direction * ball.speed * Math.cos(bounceAngle);
    ball.velocityY = ball.speed * Math.sin(bounceAngle);

    ball.speed += 2;
  }
  if (ball.x > (4 * cvs.width) / 5) {
    const comLvl = 0.3;
    com.y += (ball.y - (com.y + com.h / 2)) * comLvl;
  } else if (ball.x > (3 * cvs.width) / 5) {
    const comLvl = 0.15;
    com.y += (ball.y - (com.y + com.h / 2)) * comLvl;
  } else if (ball.x > (2 * cvs.width) / 5) {
    const comLvl = 0.1;
    com.y += (ball.y - (com.y + com.h / 2)) * comLvl;
  } else if (ball.x > (1 * cvs.width) / 5) {
    const comLvl = 0.05;
    com.y += (ball.y - (com.y + com.h / 2)) * comLvl;
  }
};

const render = () => {
  drawRect(0, 0, cvs.width, cvs.height, "#008374");
  drawRect(cvs.width / 2 - 2, 0, 4, cvs.height, "white");
  drawCİrcleF(cvs.width / 2, cvs.height / 2, 7, "white");
  drawCİrcleS(cvs.width / 2, cvs.height / 2, 50, 4, "white");
  drawText(user.score, cvs.width / 4, 35, "white");
  drawText(com.score, (3 * cvs.width) / 4, 35, "white");

  drawRect(user.x, user.y, user.w, user.h, user.color);
  drawRect(com.x, com.y, com.w, com.h, com.color);

  drawCİrcleF(ball.x, ball.y, 20, ball.color);
};

const game = () => {
  update();
  render();
};

const fps = 50;
setInterval(game, 1000 / fps);
