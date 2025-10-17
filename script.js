const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Paddle settings
const paddleWidth = 8, paddleHeight = 60;
const player1 = { x: 0, y: canvas.height / 2 - paddleHeight / 2, score: 0 };
const player2 = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2, score: 0 };

// Ball settings
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 6,
  speed: 3,
  dx: 3,
  dy: 2
};

// Key controls
const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function update() {
  // Player 1 movement
  if (keys["w"] && player1.y > 0) player1.y -= 5;
  if (keys["s"] && player1.y < canvas.height - paddleHeight) player1.y += 5;

  // Player 2 movement
  if (keys["ArrowUp"] && player2.y > 0) player2.y -= 5;
  if (keys["ArrowDown"] && player2.y < canvas.height - paddleHeight) player2.y += 5;

  // Ball movement
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall collision
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.dy *= -1;
  }

  // Paddle collision
  if (
    ball.x - ball.radius < player1.x + paddleWidth &&
    ball.y > player1.y &&
    ball.y < player1.y + paddleHeight
  ) {
    ball.dx *= -1;
    ball.x = player1.x + paddleWidth + ball.radius;
  }

  if (
    ball.x + ball.radius > player2.x &&
    ball.y > player2.y &&
    ball.y < player2.y + paddleHeight
  ) {
    ball.dx *= -1;
    ball.x = player2.x - ball.radius;
  }

  // Scoring
  if (ball.x < 0) {
    player2.score++;
    resetBall();
  } else if (ball.x > canvas.width) {
    player1.score++;
    resetBall();
  }
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx *= -1;
  ball.dy = (Math.random() > 0.5 ? 2 : -2);
}

function drawNet() {
  for (let i = 0; i < canvas.height; i += 12) {
    ctx.fillStyle = "white";
    ctx.fillRect(canvas.width / 2 - 1, i, 2, 8);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawNet();

  // Paddles
  ctx.fillStyle = "white";
  ctx.fillRect(player1.x, player1.y, paddleWidth, paddleHeight);
  ctx.fillRect(player2.x, player2.y, paddleWidth, paddleHeight);

  // Ball
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();

  // Scores
  ctx.font = "16px Courier New";
  ctx.fillText(player1.score, canvas.width / 4, 20);
  ctx.fillText(player2.score, (canvas.width * 3) / 4, 20);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();