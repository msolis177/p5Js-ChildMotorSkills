// Cayden's shared HUD prototype for Tiny Tots Playroom.
// This file only draws the shared interface. The four games can be added later.

const HUD_WIDTH = 960;
const HUD_HEIGHT = 640;

const hudGames = [
  {
    title: "Pump It Up",
    color: "#F36B7F",
    note: "The balloon-pump activity will go here."
  },
  {
    title: "Bubbles",
    color: "#A889E8",
    note: "The bubble activity will go here."
  },
  {
    title: "Feed the Dragon",
    color: "#74C365",
    note: "Scoop food and move slowly to the dragon."
  },
  {
    title: "Pour It In",
    color: "#59B9E8",
    note: "The pouring activity will go here."
  }
];

let hudCurrentGame = 0;
let hudSoundOn = true;
let hudMessage = "Use Next to preview each activity HUD.";

const hudButtons = {
  home: { x: 34, y: 38, width: 126, height: 52 },
  sound: { x: 770, y: 38, width: 124, height: 52 },
  tryAgain: { x: 42, y: 544, width: 164, height: 58 },
  next: { x: 754, y: 544, width: 164, height: 58 }
};

function setup() {
  const hudCanvas = createCanvas(HUD_WIDTH, HUD_HEIGHT);
  hudCanvas.parent("hud-preview");

  textFont("Trebuchet MS");
  strokeJoin(ROUND);
}

function draw() {
  background("#FFF5D9");

  drawToyDecorations();
  drawHudHeader();
  drawGamePlaceholder();
  drawHudFooter();
  updateHudCursor();
}

function drawHudHeader() {
  drawHudButton(hudButtons.home, "HOME", "#FFD45A");
  drawHudButton(
    hudButtons.sound,
    hudSoundOn ? "SOUND ON" : "SOUND OFF",
    "#FFD45A"
  );

  noStroke();
  fill("#7B584B");
  textAlign(CENTER, CENTER);
  textSize(15);
  textStyle(BOLD);
  text("TINY TOTS PLAYROOM", HUD_WIDTH / 2, 27);

  fill(hudGames[hudCurrentGame].color);
  textSize(34);
  text(hudGames[hudCurrentGame].title, HUD_WIDTH / 2, 65);
  textStyle(NORMAL);

  drawRubberDuck(920, 24, 0.55);
}

function drawGamePlaceholder() {
  const game = hudGames[hudCurrentGame];

  stroke("#D9B97E");
  strokeWeight(4);
  fill("#FFFEF8");
  rect(108, 124, 744, 352, 30);

  noStroke();
  fill("#FFF0BF");
  rect(132, 146, 696, 42, 18);

  fill("#7B584B");
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(18);
  text("GAME AREA", HUD_WIDTH / 2, 167);
  textStyle(NORMAL);

  if (hudCurrentGame === 0) {
    drawBalloonPlaceholder(HUD_WIDTH / 2, 290);
  } else if (hudCurrentGame === 1) {
    drawBubblesPlaceholder(HUD_WIDTH / 2, 292);
  } else if (hudCurrentGame === 2) {
    drawFeedTheDragon();
    return;
  } else {
    drawPouringPlaceholder(HUD_WIDTH / 2, 292);
  }

  fill("#59433A");
  textAlign(CENTER, CENTER);
  textSize(18);
  text(game.note, HUD_WIDTH / 2, 430);

  fill("#8C7165");
  textSize(14);
  text(hudMessage, HUD_WIDTH / 2, 458);
}

function drawHudFooter() {
  drawHudButton(hudButtons.tryAgain, "TRY AGAIN", "#F47A5A");
  drawHudButton(hudButtons.next, "NEXT", "#F47A5A");

  const firstDotX = 426;
  const dotGap = 36;

  for (let i = 0; i < hudGames.length; i++) {
    const isCurrentGame = i === hudCurrentGame;

    stroke("#7B584B");
    strokeWeight(isCurrentGame ? 3 : 2);
    fill(isCurrentGame ? hudGames[i].color : "#FFFDF7");
    circle(firstDotX + i * dotGap, 558, isCurrentGame ? 22 : 16);
  }

  noStroke();
  fill("#59433A");
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(17);
  text("Game " + (hudCurrentGame + 1) + " of 4", HUD_WIDTH / 2, 590);
  textStyle(NORMAL);
}

function drawHudButton(button, label, buttonColor) {
  const hovering = isInsideHudButton(mouseX, mouseY, button);

  stroke("#7B584B");
  strokeWeight(3);
  fill(hovering ? "#FFF08A" : buttonColor);
  rect(button.x, button.y, button.width, button.height, 18);

  noStroke();
  fill("#513B33");
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(17);
  text(label, button.x + button.width / 2, button.y + button.height / 2 + 1);
  textStyle(NORMAL);
}

function mousePressed() {
  if (isInsideHudButton(mouseX, mouseY, hudButtons.home)) {
    hudCurrentGame = 0;
    hudMessage = "Home selected - the game menu will be connected later.";
  } else if (isInsideHudButton(mouseX, mouseY, hudButtons.sound)) {
    hudSoundOn = !hudSoundOn;
    hudMessage = hudSoundOn ? "Sound is on." : "Sound is off.";
  } else if (isInsideHudButton(mouseX, mouseY, hudButtons.tryAgain)) {
    if (hudCurrentGame === 2) {
      resetFeedTheDragon();
    } else {
      hudMessage = "Try Again selected - this activity is ready to restart.";
    }
  } else if (isInsideHudButton(mouseX, mouseY, hudButtons.next)) {
    hudCurrentGame = (hudCurrentGame + 1) % hudGames.length;
    if (hudCurrentGame === 2) resetFeedTheDragon();
    hudMessage = "Now previewing " + hudGames[hudCurrentGame].title + ".";
  } else if (hudCurrentGame === 2) {
    feedDragonMousePressed();
  }
}

