
const GAME_TIME = 60;
const POUR_TIME = 3000;
const pouringSound = new Audio("/assets/sounds/pouring_water.mp3");
pouringSound.loop = true;
const buttonSound = new Audio("./confirmation_002.wav");
buttonSound.volume = 0.5;
const TARGET_SCORE = 10;

const COLORS = [
  { name: "Red", hex: "#e74c3c" },
  { name: "Blue", hex: "#3498db" },
  { name: "Green", hex: "#2ecc71" },
  { name: "Yellow", hex: "#f1c40f" },
  { name: "Purple", hex: "#9b59b6" },
  { name: "Orange", hex: "#e67e22" }
];

let gameState = "ready";
let score = 0;
let timeLeft = GAME_TIME;
let endTime = 0;

let pitcherColor;
let cupColors = [];
let correctCup = 0;

let pitcherX = 350;
let pitcherY = 155;
let dragging = false;
let pitcherDirection = 1;
let dragOffsetX = 0;
let dragOffsetY = 0;

let pouringCup = -1;
let pourStart = 0;
let pourProgress = 0;

let particles = [];
let celebrationStart = 0;

const cupPositions = [
  { x: 130, y: 245 },
  { x: 570, y: 245 }
];

function setup() {
  const canvas = createCanvas(700, 380);
  canvas.parent("game-container");

  textFont("Arial");

  document.getElementById("startBtn")
    .addEventListener("click", startGame);

  document.getElementById("restartBtn")
    .addEventListener("click", startGame);

  document.getElementById("homeBtn")
    .addEventListener("click", goHome);

  document.getElementById("doneBtn")
    .addEventListener("click", goHome);

  resetGame();
}

function resetGame() {
  gameState = "ready";
  score = 0;
  timeLeft = GAME_TIME;
  dragging = false;
  pouringCup = -1;
  pourProgress = 0;
  particles = [];

  resetPitcher();
  newRound();

  updateDisplay();
  setMessage("Press Start to begin!");

  document.getElementById("startBtn").hidden = false;
  document.getElementById("doneBtn").hidden = true;
  document.getElementById("restartBtn").hidden = false;

  updateStars();
}

function startGame() {
  resetGame();
  gameState = "playing";
  endTime = millis() + GAME_TIME * 1000;

  document.getElementById("startBtn").hidden = true;
  setMessage("Drag the pitcher to the matching cup!");
}

function newRound() {
  const colorIndex = floor(random(COLORS.length));
  const wrongIndex = floor(random(COLORS.length - 1));

  pitcherColor = COLORS[colorIndex];

  let otherIndex = wrongIndex;
  if (otherIndex >= colorIndex) {
    otherIndex++;
  }

  correctCup = floor(random(2));

  cupColors[correctCup] = COLORS[colorIndex];
  cupColors[1 - correctCup] = COLORS[otherIndex];

  resetPitcher();
  pouringCup = -1;
  pourProgress = 0;
}

function resetPitcher() {
  pitcherX = 350;
  pitcherY = 210;
  dragging = false;
}

function draw() {
  background("#fffaf0");

  if (gameState === "playing") {
    timeLeft = max(0, ceil((endTime - millis()) / 1000));

    if (timeLeft <= 0) {
      finishGame();
    }
  }

  drawCup(0);
  drawCup(1);
  drawPitcher();

  if (gameState === "playing" && dragging) {
    handlePouring();
  }

  if (gameState === "celebrating") {
    drawCelebration();
  }

  updateDisplay();
}

