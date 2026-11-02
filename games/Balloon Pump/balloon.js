let floatingBalloons = [];
let balloonPressure = 0;
let holdingPump = false;
let lastPumpTime = Date.now();
let popUntil = 0;

let elephantPicture;
let pumpPicture;
let balloonPicture;
let balloonBackground;

const balloonPlaces = [
  { x: 540, y: 160 },
  { x: 635, y: 140 },
  { x: 730, y: 165 }
];

const nextButton = {
  x: 410,
  y: 570,
  width: 140,
  height: 55
};

function preload() {
  balloonBackground = loadImage(
    "../../assets/images/finish-background.png"
  );
  pumpPicture = loadImage(
    "../../assets/images/balloon-pump.png"
  );
  balloonPicture = loadImage(
    "../../assets/images/red-balloon.gif"
  );
  elephantPicture = loadImage(
    "../../assets/images/elephant-cartoon.png"
  );
}

function setup() {
  const balloonCanvas = createCanvas(960, 640);
  balloonCanvas.parent("balloon-frame");

  window.addEventListener("blur", cancelPump);
}

function draw() {
  const now = Date.now();
  const seconds = Math.min((now - lastPumpTime) / 1000, 0.1);
  lastPumpTime = now;

  const complete = floatingBalloons.length >= 3;

  // Holding the handle fills the balloon.
  if (holdingPump && now >= popUntil && !complete) {
    balloonPressure = Math.min(
      100,
      balloonPressure + seconds * 20
    );

    if (balloonPressure >= 100) {
      holdingPump = false;
      balloonPressure = 0;
      popUntil = now + 900;
    }
  }

  updatePressureBar();

  image(balloonBackground, 0, 0, width, height);

  noStroke();
  fill("#59433A");
  textAlign(CENTER, CENTER);
  textSize(34);
  text("PUMP IT UP!", 480, 60);


  // Completed balloons drift to Elephant and bob on strings.
  for (let i = 0; i < floatingBalloons.length; i++) {
    const balloon = floatingBalloons[i];
    const place = balloonPlaces[i];

    const targetX =
      place.x + Math.sin(now / 900 + i * 2) * 8;

    const targetY =
      place.y + Math.sin(now / 1100 + i * 2) * 6;

    const movement = 1 - Math.exp(-seconds * 2);

    balloon.x += (targetX - balloon.x) * movement;
    balloon.y += (targetY - balloon.y) * movement;

    stroke("#7B584B");
    strokeWeight(2);

    line(
      640, 332,
      balloon.x + 78, balloon.y + 103
    );

    noStroke();
    drawBalloon(balloon.x, balloon.y, 110);
  }

 image(pumpPicture, 180, 180, 500, 281);

// Redraw only the handle area with a soft golden glow.
if (!holdingPump && now >= popUntil && !complete) {
  const pulse = (Math.sin(now / 300) + 1) / 2;

  drawingContext.save();
  drawingContext.shadowColor = "#FFD447";
  drawingContext.shadowBlur = 25 + pulse * 30;

  image(
    pumpPicture,
    180, 180, 205, 78,
    0, 0,
    pumpPicture.width * 0.41,
    pumpPicture.height * 78 / 281
  );
  // Draw a second glow layer to make it brighter.
image(
  pumpPicture,
  180, 180, 205, 78,
  0, 0,
  pumpPicture.width * 0.41,
  pumpPicture.height * 78 / 281
);

  drawingContext.restore();
}

  if (now < popUntil) {
    // A brief burst when the balloon pops.
    stroke("#EF5350");
    strokeWeight(4);

    for (let i = 0; i < 12; i++) {
      const angle = i * Math.PI / 6;

      line(
        470 + Math.cos(angle) * 28,
        280 + Math.sin(angle) * 28,
        470 + Math.cos(angle) * 65,
        280 + Math.sin(angle) * 65
      );
    }
  } else if (!complete) {
    const size = 35 + balloonPressure * 1.15;

    drawBalloon(
      470 - size * 0.71,
      350 - (size * 496 / 420) * 0.83,
      size
    );
  }
  // A large hand points diagonally toward the handle.
if (!holdingPump && now >= popUntil && !complete) {
  const approach = (Math.sin(now / 350) + 1) / 2;

  push();
  translate(200 + approach * 6, 155 + approach * 6);
  rotate(-Math.PI / 4);
  textAlign(CENTER, CENTER);
  textSize(64);
  noStroke();
  text("👇", 0, 0);
  pop();
}
  image(elephantPicture, 620, 290, 190, 205);
  // Three matching balloon slots show progress.
for (let i = 0; i < 3; i++) {
  const x = 337 + i * 100;
  const earned = i < floatingBalloons.length;

  push();

  // A separate slot makes this a tracker, not floating balloons.
  stroke(earned ? "#74A64A" : "#B7AAA0");
  strokeWeight(2);
  fill("#FFFEF8");

  drawingContext.setLineDash(earned ? [] : [5, 5]);
  rect(x, 490, 86, 74, 12);
  drawingContext.setLineDash([]);

  // Use the actual balloon artwork with its original proportions.
  drawingContext.save();

  if (!earned) {
    drawingContext.filter = "grayscale(1)";
    drawingContext.globalAlpha = 0.3;
  }

  drawBalloon(x - 2, 494, 64);
  drawingContext.restore();

  if (earned) {
    stroke("#569D38");
    strokeWeight(3);
    line(x + 61, 551, x + 67, 557);
    line(x + 67, 557, x + 78, 543);
  }

  pop();
}

  // Lifting finger and upward arrow cue the child to release.
  if (holdingPump && balloonPressure >= 60) {
    noStroke();
    fill("#59433A");
    textSize(46);

    const lift = (Math.sin(now / 250) + 1) * 8;
    text("☝️", 280, 295 - lift);

    stroke(
      balloonPressure >= 80 ? "#EF5350" : "#569D38"
    );
    strokeWeight(5);

    line(330, 300, 330, 265);
    line(330, 265, 320, 277);
    line(330, 265, 340, 277);
  }

  if (complete) {
    // Checkmark shows the task is finished.
    stroke("#569D38");
    strokeWeight(6);

    line(710, 515, 722, 527);
    line(722, 527, 747, 500);

    // Large arrow button continues to the menu.
    stroke("#7B584B");
    strokeWeight(3);
    fill("#FFE6A3");

    rect(
      nextButton.x,
      nextButton.y,
      nextButton.width,
      nextButton.height,
      18
    );

    stroke("#59433A");
    strokeWeight(6);

    line(452, 598, 508, 598);
    line(508, 598, 490, 583);
    line(508, 598, 490, 613);
  }
}

