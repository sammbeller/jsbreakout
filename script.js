var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;
var ballRadius = 10;

var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;

var rightPressed = false;
var leftPressed = false;

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];
for (c=0; c<brickColumnCount; c++) {
  bricks[c] = [];
  for (r=0; r<brickRowCount; r++) {
    bricks[c][r] = { X: 0, Y: 0, status: 1 };
  }
}

var score = 0;
var lives = 3;

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (c=0; c<brickColumnCount; c++) {
    for (r=0; r<brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        var brickX = c*(brickWidth+brickPadding) + brickOffsetLeft;
        var brickY = r*(brickHeight+brickPadding) + brickOffsetTop;
        bricks[c][r].X = brickX;
        bricks[c][r].Y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: "+score, 8, 20);
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function handleKeyPresses() {
  if (rightPressed && paddleX < canvas.width-paddleWidth) {
    paddleX += 7;
  }
  else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
}

function checkWallCollision() {
  if (y + dy < ballRadius) {
    dy = -dy;
  }
  else if (y + dy > canvas.height-ballRadius) {
  //  if (x + dx > paddleX - ballRadius && x + dx < paddleX + paddleWidth + ballRadius) {
  //    y = canvas.height-paddleHeight - (2*ballRadius);
  //    dy = -dy;
  //  }
  //  else {
      lives--;
      if (!lives) {
        alert("GAME OVER");
        document.location.reload();
      }
      else {
        x = canvas.width/2;
        y = canvas.height-30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width-paddleWidth)/2;
      }
  //  }
  }

  if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
    dx = -dx;
  }
}

function checkPaddleCollision() {

// Check on x axis, is some part of ball over paddle
// Check Y axis, is some part of the ball at or below top of paddle
// If no ignore
// If yes set ball Y to top of paddle + ball height
// negate Y movement

  var paddleY = canvas.height - paddleHeight; 
  if (x > paddleX - ballRadius && x < paddleX + paddleWidth + ballRadius) {
    if (y + 2*ballRadius >= paddleY) {
      y = paddleY - (2*ballRadius);
      dy = -dy;
    }
  }
}

function checkBrickCollision() {
  for (let column of bricks) {
    for (let brick of column) {
      if (brick.status == 1) {
        if (x > brick.X && x < brick.X + brickWidth && y > brick.Y && y < brick.Y + brickHeight) {
          dy = -dy;
          brick.status = 0;
          score++;
          if (score == brickRowCount * brickColumnCount) {
            alert("YOU WIN, CONGRATULATIONS!!");
            document.location.reload(); 
          }
        }
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  handleKeyPresses();
  checkPaddleCollision();
  checkWallCollision();
  checkBrickCollision();
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();

  x += dx;
  y += dy;
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
//document.addEventListener("mousemove", mouseMoveHandler, false);

setInterval(draw, 10);


function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  }
  else if (e.keyCode ==37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false;
  }
  else if (e.keyCode ==37) {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 &&  relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth/2;
  }
}