function drawCup(index) {
  const cup = cupPositions[index];
  const x = cup.x;
  const y = cup.y;

  push();
  translate(x, y);

  // Glass body
  fill(205, 235, 255, 65);
  stroke("#829bb1");
  strokeWeight(4);

  beginShape();
  vertex(-45, -65);
  vertex(-36, 35);
  quadraticVertex(-34, 45, -24, 45);
  vertex(24, 45);
  quadraticVertex(34, 45, 36, 35);
  vertex(45, -65);
  endShape(CLOSE);

  // Glass rim
  line(-45, -65, 45, -65);

  // Animated liquid level
  if (pouringCup === index && gameState === "playing") {
    const level = 85 * pourProgress;

    noStroke();
    fill(pitcherColor.hex);

    rectMode(CENTER);
    rect(0, 35 - level / 2, 63, level);
  }

  // Color marker underneath
  noStroke();
  fill(cupColors[index].hex);
  rectMode(CENTER);
  rect(0, 70, 95, 15, 7);

  fill("#333");
  textAlign(CENTER);
  textSize(15);
  text(cupColors[index].name, 0, 100);

  pop();
}


function drawPitcher() {
  push();
  translate(pitcherX, pitcherY);

  scale(1.3); // Make pitcher bigger 

  // Flip the handle based on which side we're moving toward
  scale(-pitcherDirection, 1);

  // Tilt toward the cup while pouring
  if (pouringCup !== -1 && dragging) {
    rotate(radians(-35));
  }

  // Pitcher handle
  noFill();
  stroke("#829bb1");
  strokeWeight(10);
  ellipse(48, 0, 45, 65);

  // Pitcher body
  fill(205, 235, 255, 130);
  stroke("#829bb1");
  strokeWeight(4);

  beginShape();
  vertex(-35, -55);
  vertex(35, -55);
  vertex(32, 45);
  quadraticVertex(30, 55, 15, 55);
  vertex(-15, 55);
  quadraticVertex(-30, 55, -32, 45);
  endShape(CLOSE);

  // Liquid inside pitcher
  noStroke();
  fill(pitcherColor.hex);

  beginShape();
  vertex(-31, -10);
  vertex(31, -10);
  vertex(28, 45);
  vertex(-28, 45);
  endShape(CLOSE);

  // Rim
  stroke("#829bb1");
  strokeWeight(5);
  line(-40, -55, 40, -55);

  pop();

  if (pouringCup !== -1 && dragging) {
    drawLiquidStream();
  }
}


function drawLiquidStream() {
  const cup = cupPositions[pouringCup];

  // The pitcher is drawn at 1.3 times its original size.
  const pitcherScale = 1.3;

  // The spout faces toward the matching glass.
  const direction = -pitcherDirection;

  // Match the rotation used in drawPitcher().
  const angle = radians(-35);

  // Original spout position on the pitcher.
  const spoutX = -40;
  const spoutY = -55;

  // Apply rotation to the spout position.
  const rotatedX =
    spoutX * cos(angle) - spoutY * sin(angle);

  const rotatedY =
    spoutX * sin(angle) + spoutY * cos(angle);

  // Apply the same scale and horizontal flip.
  const startX =
    pitcherX + rotatedX * pitcherScale * direction;

  const startY =
    pitcherY + rotatedY * pitcherScale;

  // Aim toward the opening of the glass.
  const endX = cup.x;
  const endY = cup.y - 65;

  stroke(pitcherColor.hex);
  strokeWeight(6);
  noFill();

  bezier(
    startX, startY,
    startX - 25, startY + 25,
    cup.x, cup.y - 25,
    cup.x, cup.y
  );
}

function handlePouring() {
  const cupIndex = getCupUnderPitcher();

  if (cupIndex === -1) {
    pouringCup = -1;
    pourProgress = 0;
    return;
  }

  if (cupIndex !== correctCup) {
    pouringCup = -1;
    pourProgress = 0;
    setMessage("Try again!");
    return;
  }

  if (pouringCup !== cupIndex) {
    pouringCup = cupIndex;
    pourStart = millis();
    pourProgress = 0;
    setMessage("Correct! Keep pouring!");

    // water sound
    pouringSound.currentTime = 0;
    pouringSound.play().catch(() => {});
  }

  pourProgress = constrain(
    (millis() - pourStart) / POUR_TIME,
    0,
    1
  );

  if (pourProgress >= 1) {
    pouringSound.pause();
    pouringSound.currentTime = 0;

    score++;
    updateStars();

    if (score >= TARGET_SCORE) {
      finishGame();
    } else {
      newRound();
      setMessage("Great job! Find the next color!");
    }
  }
}

