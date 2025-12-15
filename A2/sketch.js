// BASIC CANVAS SETTINGS
let canvasWidth = 500;
let canvasHeight = 500;

// GAME STATE MANAGEMENT
let gameState = "story1"; 
// story1 → story2 → story3 → play1 → midstory → play2 → boss → win

// PLAYER VARIABLES
let playerX;
let playerY;
let playerWidth = 40;
let playerHeight = 60;
let playerSpeed = 5;
let playerLives = 5;

// BULLET SYSTEM VARIABLES
let bullets = [];
let maxBullets = 8;
let bulletSpeed = 8;
let isReloading = false;
let reloadTime = 300;
let reloadCounter = 0;

// MONSTER VARIABLES
let monsterX;
let monsterY;
let monsterWidth = 50;
let monsterHeight = 40;
let monsterSpeedX = 0;
let monsterSpeedY = 2;

// GAME PROGRESS VARIABLES
let score = 0;
let kills = 0;

// BOSS VARIABLES
let bossHealth = 50;
let bossActive = false;

// AI COMPANION VARIABLES
let aiActive = false;
let aiShip = null;
let aiWidth = 30;
let aiHeight = 50;

// IMAGE & SOUND VARIABLES (YOU NEED TO PREPARE THESE)
let playerImg;
let monsterImg;
let bossImg;
let aiImg;
let backgroundImg;
let storyImages = [];
let midStoryImg;
let winImg;
let bgMusic;

function preload() {
  playerImg = loadImage("player_ship.png");
  monsterImg = loadImage("monster.png");
  bossImg = loadImage("boss.png");
  aiImg = loadImage("ai_ship.png");
  backgroundImg = loadImage("background.png");
  storyImages[0] = loadImage("story1.png");
  storyImages[1] = loadImage("story2.png");
  storyImages[2] = loadImage("story3.png");
  midStoryImg = loadImage("midstory.png");
  winImg = loadImage("win.png");
  bgMusic = loadSound("music.mp3");
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  initPlayer();
  initMonster();
}

// INITIALIZATION FUNCTIONS
function initPlayer() {
  playerX = width / 2;
  playerY = height - 80;
}

function initMonster() {
  monsterX = random(50, width - 50);
  monsterY = -50;
  monsterSpeedX = random([-2, 2]);
  monsterSpeedY = 2;
}

// MAIN DRAW LOOP
function draw() {
  background(0);
  playBackgroundMusic();

  if (gameState.startsWith("story")) {
    drawStoryPage();
    return;
  }

  if (gameState === "midstory") {
    drawMidStory();
    return;
  }

  if (gameState === "win") {
    drawWinScreen();
    return;
  }

  drawGameplay();
}

// BACKGROUND MUSIC
function playBackgroundMusic() {
  if (bgMusic && !bgMusic.isPlaying()) {
    bgMusic.loop();
  }
}

// STORY DRAWING
function drawStoryPage() {
  let index = int(gameState.replace("story", "")) - 1;
  image(storyImages[index], 0, 0, width, height);
}

function drawMidStory() {
  image(midStoryImg, 0, 0, width, height);
}

function drawWinScreen() {
  image(winImg, 0, 0, width, height);
}

// GAMEPLAY DRAWING
function drawGameplay() {
  image(backgroundImg, 0, 0, width, height);
  updatePlayer();
  updateBullets();
  updateMonster();
  updateBoss();
  updateAI();
  drawUI();
  checkGameProgress();
}

// PLAYER SYSTEM
function updatePlayer() {
  handlePlayerMovement();
  drawPlayer();
}

function handlePlayerMovement() {
  if (keyIsDown(65)) playerX -= playerSpeed;
  if (keyIsDown(68)) playerX += playerSpeed;
  if (keyIsDown(87)) playerY -= playerSpeed;
  if (keyIsDown(83)) playerY += playerSpeed;
  playerX = constrain(playerX, 0, width - playerWidth);
  playerY = constrain(playerY, 0, height - playerHeight);
}

