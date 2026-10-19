// Feed the Dragon: scoop food, then carry it gently to the dragon.
// The spoon position means the center of its round end, not the handle.

let spoonX = 470;
let spoonY = 255;
let spoonDragging = false;
let spoonOffsetX = 0;
let spoonOffsetY = 0;
let spoonHasFood = false;
let dragonResult = "idle"; // idle, spilled, missed, or fed
let dragonMessage = "Drag the spoon into the bowl to scoop food.";
let lastSpoonMoveTime = 0;

const bowlX = 300;
const bowlY = 330;
const mouthX = 690;
const mouthY = 334;
const safeSpoonSpeed = 1400; // pixels per second

let scoopSound;
let spillSound;
let successSound;

function preload() {
  scoopSound = loadSound("assets/sounds/pluck_001.wav");
  spillSound = loadSound("assets/sounds/drop_001.wav");
  successSound = loadSound("assets/sounds/confirmation_002.wav");
}

function resetFeedTheDragon() {
  spoonX = 470;
  spoonY = 255;
  spoonDragging = false;
  spoonHasFood = false;
  dragonResult = "idle";
  dragonMessage = "Drag the spoon into the bowl to scoop food.";
  lastSpoonMoveTime = 0;
}

function drawFeedTheDragon() {
  drawFoodBowl();
  drawSmallDragon();
  drawSpoon();

  noStroke();
  fill("#6B4B3D");
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(15);
  text("FOOD BOWL", bowlX, 420);
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
}

function drawFoodBowl() {
  // Food sits inside the red bowl on the left side of the game area.
  noStroke();
  fill("#AD3C31");
  ellipse(bowlX, bowlY + 35, 166, 94);
  fill("#E75B4B");
  ellipse(bowlX, bowlY + 14, 178, 42);
  fill("#F8B557");
  ellipse(bowlX, bowlY + 10, 138, 26);

  fill("#7EBB5D");
  circle(bowlX - 42, bowlY + 8, 18);
  circle(bowlX + 2, bowlY + 4, 16);
  circle(bowlX + 42, bowlY + 10, 18);

  stroke("#8D302A");
  strokeWeight(3);
  noFill();
  arc(bowlX, bowlY + 15, 178, 40, 0, PI);
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
    fill("#F8B557");
    ellipse(spoonX, spoonY - 4, 35, 16);
    fill("#7EBB5D");
    circle(spoonX - 8, spoonY - 6, 8);
  }
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
    dragonMessage = "Food collected! Move slowly to the dragon's mouth.";
    playDragonSound(scoopSound);
  } else if (
    spoonHasFood &&
    dist(spoonX, spoonY, bowlX, bowlY + 12) >= 73 &&
    speed > safeSpoonSpeed
  ) {
    dragonResult = "spilled";
    dragonMessage = "Oops! The food spilled. Press Try Again.";
    spoonHasFood = false;
    spoonDragging = false;
    playDragonSound(spillSound);
  }
}

function feedDragonMouseReleased() {
  if (!spoonDragging || dragonResult !== "idle") return;
  spoonDragging = false;

  if (!spoonHasFood) {
    dragonMessage = "Scoop food from the bowl first.";
    return;
  }

  if (dist(spoonX, spoonY, mouthX, mouthY) < 39) {
    dragonResult = "fed";
    dragonMessage = "Great job! You fed the dragon!";
    spoonHasFood = false;
    playDragonSound(successSound);
  } else if (spoonX > 610) {
    dragonResult = "missed";
    dragonMessage = "Missed the mouth. Press Try Again.";
    spoonHasFood = false;
    playDragonSound(spillSound);
  } else {
    dragonMessage = "Keep moving slowly toward the dragon's mouth.";
  }
}

function playDragonSound(sound) {
  if (!hudSoundOn || !sound || !sound.isLoaded()) return;
  sound.setVolume(0.3);
  sound.play();
}