function mouseDragged() {
  if (hudCurrentGame === 2) feedDragonMouseDragged();
}

function mouseReleased() {
  if (hudCurrentGame === 2) feedDragonMouseReleased();
}

function isInsideHudButton(x, y, button) {
  return (
    x >= button.x &&
    x <= button.x + button.width &&
    y >= button.y &&
    y <= button.y + button.height
  );
}

function updateHudCursor() {
  const overButton =
    isInsideHudButton(mouseX, mouseY, hudButtons.home) ||
    isInsideHudButton(mouseX, mouseY, hudButtons.sound) ||
    isInsideHudButton(mouseX, mouseY, hudButtons.tryAgain) ||
    isInsideHudButton(mouseX, mouseY, hudButtons.next);
  const overSpoon =
    hudCurrentGame === 2 &&
    dragonResult === "idle" &&
    dist(mouseX, mouseY, spoonX + 15, spoonY - 12) < 55;

  cursor(overButton || overSpoon ? HAND : ARROW);
}

function drawToyDecorations() {
  drawToyBlock(18, 154, "#59B9E8", "A");
  drawToyBlock(25, 220, "#F6C84F", "B");
  drawToyBlock(18, 286, "#74C365", "C");

  drawToyBlock(891, 166, "#F36B7F", "1");
  drawToyBlock(898, 232, "#A889E8", "2");
  drawToyBlock(891, 298, "#59B9E8", "3");

  noStroke();
  fill("#F6C84F");
  star(76, 494, 10, 22, 5);
  fill("#F36B7F");
  star(883, 494, 9, 19, 5);
}

function drawToyBlock(x, y, blockColor, label) {
  stroke("#7B584B");
  strokeWeight(2);
  fill(blockColor);
  rect(x, y, 48, 48, 8);

  noStroke();
  fill("#FFFFFF");
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(20);
  text(label, x + 24, y + 25);
  textStyle(NORMAL);
}

function drawBalloonPlaceholder(x, y) {
  stroke("#7B584B");
  strokeWeight(3);
  fill("#F36B7F");
  ellipse(x, y - 18, 112, 136);

  fill("#F36B7F");
  triangle(x - 9, y + 49, x + 9, y + 49, x, y + 65);

  noFill();
  stroke("#7B584B");
  strokeWeight(2);
  bezier(x, y + 65, x - 20, y + 92, x + 22, y + 105, x, y + 125);

  noStroke();
  fill(255, 255, 255, 145);
  ellipse(x - 22, y - 45, 26, 38);
}

function drawPouringPlaceholder(x, y) {
  stroke("#7B584B");
  strokeWeight(4);
  fill("#DDF4FF");
  rect(x - 64, y - 70, 104, 142, 18);

  fill("#FFFEF8");
  circle(x + 44, y - 10, 84);
  circle(x + 44, y - 10, 49);

  noStroke();
  fill("#59B9E8");
  rect(x - 58, y + 4, 92, 62, 0, 0, 14, 14);

  stroke("#7B584B");
  strokeWeight(4);
  fill("#DDF4FF");
  triangle(x - 62, y - 62, x - 96, y - 42, x - 62, y - 28);
}

function drawBubblesPlaceholder(x, y) {
  const bubbles = [
    { x: -58, y: 30, size: 68, color: [89, 185, 232, 100] },
    { x: -8, y: -38, size: 90, color: [168, 137, 232, 95] },
    { x: 58, y: 18, size: 78, color: [243, 107, 127, 90] },
    { x: 8, y: 55, size: 52, color: [116, 195, 101, 95] },
    { x: 74, y: -56, size: 38, color: [246, 200, 79, 105] }
  ];

  for (let i = 0; i < bubbles.length; i++) {
    const bubble = bubbles[i];
    stroke("#7B584B");
    strokeWeight(2);
    fill(bubble.color[0], bubble.color[1], bubble.color[2], bubble.color[3]);
    circle(x + bubble.x, y + bubble.y, bubble.size);

    noStroke();
    fill(255, 255, 255, 150);
    circle(
      x + bubble.x - bubble.size * 0.18,
      y + bubble.y - bubble.size * 0.18,
      bubble.size * 0.2
    );
  }
}

function drawRubberDuck(x, y, scaleAmount) {
  push();
  translate(x, y);
  scale(scaleAmount);

  stroke("#7B584B");
  strokeWeight(3);
  fill("#F6C84F");
  ellipse(-20, 42, 72, 46);
  circle(8, 12, 44);

  fill("#F47A5A");
  triangle(27, 10, 48, 18, 27, 24);

  noStroke();
  fill("#513B33");
  circle(15, 7, 7);

  pop();
}

function star(x, y, innerRadius, outerRadius, points) {
  let angle = -HALF_PI;
  const step = PI / points;

  beginShape();
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    vertex(x + cos(angle) * radius, y + sin(angle) * radius);
    angle += step;
  }
  endShape(CLOSE);
}
