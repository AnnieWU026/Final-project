// Basic canvas settings
let canvasWidth = 500;
let canvasHeight = 500;

// Game state
// story1 → story2 → story3 → play1 → midstory → play2 → boss → win → gameover
let gameState = "story1";

// Audio control
let audioStarted = false;

// Player variables
let playerX, playerY;
let playerWidth = 40;
let playerHeight = 60;
let playerSpeed = 5;
let playerLives = 5;

// Bullet system variables
let bullets = [];
let maxBullets = 8;
let currentAmmo = 8;
let bulletSpeed = 8;
let isReloading = false;
let reloadTime = 180; // 3 seconds at 60fps
let reloadCounter = 0;

// Monster variables
let monsterX, monsterY;
let monsterWidth = 50;
let monsterHeight = 40;
let monsterSpeedX = 0;
let monsterSpeedY = 2;

// Game progress variables
let score = 0;
let kills = 0;

// Boss variables
let bossHealth = 50;
let bossActive = false;
let bossBullets = [];
let bossBulletSpeed = 5;
let bossFireRate = 90;
let bossDirection = 1;
let bossX = 0;
let bossY = 90;

// AI companion variables
let aiActive = false;
let aiShip = null;
let aiWidth = 30;
let aiHeight = 50;

// Secret door (hidden level)
let secretDoor = { x: 460, y: 20, size: 20 };

// Image and sound variables
let playerImg, monsterImg, bossImg, aiImg, backgroundImg;
let storyImages = [], midStoryImg, winImg;
let bgMusic;

// Preload assets
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

// Setup canvas and initial positions
function setup() {
  createCanvas(canvasWidth, canvasHeight);
  initPlayer();
  initMonster();
  bossX = width / 2 - 60;
}

// Initialize player position
function initPlayer() {
  playerX = width / 2;
  playerY = height - 80;
}

// Initialize monster position
function initMonster() {
  monsterX = random(50, width - 50);
  monsterY = -50;
  monsterSpeedX = random([-2, 2]);
  monsterSpeedY = 2;
}

// Main draw loop
function draw() {
  background(0);

  if (gameState.startsWith("story")) { drawStoryPage(); return; }
  if (gameState === "midstory") { drawMidStory(); return; }
  if (gameState === "win") { drawWinScreen(); return; }
  if (gameState === "gameover") { drawGameOver(); return; }
  if (gameState === "gameoverBoss") { drawGameOverBoss(); return; }
  if (gameState === "boss") { drawBossFight(); return; }

  drawGameplay();
}

// Display story pages
function drawStoryPage() {
  let index = int(gameState.replace("story", "")) - 1;
  image(storyImages[index], 0, 0, width, height);
}

// Display mid-story
function drawMidStory() { image(midStoryImg, 0, 0, width, height); }

// Display win screen
function drawWinScreen() { image(winImg, 0, 0, width, height); }

// Game over for normal gameplay
function drawGameOver() {
  background(0);
  fill(255);
  textAlign(CENTER);
  textSize(36);
  text("GAME OVER", width / 2, height / 2 - 20);
  textSize(16);
  text("Click to Restart", width / 2, height / 2 + 20);
}

// Game over specifically for boss fight
function drawGameOverBoss() {
  background(0);
  fill(255,0,0);
  textAlign(CENTER);
  textSize(36);
  text("GAME OVER", width / 2, height / 2 - 20);
  textSize(16);
  text("Click to Restart BOSS Fight", width / 2, height / 2 + 20);
}

// Gameplay rendering
function drawGameplay() {
  image(backgroundImg, 0, 0, width, height);

  updatePlayer();
  updateReloadSystem();
  updateBullets();
  updateMonster();
  updateAI();
  drawUI();
  checkGameProgress();

  if (gameState === "play2") drawSecretDoor();
}

// Update player movement and constrain position
function updatePlayer() {
  if (keyIsDown(65)) playerX -= playerSpeed; // A key
  if (keyIsDown(68)) playerX += playerSpeed; // D key
  if (keyIsDown(87)) playerY -= playerSpeed; // W key
  if (keyIsDown(83)) playerY += playerSpeed; // S key

  playerX = constrain(playerX, 0, width - playerWidth);
  playerY = constrain(playerY, 0, height - playerHeight);

  image(playerImg, playerX, playerY, playerWidth, playerHeight);
}

// Update bullets for player and AI
function updateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].y -= bulletSpeed;
    fill(255, 255, 0);
    noStroke();
    rect(bullets[i].x, bullets[i].y, 4, 10);

    // Collision with monster
    if (!bossActive && dist(bullets[i].x, bullets[i].y, monsterX, monsterY) < 30) {
      bullets.splice(i, 1);
      handleMonsterHit();
      continue;
    }

    // Collision with boss
    if (bossActive && dist(bullets[i].x, bullets[i].y, bossX + 60, bossY + 60) < 60) {
      bullets.splice(i, 1);
      handleBossHit();
      continue;
    }

    if (bullets[i] && bullets[i].y < 0) bullets.splice(i, 1);
  }
}

// Handle reload system
function updateReloadSystem() {
  if (isReloading) {
    reloadCounter--;
    if (reloadCounter <= 0) {
      isReloading = false;
      currentAmmo = maxBullets;
    }
  }
}

