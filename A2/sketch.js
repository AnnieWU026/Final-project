function setup() {
  createCanvas(500, 500);
  playerX = width/2;
  playerY = height-80;
  monsterX = random(50, width-50);
  monsterY = -50;
}

let bgImg;
let playerX, playerY;
let bullets = [];
let monsterX, monsterY;
let score = 0;
let lives = 5;

let bulletCount = 0;
let canShoot = true;
let reloadTime = 5000;
let lastReload = 0;

let gameState = "start";
let lastScore = null;

function preload() {
  bgImg = loadImage("P.png");
}

function draw() {
 // generates a background
 // needs this otherwise a strange display  
background(0);
 image(bgImg, 0, 0, width, height);

if(gameState=="start"){
  fill(0); 
  textSize(40);
  textAlign(CENTER,CENTER);
  text("Space Rescue", width/2, height/2-100); 

  textSize(20);
  // what makes the game more interesting
  // instructions for the player
  text("Use W/S + arrow keys to move", width/2, height/2-40);
  text("Press SPACE to shoot, 10 shots then 5s reload", width/2, height/2-10);
  text("Click to start", width/2, height/2+30);
  return;
}

  if(gameState=="over"){
    // the vide helped me understand this
    fill(255,0,0);
    textAlign(CENTER,CENTER);
    textSize(50);
    text("GAME OVER", width/2, height/2);
    textSize(30);
    text("Score: "+score, width/2, height/2+60);

    if(lastScore != null){
      textSize(20);
      if(score > lastScore){
        text("Beat last score! (" + lastScore + ")", width/2, height/2+100);
      } else if(score < lastScore){
        text("Last score was " + lastScore, width/2, height/2+100);
      } else {
        text("Same as last score: " + lastScore, width/2, height/2+100);
      }
    }

    textSize(20);
    text("Click to restart", width/2, height/2+140);
    return;
  }

  // Player
  fill(0,150,255);
  ellipse(playerX, playerY, 40,60);
  fill(255);
  triangle(playerX-25,playerY+10,playerX-10,playerY,playerX-25,playerY-10);
  triangle(playerX+25,playerY+10,playerX+10,playerY,playerX+25,playerY-10);
  fill(180,220,255);
  ellipse(playerX, playerY-10, 20,25);
  fill(255,255,120);
  ellipse(playerX, playerY+20, 10,10);

  // Monster
  fill(255,50,50);
  ellipse(monsterX, monsterY, 60,50);
  fill(255);
  ellipse(monsterX-15, monsterY-10, 10);
  ellipse(monsterX+15, monsterY-10, 10);
  fill(0);
  ellipse(monsterX-15, monsterY-10, 5);
  ellipse(monsterX+15, monsterY-10, 5);
  fill(0,200);
  triangle(monsterX-30,monsterY,monsterX-40,monsterY-10,monsterX-40,monsterY+10);
  triangle(monsterX+30,monsterY,monsterX+40,monsterY-10,monsterX+40,monsterY+10);

monsterY += 1;
  if(monsterY>height){
    lives--;
    monsterY=-50;
    monsterX=random(50, width-50);
  }

  // Bullets
  for(let i=bullets.length-1; i>=0; i--){
    bullets[i].y -=7;
    fill(255,255,0);
    rect(bullets[i].x, bullets[i].y,4,10);

    if(dist(bullets[i].x, bullets[i].y, monsterX, monsterY)<30){
      score++;
      monsterY=-50;
      monsterX=random(50, width-50);
      bullets.splice(i,1);
    } else if(bullets[i].y<0){
      bullets.splice(i,1);
    }
  }

  // Player movement
  if(keyIsDown(LEFT_ARROW)) playerX-=5;
  if(keyIsDown(RIGHT_ARROW)) playerX+=5;
  if(keyIsDown(87)) playerY-=5; // W
  if(keyIsDown(83)) playerY+=5; // S
  playerX=constrain(playerX,20,width-20);
  playerY=constrain(playerY,20,height-20);

  // Monster hits player
  if(dist(playerX,playerY,monsterX,monsterY)<50){
    lives--;
    monsterY=-50;
    monsterX=random(50,width-50);
  }

  // UI
  fill(255,165,0);
  textSize(20);
  textAlign(LEFT, TOP);
  text("Score:"+score,10,10);
  text("Lives:"+lives,10,35);

  // Reload
  if(!canShoot){
    fill(255,0,0);
    textSize(20);
    text("Reloading...", 350,35);
    if(millis()-lastReload>=reloadTime){
      canShoot=true;
      bulletCount=0;
    }
  }

  if(lives<=0) gameState="over";
}

function keyPressed(){
  if(key===" "&& canShoot){
    bullets.push({x:playerX,y:playerY-30});
    bulletCount++;
    if(bulletCount>=10){
      canShoot=false;
      lastReload=millis();
    }
  }
}

function mousePressed(){
  if(gameState=="start") gameState="play";
  if(gameState=="over"){
    lastScore = score; 
    score=0;
    lives=5;
    monsterX=random(50,width-50);
    monsterY=-50;
    bullets=[];
    gameState="play";
  }
}