function getCupUnderPitcher() {
  for (let i = 0; i < cupPositions.length; i++) {
    const cup = cupPositions[i];

    if (
      abs(pitcherX - cup.x) < 80 &&
      abs(pitcherY - cup.y) < 100
    ) {
      return i;
    }
  }

  return -1;
}

function mousePressed() {
  if (gameState !== "playing") return;

  if (
    abs(mouseX - pitcherX) < 65 &&
    abs(mouseY - pitcherY) < 65
  ) {
    dragging = true;
    dragOffsetX = pitcherX - mouseX;
    dragOffsetY = pitcherY - mouseY;
    return false;
  }
}

function mouseDragged() {
  if (!dragging || gameState !== "playing") return;

  pitcherX = constrain(mouseX + dragOffsetX, 55, width - 55);
  pitcherY = constrain(mouseY + dragOffsetY, 65, height - 65);

  // Automatically switch handle direction
  if (pitcherX < width / 2 - 20) {
    pitcherDirection = -1;
  } else if (pitcherX > width / 2 + 20) {
    pitcherDirection = 1;
  }

  return false;
}

function mouseReleased() {
  if (dragging) {
    pouringSound.pause();
    pouringSound.currentTime = 0;
    dragging = false;
    pouringCup = -1;
    pourProgress = 0;
    resetPitcher();
  }
}

function finishGame() {
  pouringSound.pause();
  pouringSound.currentTime = 0;
  if (gameState !== "playing") return;

  dragging = false;
  pouringCup = -1;
  pourProgress = 0;

  gameState = "finished";

  if (score >= 10) {
    gameState = "celebrating";
    celebrationStart = millis();
    createConfetti();
    setMessage("GOLD STAR! Amazing job!");
  } else if (score >= 6) {
    setMessage("SILVER STAR! Great job!");
  } else if (score >= 3) {
    setMessage("BRONZE STAR! Good job!");
  } else {
    setMessage("Time's up! Keep practicing!");
  }

  document.getElementById("startBtn").hidden = true;
  document.getElementById("doneBtn").hidden = false;

  updateStars();
}

function updateStars() {
  const bronze = document.querySelector(".bronze");
  const silver = document.querySelector(".silver");
  const gold = document.querySelector(".gold");

  bronze.classList.toggle(
    "earned",
    score >= 3 && score <= 5
  );

  silver.classList.toggle(
    "earned",
    score >= 6 && score <= 9
  );

  gold.classList.toggle(
    "earned",
    score >= 10
  );
}

function createConfetti() {
  particles = [];

  for (let i = 0; i < 100; i++) {
    particles.push({
      x: random(width),
      y: random(-height, 0),
      speed: random(2, 6),
      size: random(5, 12),
      color: random(COLORS).hex
    });
  }
}

function drawCelebration() {
  for (const p of particles) {
    noStroke();
    fill(p.color);
    rect(p.x, p.y, p.size, p.size);

    p.y += p.speed;

    if (p.y > height) {
      p.y = -10;
      p.x = random(width);
    }
  }

  fill("#333");
  textAlign(CENTER);
  textSize(35);
  setMessage("");
}

function updateDisplay() {
  const minutes = floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  document.getElementById("timer").textContent =
    minutes + ":" + String(seconds).padStart(2, "0");

  document.getElementById("progress").textContent =
    score + " / " + TARGET_SCORE;
}

function setMessage(message) {
  document.getElementById("message").textContent = message;
}

function goHome() {
  window.location.href = "../../accessmenu.html";
}
function playButtonSound() {
  buttonSound.currentTime = 0;
  buttonSound.play().catch(error => console.error("Button sound:", error));
}

["startBtn", "restartBtn", "homeBtn", "doneBtn"].forEach(id => {
  document.getElementById(id)?.addEventListener("click", playButtonSound);
});
