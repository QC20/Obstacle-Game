let player;
let obstacles;
let gameSpeed;
let isGameOver;
let isGameStarted; // New variable to track game start
let score;
let timer;
let timerInterval;
let startButton;
let restartButton;

function setup() {
  createCanvas(400, 150);
  gameSpeed = 6;
  isGameOver = false;
  isGameStarted = false; // Initialize game start to false
  score = 0;
  timer = 0;
  obstacles = [];
  player = new Player();
  timerInterval = setInterval(updateTimer, 1000);
  
  // Create start button
  startButton = createButton('Start Game');
  startButton.position(width / 2 - 50, height / 2);
  startButton.mousePressed(startGame);
  
  // Create restart button
  restartButton = createButton('Restart');
  restartButton.position(width / 2 - 30, height / 2 + 30);
  restartButton.mousePressed(restartGame);
  restartButton.hide();
}

function draw() {
  background(220);
  
  if (isGameStarted) { // Only update the game if it has started
    if (!isGameOver) {
      player.update();
      handleObstacles();
      score++;
    }
    
    player.show();
    displayObstacles();
    displayScore();
    displayTimer();
    
    if (player.hits()) {
      gameOver();
    }
  }
}

function keyPressed() {
  if (key === ' ' && isGameStarted && !isGameOver) { // Only allow jump when the game has started and is not over
    player.jump();
  }
}

function handleObstacles() {
  if (frameCount % 80 === 0) {
    obstacles.push(new Obstacle());
  }
  
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].update();
    
    if (obstacles[i].isOffscreen()) {
      obstacles.splice(i, 1);
    }
  }
}

function displayObstacles() {
  for (let obstacle of obstacles) {
    obstacle.show();
  }
}

function displayScore() {
  fill(0);
  textAlign(LEFT);
  textSize(16);
  text(`Score: ${score}`, 20, 20);
}

function displayTimer() {
  fill(0);
  textAlign(RIGHT);
  textSize(16);
  text(`Timer: ${timer}`, width - 20, 20);
}

function updateTimer() {
  if (isGameStarted && !isGameOver) { // Only update the timer when the game has started and is not over
    timer++;
  }
}

function gameOver() {
  isGameOver = true;
  clearInterval(timerInterval);
  fill(255, 0, 0);
  textAlign(CENTER);
  textSize(20);
  text('Game Over!', width / 2, height / 2);
  restartButton.show();
  noLoop();
}

function startGame() {
  isGameStarted = true; // Set the game start to true
  startButton.hide();
  loop();
}

function restartGame() {
  restartButton.hide();
  isGameOver = false;
  isGameStarted = true; // Set the game start to true
  score = 0;
  timer = 0;
  obstacles = [];
  player = new Player();
  timerInterval = setInterval(updateTimer, 1000);
  loop();
}

class Player {
  constructor() {
    this.width = 50;
    this.height = 50;
    this.x = 50;
    this.y = height - this.height;
    this.velocity = 0;
    this.gravity = 0.6;
  }
  
  jump() {
    if (this.y === height - this.height) {
      this.velocity = -15;
    }
  }
  
  hits() {
    for (let obstacle of obstacles) {
      if (
        this.x + this.width >= obstacle.x &&
        this.x <= obstacle.x + obstacle.width &&
        this.y + this.height >= height - obstacle.height
      ) {
        return true;
      }
    }
    return false;
  }
  
  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;
    
    if (this.y >= height - this.height) {
      this.y = height - this.height;
      this.velocity = 0;
    }
  }
  
  show() {
    fill(0);
    rect(this.x, this.y, this.width, this.height);
  }
}

class Obstacle {
  constructor() {
    this.width = 20;
    this.height = 50;
    this.x = width;
  }
  
  update() {
    this.x -= gameSpeed;
  }
  
  show() {
    fill(0);
    rect(this.x, height - this.height, this.width, this.height);
  }
  
  isOffscreen() {
    return this.x + this.width < 0;
  }
}