// Crop away the string built into the balloon picture.
function drawBalloon(x, y, size) {
  image(
    balloonPicture,
    x, y,
    size, size,
    0, 0, 420, 420
  );
}

function updatePressureBar() {
  const bar = document.querySelector(".progress-bar");
  if (!bar) return;

  const color =
    balloonPressure >= 80 ? "#EF5350" : "#A8FF78";

  bar.style.background =
    `linear-gradient(to right,
      ${color} 0%,
      ${color} ${balloonPressure}%,
      transparent ${balloonPressure}%,
      transparent 100%),
     linear-gradient(to right,
      #EEF2F3 0%,
      #EEF2F3 60%,
      #D9F7CB 60%,
      #D9F7CB 80%,
      #FFC4C4 80%,
      #FFC4C4 100%)`;

  bar.style.overflow = "hidden";

  bar.style.boxShadow =
    balloonPressure >= 80
      ? "0 0 10px rgba(239,83,80,0.6)"
      : "none";
}

function insideButton(x, y, button) {
  return (
    x >= button.x &&
    x <= button.x + button.width &&
    y >= button.y &&
    y <= button.y + button.height
  );
}

function mousePressed() {
  if (floatingBalloons.length >= 3) {
    if (insideButton(mouseX, mouseY, nextButton)) {
      window.location.href = "../../accessmenu.html";
    }
    return;
  }

  if (Date.now() < popUntil) return;

  // Generous press area around the handle.
  holdingPump = insideButton(mouseX, mouseY, {
    x: 180,
    y: 180,
    width: 185,
    height: 75
  });
}

function mouseReleased() {
  if (!holdingPump) return;

  holdingPump = false;

  if (balloonPressure >= 60 && floatingBalloons.length < 3) {
    const size = 35 + balloonPressure * 1.15;

    floatingBalloons.push({
      x: 470 - size * 0.71,
      y: 350 - (size * 496 / 420) * 0.83
    });
  }

  balloonPressure = 0;
}

// Leaving the browser tab cancels pumping.
function cancelPump() {
  holdingPump = false;
  balloonPressure = 0;
}
