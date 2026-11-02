// Feed the Dragon: scoop food, then carry it gently to the dragon.
// The spoon position means the center of its round end, not the handle.

let spoonX = 470;
let spoonY = 255;
let spoonDragging = false;
let spoonOffsetX = 0;
let spoonOffsetY = 0;
let spoonHasFood = false;
let dragonResult = "idle"; // idle, spilled, missed, fed, or complete
let dragonMessage = "Scoop cake, then follow the dots slowly.";
let lastSpoonMoveTime = 0;
let spillStartedAt = 0;
let dragonRoundFinishedAt = 0;
let dragonFeedsCompleted = 0;
let dragonGuidePattern = 0;

const bowlX = 300;
const bowlY = 330;
const mouthX = 690;
const mouthY = 334;
const safeSpoonSpeed = 1400; // pixels per second
const dragonFeedsNeeded = 3;
const dragonCenterButton = { x: 370, y: 322, width: 220, height: 58 };

let scoopSound;
let spillSound;
let successSound;

function preload() {
  scoopSound = loadSound("assets/sounds/pluck_001.wav");
  spillSound = loadSound("assets/sounds/drop_001.wav");
  successSound = loadSound("assets/sounds/confirmation_002.wav");
}

function resetFeedTheDragon() {
  dragonFeedsCompleted = 0;
  dragonGuidePattern = 0;
  resetDragonRound();
}

function resetDragonRound() {
  spoonX = 470;
  spoonY = 255;
  spoonDragging = false;
  spoonHasFood = false;
  dragonResult = "idle";
  dragonMessage = "Scoop cake, then follow the dots slowly.";
  lastSpoonMoveTime = 0;
  spillStartedAt = 0;
  dragonRoundFinishedAt = 0;
}

function startNextDragonRound() {
  dragonGuidePattern = (dragonGuidePattern + 1) % 3;
  resetDragonRound();
}

function drawFeedTheDragon() {
  updateDragonRound();
  drawDragonDirections();
  drawDragonProgressBar();
  drawDragonGuidePath();
  drawFoodBowl();
  drawSmallDragon();
  drawSpoon();
  if (dragonResult === "spilled") drawSpilledFood();

  noStroke();
  fill("#6B4B3D");
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(15);
  text("CAKE PLATE", bowlX, 420);
  text("DRAGON'S MOUTH", 700, 420);

  if (dragonResult === "fed") {
    fill("#2F884B");
  } else if (dragonResult === "spilled" || dragonResult === "missed") {
    fill("#C54D46");
  } else {
    fill("#59433A");
  }

  textSize(18);
  text(dragonMessage, HUD_WIDTH / 2, 455);
  textStyle(NORMAL);

  if (dragonResult === "spilled" || dragonResult === "missed") {
    drawDragonFailureScreen();
  } else if (dragonResult === "complete") {
    drawDragonCompleteScreen();
  }
}

function updateDragonRound() {
  if (
    dragonResult === "fed" &&
    millis() - dragonRoundFinishedAt >= 900
  ) {
    startNextDragonRound();
  }
}

function drawDragonDirections() {
  noStroke();
  fill("#FFF0BF");
  rect(132, 146, 696, 42, 18);

  fill("#59433A");
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(14);
  text("1. SCOOP CAKE   2. FOLLOW THE DOTS SLOWLY   3. FEED 3 TIMES", 480, 167);
  textStyle(NORMAL);
}

function drawDragonProgressBar() {
  const barX = 150;
  const barY = 202;
  const barWidth = 230;
  const barHeight = 18;
  const filledWidth =
    (barWidth * dragonFeedsCompleted) / dragonFeedsNeeded;

  stroke("#7B584B");
  strokeWeight(2);
  fill("#FFFDF7");
  rect(barX, barY, barWidth, barHeight, 9);

  if (filledWidth > 0) {
    noStroke();
    fill("#74C365");
    rect(barX, barY, filledWidth, barHeight, 9);
  }

  noStroke();
  fill("#59433A");
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(13);
  text(
    "DRAGON FULL " + dragonFeedsCompleted + " / " + dragonFeedsNeeded,
    barX + barWidth / 2,
    barY + 31
  );
  textStyle(NORMAL);
}

function drawDragonGuidePath() {
  noStroke();
  fill("#D9B97E");

  for (let dot = 0; dot <= 22; dot++) {
    const amount = dot / 22;
    const baseX = lerp(bowlX, mouthX, amount);
    const baseY = lerp(bowlY + 12, mouthY, amount);
    let guideX = baseX;
    let guideY = baseY;

    if (dragonGuidePattern === 0) {
      guideY -= 70 * sin(amount * PI);
    } else if (dragonGuidePattern === 1) {
      guideY -= 38 * sin(amount * TWO_PI * 1.5);
    } else {
      guideX += 32 * sin(amount * TWO_PI);
      guideY -= 55 * sin(amount * PI);
    }

    circle(guideX, guideY, 8);
  }
}

