var path, mainCyclist;
var pathImg, mainRacerImg1, mainRacerImg2;
var bellSound;
var pinkCG, yellowCG, redCG, obstCG;
var gameOverThing, gameOverImg;

var END = 0;
var PLAY = 1;
var gameState = PLAY;

var distance = 0;

function restart() {
  distance = 0;  
  pinkCG.setLifetimeEach(0); redCG.setLifetimeEach(0); yellowCG.setLifetimeEach(0); obstCG.setLifetimeEach(0);
  mainCyclist.changeAnimation("SahilRunning", mainRacerImg1); path.velocityX=-5;
  gameState = PLAY;
}
function setRestart(event) {if (gameState === END && event.key == "ArrowUp") {restart();}}

function preload() {
  obst1 = loadImage("images/obstacle1.png");
  obst2 = loadImage("images/obstacle2.png");
  obst3 = loadImage("images/obstacle3.png");
  gameOverImg = loadImage("images/gameOver.png");
  bellSound = loadSound("sound/bell.mp3");
  pathImg = loadImage("images/Road.png");
  mainRacerImg1 = loadAnimation("images/mainPlayer1.png", "images/mainPlayer2.png");
  mainRacerImg2 = loadAnimation("images/mainPlayer3.png");
  pinkBike = loadAnimation("images/opponent1.png", "images/opponent2.png"); pinkBikeDead = loadAnimation("images/opponent3.png")
  yellowBike = loadAnimation("images/opponent4.png", "images/opponent5.png");
  redBike = loadAnimation("images/opponent7.png", "images/opponent8.png")

}

function setup() {

  createCanvas(500, 300);

  //Adding an Event to play the bell sound and Restart
  window.addEventListener("keydown", (event) => {if (event.key == " "){bellSound.play()}}); 
    window.addEventListener("keydown", setRestart);
  


  // Moving background
  path = createSprite(100, 150);
  path.addImage(pathImg);
  path.velocityX = -5;

  //creating boy running
  mainCyclist = createSprite(70, 150, 20, 20);
  mainCyclist.addAnimation("SahilRunning", mainRacerImg1);
  mainCyclist.addAnimation("collided", mainRacerImg2)
  mainCyclist.scale = 0.052;
  
  //Creating Groups
  pinkCG=createGroup();
  yellowCG=createGroup();
  redCG=createGroup();
  obstCG = createGroup();
  
  //Adding the Colliders
  mainCyclist.setCollider("rectangle", 0,0,mainCyclist.width,mainCyclist.height);
  mainCyclist.debug=false;
  
  GameOverThing = createSprite(250,150);
  GameOverThing.addAnimation("gameOver", gameOverImg);
}

function draw() {
  background(0);
  drawSprites();
  GameOverThing.visible = false;

  if (gameState === PLAY) {
    path.velocityX -= distance/5000;
    textSize(20);
    fill(255);
    distance+=0.05;
    text("Distance: " + parseInt(distance*20), 350, 30);
    if (distance*1.2 % Math.random()*8 <= (distance/10)/(distance+1000)) {console.log("called");addObstacle();}
    if(World.frameCount%80===0){addOpponent();}
    mainCyclist.y = World.mouseY;

    edges = createEdgeSprites();
    mainCyclist.collide(edges);
    
    //Checking if they lost
    if(pinkCG.isTouching(mainCyclist) || redCG.isTouching(mainCyclist) || mainCyclist.isTouching(yellowCG) || obstCG.isTouching(mainCyclist)) {
      gameState = END; mainCyclist.changeAnimation("collided", mainRacerImg2); pinkCG.setVelocityXEach(0); yellowCG.setVelocityXEach(0); redCG.setVelocityXEach(0); obstCG.setVelocityXEach(0); path.velocityX=0;
    }

    //code to reset the background
    if (path.x < 20) {
      path.x = width / 2;
    }

  } else if (gameState === END) {
    GameOverThing.visible = true;
    fill("white"); textSize(15);
    text("Click Up Arrow to Restart", 200, 100, 200, 100);
  }
}
function addObstacle() {
  let obstY = (Math.random()*250)+25;
  let Obstacle = createSprite(650, obstY, 10, 10);
  Obstacle.setLifetime = 200;
  Obstacle.velocityX = -((distance/20) + 1);
  Obstacle.setCollider("rectangle", 0, 0, Obstacle.width, Obstacle.height);
  let randomNumber = Math.floor(Math.random()*3);
  switch(randomNumber) {
         case 1: Obstacle.addImage("ob1", obst1); break;
         case 2: Obstacle.addImage("ob3", obst3); break;
         case 0: Obstacle.addImage("ob2", obst2); break;
         default:break;}
  Obstacle.scale = 0.05;
  obstCG.add(Obstacle);
}
function addOpponent() {
  let randomNumber = Math.floor(Math.random()*3)
  switch(randomNumber) {
         case 1: makePink(); break;
         case 2: makeRed(); break;
         case 0: makeYellow(); break;
         default:break;}}

function makePink() {
  let SpriteY = (Math.random()*251)+25;
  let SpriteX = (Math.random()*100)+200;
  let Sprite = createSprite(SpriteX, SpriteY, 10,10);
  Sprite.scale = 0.07;
  Sprite.addAnimation("pinkAnimation", pinkBike);
  Sprite.addAnimation("pinkDead", pinkBikeDead);
  Sprite.setLifetime=200;
  Sprite.velocityX = -(4+distance/80);Sprite.setCollider("rectangle",0,0,Sprite.width,Sprite.height)
  pinkCG.add(Sprite);
}

function makeYellow() {
  let SpriteY = (Math.random()*201)+50;
  let SpriteX = (Math.random()*100)+250;
  let Sprite = createSprite(SpriteX, SpriteY, 10,10);
  Sprite.scale = 0.05;
  Sprite.addAnimation("yellowAnimation", yellowBike);
  Sprite.setLifetime=200
  Sprite.velocityX = -6;
Sprite.setCollider("rectangle",0,0,Sprite.width,Sprite.height)
  yellowCG.add(Sprite);
}

function makeRed() {
  let SpriteY = (Math.random()*101)+20;
  let SpriteX = (Math.random()*130)+350;
  let Sprite = createSprite(SpriteX, SpriteY, 10,10);
  Sprite.scale = 0.06;
  Sprite.addAnimation("redAnimation", redBike);
  Sprite.setLifetime=200
  Sprite.velocityX = -(distance/30);Sprite.setCollider("rectangle",0,0,Sprite.width,Sprite.height)
  redCG.add(Sprite);
}