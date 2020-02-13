let video;
let poseNet;
let poses = [];
let ballx, bally;
let ballxv, ballyv;
let Lrecty, Rrecty;
var gameScreen = 0;
var Lscore;
var Rscore;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  ballx = width / 2;
  bally = height / 2;
  ballxv = -5;
  ballyv = 2;

  Lrecty = height / 2;
  Rrecty = height / 2;

  Lscore = 0;
  Rscore = 0;

  poseNet = ml5.poseNet(video, modelReady);

  poseNet.on('pose', function(results) {
    poses = results;
  });
  
  video.hide();

  rectMode(CENTER);
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function draw() {
  if (gameScreen == 0) {
    initScreen();
  } else if (gameScreen == 1) {
    gameplayScreen();
  } else if (gameScreen == 2) {
    gameLWinScreen();
  } else if (gameScreen == 3) {
    gameRWinScreen();
  }
}

function initScreen() {
  background(225);
  textAlign(CENTER, CENTER);
  fill(22, 146, 212);
  textSize(50);
  text("Nose Pong", width / 2, height / 2);

  fill(100, 120, 80);
  textSize(30);
  text("Click to Start", width / 2, height - 80);
  textSize(20);
  text("After Model Loaded", width / 2, height - 110);
}

function gameplayScreen() {
  image(video, 0, 0, width, height);

  fill(255);
  ellipse(ballx, bally, 20);

  ballx += ballxv;
  bally += ballyv;

  for (i = 0; i < poses.length; i++) {
    if (poses.length >= 2) {
      rect(20, Lrecty, 10, 50);
      rect(width - 20, Rrecty, 10, 50);

      if (poses[0].pose.nose.x < poses[1].pose.nose.x) {
        Lrecty = poses[0].pose.nose.y
        Rrecty = poses[1].pose.nose.y
      }
    } else {
      rect(20, Lrecty, 10, 50);
      rect(width - 20, Rrecty, 10, 50);
      Lrecty = Rrecty = poses[0].pose.nose.y
    }
  }

  fill(0, 0, 255);
  textSize(30);
  text("LScore:", 70, 40);
  text(Lscore, 140, 40);
  text("RScore:", 530, 40);
  text(Rscore, 600, 40);

  if (bally < 10) {
    ballyv = -ballyv;
  }
  if (bally > height - 10) {
    ballyv = -ballyv;
  }

  if (ballx < 35) {
    if (bally < Lrecty + 25 && bally > Lrecty - 25) {
      ballxv = -ballxv;
    }
  }

  if (ballx > width - 35) {
    if (bally < Rrecty && bally > Rrecty - 25) {
      ballxv = -ballxv;
    }
  }

  if (ballx < 0) {
    ballx = width / 2;
    bally = height / 2;
    Rscore = Rscore + 1;
  }

  if (ballx > width) {
    ballx = width / 2;
    bally = height / 2;
    Lscore = Lscore + 1;
  }

  if (Lscore == 5) {
    Lscore = 0;
    Rscore = 0;
    gameScreen = 2;
  }

  if (Rscore == 5) {
    Lscore = 0;
    Rscore = 0;
    gameScreen = 3;
  }
}

function gameLWinScreen() {
  background(225);
  fill(255, 0, 0);
  textSize(50);
  text("Left Player Win!", 300, 250);
  fill(100, 120, 80);
  textSize(30);
  text("Click to Start Again", width / 2, height - 80);
  textAlign(CENTER, CENTER);
}

function gameRWinScreen() {
  background(225);
  fill(255, 0, 0);
  textSize(50);
  text("Right Player Win!", 300, 250);
  textSize(30);
  text("Click to Start Again", width / 2, height - 80);
  textAlign(CENTER, CENTER);
}

function mousePressed() {
  if (gameScreen == 0 || gameScreen == 2 || gameScreen == 3) {
    gameScreen = 1;
  }
}