function drawFoodBowl() {
  // Simple cake pieces sit on a plate on the left side of the game area.
  noStroke();
  fill("#DCE3E5");
  ellipse(bowlX, bowlY + 34, 178, 54);
  fill("#FFFDF7");
  ellipse(bowlX, bowlY + 28, 154, 36);

  fill("#F6C56E");
  rect(bowlX - 58, bowlY - 8, 116, 48, 8);
  fill("#F47A8A");
  rect(bowlX - 58, bowlY - 8, 116, 15, 7);

  fill("#FFFDF7");
  circle(bowlX - 34, bowlY - 1, 5);
  circle(bowlX, bowlY + 1, 5);
  circle(bowlX + 34, bowlY - 1, 5);

  stroke("#7B858A");
  strokeWeight(3);
  noFill();
  arc(bowlX, bowlY + 29, 154, 34, 0, PI);
}

function drawSmallDragon() {
  // A simple orange dragon follows the storyboard's bowl-and-dragon layout.
  stroke("#8C5534");
  strokeWeight(3);
  fill("#F49B55");
  ellipse(712, 315, 152, 132);
  ellipse(746, 370, 116, 77);

  fill("#FFE89B");
  triangle(650, 274, 660, 232, 685, 262);
  triangle(714, 250, 733, 218, 742, 261);
  ellipse(748, 372, 63, 58);

  fill("#FFFDF7");
  circle(682, 301, 32);
  circle(730, 301, 32);

  noStroke();
  fill("#513B33");
  circle(689, 300, 12);
  circle(737, 300, 12);

  // The spoon must reach this visible, dark mouth.
  fill(dragonResult === "fed" ? "#C54D46" : "#6D3940");
  ellipse(mouthX, mouthY, 48, 31);
  fill("#F6C7B7");
  arc(mouthX, mouthY + 5, 22, 12, 0, PI);

  fill("#F49B55");
  stroke("#8C5534");
  strokeWeight(3);
  triangle(793, 355, 830, 330, 812, 378);

  noStroke();
  fill("#FFF0BF");
  rect(655, 208, 112, 35, 12);
  fill("#6B4B3D");
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(16);
  text(dragonResult === "fed" ? "YUM!" : "Feed me!", 711, 225);
  textStyle(NORMAL);
}

function drawSpoon() {
  // Handle points up and right, leaving the round end easy to drag.
  stroke("#7B858A");
  strokeWeight(13);
  line(spoonX + 14, spoonY - 10, spoonX + 62, spoonY - 62);

  stroke("#566166");
  strokeWeight(2);
  fill("#DCE3E5");
  ellipse(spoonX, spoonY, 53, 29);

  if (spoonHasFood) {
    noStroke();
    fill("#F6C56E");
    ellipse(spoonX, spoonY - 4, 35, 16);
    fill("#F47A8A");
    ellipse(spoonX, spoonY - 8, 28, 7);
  }
}

function drawSpilledFood(onFloor = false) {
  // Show a few simple food pieces falling from the spoon.
  const progress = onFloor
    ? 1
    : constrain((millis() - spillStartedAt) / 650, 0, 1);
  const foodX = onFloor ? constrain(spoonX, 190, 770) : spoonX;
  const fallDistance =
    progress * progress * max(12, min(70, 405 - spoonY));
  const foodY = onFloor ? 430 : spoonY + fallDistance;

  push();
  noStroke();
  fill("#F6C56E");
  ellipse(foodX - 14 - progress * 18, foodY, 18, 11);
  circle(foodX + 3, foodY + progress * 6, 12);
  circle(foodX + 24 + progress * 20, foodY + progress * 3, 10);

  fill("#F47A8A");
  circle(foodX + 15 + progress * 14, foodY - progress * 5, 9);
  pop();
}

function drawDragonFailureScreen() {
  noStroke();
  fill(255, 245, 217, 220);
  rect(108, 124, 744, 352, 30);

  if (dragonResult === "spilled") drawSpilledFood(true);

  stroke("#D9B97E");
  strokeWeight(4);
  fill("#FFFDF7");
  rect(276, 238, 408, 166, 24);

  noStroke();
  fill("#C54D46");
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(28);
  text(dragonResult === "spilled" ? "CAKE SPILLED!" : "MISSED THE MOUTH!", 480, 274);

  fill("#59433A");
  textSize(15);
  text("Your progress is back to 0. Follow the new path and try again.", 480, 302);
  textStyle(NORMAL);

  drawHudButton(dragonCenterButton, "TRY AGAIN", "#F47A5A");
}