// Monster behavior and collision
function updateMonster() {
  if (bossActive) return;

  monsterY += monsterSpeedY;
  monsterX += monsterSpeedX;
  if (monsterX < 0 || monsterX > width - monsterWidth) monsterSpeedX *= -1;

  if (monsterY > height) { playerLives--; checkPlayerDeath(); resetMonster(); }
  if (dist(playerX, playerY, monsterX, monsterY) < 40) { playerLives--; checkPlayerDeath(); resetMonster(); }

  image(monsterImg, monsterX, monsterY, monsterWidth, monsterHeight);
}

function handleMonsterHit() { kills++; score++; resetMonster(); }
function resetMonster() { 
  monsterX = random(50, width - 50); 
  monsterY = -50; 
  monsterSpeedX = random([-2,2]); 
  monsterSpeedY = (gameState==="play2"?3:2); 
}

// Boss fight
function drawBossFight() {
  image(backgroundImg, 0, 0, width, height);
  updatePlayer();
  updateReloadSystem();
  updateBullets();

  // Boss horizontal movement
  bossX += bossDirection * 2;
  if (bossX < 0 || bossX > width - 120) bossDirection *= -1;

  image(bossImg, bossX, bossY, 120, 120);

  // Boss firing three bullets
  if (frameCount % bossFireRate === 0) {
    bossBullets.push({ x: bossX + 30, y: bossY + 60 });
    bossBullets.push({ x: bossX + 60, y: bossY + 60 });
    bossBullets.push({ x: bossX + 90, y: bossY + 60 });
  }

  // Boss bullets update and collision with player
  for (let i = bossBullets.length - 1; i >= 0; i--) {
    bossBullets[i].y += bossBulletSpeed;
    fill(255,0,0);
    noStroke();
    rect(bossBullets[i].x, bossBullets[i].y, 6, 12);

    if (dist(bossBullets[i].x, bossBullets[i].y, playerX + playerWidth / 2, playerY + playerHeight / 2) < 30) {
      playerLives--;
      checkPlayerDeathBoss();
      bossBullets.splice(i, 1);
    } else if (bossBullets[i].y > height) bossBullets.splice(i, 1);
  }

  drawUI();
}

// Boss hit logic
function handleBossHit() {
  bossHealth--;
  if (bossHealth <= 0) {
    bossActive = false;
    aiActive = true;
    gameState = "play2";
  }
}

// Player death specifically for boss fight
function checkPlayerDeathBoss() {
  if (playerLives <= 0) gameState = "gameoverBoss";
}

// Restart boss fight after death
function restartBossFight() {
  playerLives = 5;
  bullets = [];
  currentAmmo = maxBullets;
  isReloading = false;
  reloadCounter = 0;
  bossHealth = 50;
  bossActive = true;
  bossBullets = [];
  bossX = width / 2 - 60;
  bossDirection = 1;
  gameState = "boss";
}

// AI companion behavior
function updateAI() {
  if (!aiActive) return;

  if (!aiShip) { aiShip = { x: width / 2, y: height - 100, dir: 1 }; }

  // AI horizontal movement
  aiShip.x += aiShip.dir * 2;
  if (aiShip.x < 50 || aiShip.x > width - 50) aiShip.dir *= -1;

  // AI shooting bullets
  if (frameCount % 30 === 0 && bullets.length < 50) bullets.push({ x: aiShip.x + 15, y: aiShip.y });

  image(aiImg, aiShip.x, aiShip.y, aiWidth, aiHeight);
}

// Secret door logic
function drawSecretDoor() {
  fill(0,255,255,150);
  rect(secretDoor.x, secretDoor.y, secretDoor.size, secretDoor.size);

  if (!bossActive && playerX > secretDoor.x - 20 && playerX < secretDoor.x + 20 && playerY < secretDoor.y + 30) {
    bossActive = true;
    gameState = "boss";
  }
}

// UI rendering
function drawUI() {
  fill(255);
  textSize(14);
  text("Score: "+score,10,20);
  text("Lives: "+playerLives,10,40);
  text("Kills: "+kills,10,60);
  text("Ammo: "+currentAmmo,10,80);
  if (isReloading) text("Reloading...",10,100);
}

// Check game progress for level transition
function checkGameProgress() {
  if (gameState === "play1" && kills >= 30) gameState = "midstory";
  if (gameState === "play2" && kills >= 50) gameState = "win";
}

// Player death check for normal levels
function checkPlayerDeath() { if (playerLives <= 0) gameState = "gameover"; }

// Player input for shooting
function keyPressed() {
  if (key === " " && !isReloading && currentAmmo > 0) {
    bullets.push({ x: playerX + playerWidth / 2, y: playerY });
    currentAmmo--;
    if (currentAmmo === 0) { isReloading = true; reloadCounter = reloadTime; }
  }
}

// Mouse click input handling
function mousePressed() {
  if (!audioStarted) { userStartAudio(); bgMusic.loop(); audioStarted = true; }

  if (gameState.startsWith("story")) {
    let nextStory = parseInt(gameState.replace("story","")) + 1;
    if (nextStory <= storyImages.length) gameState = "story"+nextStory;
    else gameState = "play1";
  } else if (gameState === "midstory") gameState = "play2";
  else if (gameState === "gameover") restartGame();
  else if (gameState === "gameoverBoss") restartBossFight();
}

// Reset entire game
function restartGame() {
  gameState = "story1";
  playerLives = 5;
  score = 0;
  kills = 0;
  bullets = [];
  currentAmmo = maxBullets;
  isReloading = false;
  reloadCounter = 0;
  bossHealth = 50;
  bossActive = false;
  bossBullets = [];
  aiActive = false;
  aiShip = null;
  bossX = width / 2 - 60;
  bossDirection = 1;
  initPlayer();
  initMonster();
}