function drawPlayer() {
  image(playerImg, playerX, playerY, playerWidth, playerHeight);
}

// BULLET SYSTEM
function updateBullets() {
  updateReloadSystem();
  moveBullets();
  checkBulletCollision();
}

function updateReloadSystem() {
  if (isReloading) {
    reloadCounter--;
    if (reloadCounter <= 0) {
      isReloading = false;
      bullets = [];
    }
  }
}

function moveBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].y -= bulletSpeed;
    rect(bullets[i].x, bullets[i].y, 4, 10);
    if (bullets[i].y < 0) {
      bullets.splice(i, 1);
    }
  }
}

function checkBulletCollision() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    if (!bossActive && dist(bullets[i].x, bullets[i].y, monsterX, monsterY) < 30) {
      bullets.splice(i, 1);
      handleMonsterHit();
      return;
    }
    if (bossActive && dist(bullets[i].x, bullets[i].y, width / 2, 150) < 60) {
      bullets.splice(i, 1);
      handleBossHit();
      return;
    }
  }
}

// MONSTER SYSTEM
function updateMonster() {
  if (bossActive) return;
  moveMonster();
  drawMonster();
  checkMonsterCollision();
}

function moveMonster() {
  monsterY += monsterSpeedY;
  monsterX += monsterSpeedX;
  if (monsterX < 0 || monsterX > width - monsterWidth) {
    monsterSpeedX *= -1;
  }
  if (monsterY > height) {
    playerLives--;
    resetMonster();
  }
}

function drawMonster() {
  image(monsterImg, monsterX, monsterY, monsterWidth, monsterHeight);
}

function checkMonsterCollision() {
  if (dist(playerX, playerY, monsterX, monsterY) < 40) {
    playerLives--;
    resetMonster();
  }
}

function handleMonsterHit() {
  kills++;
  score++;
  resetMonster();
}

function resetMonster() {
  monsterX = random(50, width - 50);
  monsterY = -50;
  monsterSpeedX = random([-2, 2]);
  monsterSpeedY = gameState === "play2" ? 3 : 2;
}

// BOSS SYSTEM
function updateBoss() {
  if (!bossActive) return;
  image(bossImg, width / 2 - 60, 90, 120, 120);
}

function handleBossHit() {
  bossHealth--;
  if (bossHealth <= 0) {
    bossActive = false;
    aiActive = true;
    gameState = "play2";
  }
}

// AI SYSTEM
function updateAI() {
  if (!aiActive) return;
  if (!aiShip) {
    aiShip = { x: random(100, 400), y: height - 100 };
  }
  aiShip.x += random([-2, 2]);
  if (frameCount % 30 === 0) {
    bullets.push({ x: aiShip.x + 15, y: aiShip.y });
  }
  image(aiImg, aiShip.x, aiShip.y, aiWidth, aiHeight);
}

// UI SYSTEM
function drawUI() {
  fill(255);
  textSize(14);
  text("Score: " + score, 10, 20);
  text("Lives: " + playerLives, 10, 40);
  text("Kills: " + kills, 10, 60);
  text("Ammo: " + (maxBullets - bullets.length), 10, 80);
}

// GAME PROGRESS
function checkGameProgress() {
  if (gameState === "play1" && kills >= 30) {
    gameState = "midstory";
  }
  if (gameState === "play2" && kills >= 50) {
    gameState = "win";
  }
}

// INPUT SYSTEM
function keyPressed() {
  if (key === " " && bullets.length < maxBullets && !isReloading) {
    bullets.push({ x: playerX + 20, y: playerY });
  }
  if (bullets.length >= maxBullets) {
    isReloading = true;
    reloadCounter = reloadTime;
  }
}

function mousePressed() {
  if (gameState === "story1") gameState = "story2";
  else if (gameState === "story2") gameState = "story3";
  else if (gameState === "story3") gameState = "play1";
  else if (gameState === "midstory") gameState = "play2";
}