function drawDragonCompleteScreen() {
  noStroke();
  fill(255, 245, 217, 230);
  rect(108, 124, 744, 352, 30);

  stroke("#74C365");
  strokeWeight(4);
  fill("#FFFDF7");
  rect(276, 238, 408, 166, 24);

  noStroke();
  fill("#2F884B");
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(29);
  text("THE DRAGON IS FULL!", 480, 274);

  fill("#59433A");
  textSize(16);
  text("You delivered 3 cake bites without spilling.", 480, 304);
  textStyle(NORMAL);

  drawHudButton(dragonCenterButton, "PLAY AGAIN", "#74C365");
}

function feedDragonResultMousePressed() {
  const showingResult =
    dragonResult === "spilled" ||
    dragonResult === "missed" ||
    dragonResult === "complete";

  if (!showingResult || !isInsideHudButton(mouseX, mouseY, dragonCenterButton)) {
    return false;
  }

  if (dragonResult === "complete") {
    resetFeedTheDragon();
  } else {
    startNextDragonRound();
  }
  return true;
}

function isOverDragonResultButton() {
  return (
    (dragonResult === "spilled" ||
      dragonResult === "missed" ||
      dragonResult === "complete") &&
    isInsideHudButton(mouseX, mouseY, dragonCenterButton)
  );
}

function feedDragonMousePressed() {
  if (dragonResult !== "idle") return;

  // The child can grab either the round end or the lower handle.
  const nearSpoon = dist(mouseX, mouseY, spoonX + 15, spoonY - 12) < 55;
  if (nearSpoon) {
    if (hudSoundOn) userStartAudio();
    spoonDragging = true;
    spoonOffsetX = mouseX - spoonX;
    spoonOffsetY = mouseY - spoonY;
    lastSpoonMoveTime = millis();
  }
}

function feedDragonMouseDragged() {
  if (!spoonDragging || dragonResult !== "idle") return;

  const newX = constrain(mouseX - spoonOffsetX, 157, 785);
  const newY = constrain(mouseY - spoonOffsetY, 215, 392);
  const now = millis();
  const seconds = max((now - lastSpoonMoveTime) / 1000, 0.016);
  const speed = dist(newX, newY, spoonX, spoonY) / seconds;

  spoonX = newX;
  spoonY = newY;
  lastSpoonMoveTime = now;

  if (!spoonHasFood && dist(spoonX, spoonY, bowlX, bowlY + 12) < 73) {
    spoonHasFood = true;
    dragonMessage = "Cake collected! Follow the dots slowly.";
    playDragonSound(scoopSound);
  } else if (
    spoonHasFood &&
    dist(spoonX, spoonY, bowlX, bowlY + 12) >= 73 &&
    speed > safeSpoonSpeed
  ) {
    dragonResult = "spilled";
    dragonFeedsCompleted = 0;
    dragonMessage = "Oops! The cake spilled.";
    spillStartedAt = now;
    spoonHasFood = false;
    spoonDragging = false;
    playDragonSound(spillSound);
  }
}

function feedDragonMouseReleased() {
  if (!spoonDragging || dragonResult !== "idle") return;
  spoonDragging = false;

  if (!spoonHasFood) {
    dragonMessage = "Scoop cake from the plate first.";
    return;
  }

  if (dist(spoonX, spoonY, mouthX, mouthY) < 39) {
    dragonFeedsCompleted += 1;
    spoonHasFood = false;
    playDragonSound(successSound);

    if (dragonFeedsCompleted >= dragonFeedsNeeded) {
      dragonResult = "complete";
      dragonMessage = "Great job! The dragon is full!";
    } else {
      dragonResult = "fed";
      dragonRoundFinishedAt = millis();
      dragonMessage =
        "Great! " + (dragonFeedsNeeded - dragonFeedsCompleted) + " cake bites to go.";
    }
  } else if (spoonX > 610) {
    dragonResult = "missed";
    dragonFeedsCompleted = 0;
    dragonMessage = "Missed the mouth.";
    spoonHasFood = false;
    playDragonSound(spillSound);
  } else {
    dragonMessage = "Keep following the dots slowly toward the dragon.";
  }
}

function playDragonSound(sound) {
  if (!hudSoundOn || !sound || !sound.isLoaded()) return;
  sound.setVolume(0.3);
  sound.play();
}
