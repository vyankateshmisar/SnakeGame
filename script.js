// Define HTML elements

const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");

// Define game variable
const gridsize = 20;
let highScore = 0;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let dir = "right";
let gameInterval;
let gameSpeedDelay = 250;
let gameStarted = false;

//Draw game map, snake, food

function draw() {
  board.innerHTML = "";
  drawSnake();
  drawFood();
  updateScore();
}
const drawSnake = () => {
  snake.forEach((pixel) => {
    const snakeEl = createGameElement("div", "snake");
    setPosition(snakeEl, pixel);
    board.appendChild(snakeEl);
  });
};

const drawFood = () => {
  if (gameStarted) {
    const foodEl = createGameElement("div", "food");
    setPosition(foodEl, food);
    board.appendChild(foodEl);
  }
};

//creating a snake or food pixel

const createGameElement = (tag, className) => {
  const el = document.createElement(tag);
  el.className = className;
  return el;
};

const setPosition = (el, pixel) => {
  el.style.gridColumn = pixel.x;
  el.style.gridRow = pixel.y;
};

function generateFood() {
  const x = Math.floor(Math.random() * gridsize) + 1;
  const y = Math.floor(Math.random() * gridsize) + 1;
  return { x, y };
}

//test a draw

function move() {
  const head = { ...snake[0] };
  switch (dir) {
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
    case "right":
      head.x++;
      break;
    case "left":
      head.x--;
      break;
  }
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed();
    clearInterval(gameInterval); // clear past interval
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
}

function startGame() {
  gameStarted = true;
  instructionText.style.display = "none";
  logo.style.display = "none";
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

function handleKeyPress(event) {
  if (
    (!gameStarted && event.code === "Space") ||
    (!gameStarted && event.key === " ")
  ) {
    startGame();
  } else {
    switch (event.key) {
      case "ArrowUp":
        dir = "up";
        break;
      case "ArrowDown":
        dir = "down";
        break;
      case "ArrowLeft":
        dir = "left";
        break;
      case "ArrowRight":
        dir = "right";
        break;
    }
  }
}
document.addEventListener("keydown", handleKeyPress);

function increaseSpeed() {
  //   console.log(gameSpeedDelay);
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}

function checkCollision() {
  const head = snake[0];
  if (head.x < 1 || head.x > gridsize || head.y < 1 || head.y > gridsize) {
    resetGame();
  }
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y == snake[i].y) {
      resetGame();
    }
  }
}

function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  dir = "right";
  food = generateFood();
  gameSpeedDelay = 200;
  updateScore();
}
function updateScore() {
  const currScore = snake.length - 1;
  score.innerText = currScore.toString().padStart(3, "0");
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = "block";
  logo.style.display = "block";
}

function updateHighScore() {
  const currScore = snake.length - 1;
  if (currScore > highScore) {
    highScore = currScore;
    highScoreText.innerText = highScore.toString().padStart(3, "0");
  }
  highScoreText.style.display = "block";
}

// Testing

// draw();
// setInterval(() => {
//   move();
//   draw();
// }, 400);
