let floatingBalloons = [];
let balloonPressure = 0;
let holdingPump = false;
let lastPumpTime = Date.now();

let pumpPicture;
let balloonPicture;
let balloonBackground;

let message = "Hold the handle. Release when the bar is past halfway!";
let popUntil = 0;

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
}

function setup() {
  const balloonCanvas = createCanvas(960, 640);
  balloonCanvas.parent("balloon-frame");
}

function draw() {
  const now = Date.now();
  const seconds = Math.min((now - lastPumpTime) / 1000, 0.1);
  lastPumpTime = now;

  const popping = now < popUntil;

  if (holdingPump && !popping) {
    balloonPressure = Math.min(
      100,
      balloonPressure + seconds * 20
    );

    if (balloonPressure >= 100) {
      holdingPump = false;
      balloonPressure = 0;
      popUntil = now + 900;
      message = "Pop! Try again—release a little sooner.";
    } else if (balloonPressure >= 80) {
      message = "Careful! Let go before it pops!";
    } else if (balloonPressure >= 60) {
      message = "Ready! Let go to keep your balloon!";
    }
  }

  // Match the bubble game's green fill.
  // Red remains visible ahead of the fill as a danger zone.
  const bar = document.querySelector(".progress-bar");

  if (bar) {
    const fillColor =
      balloonPressure >= 80 ? "#ef5350" : "#a8ff78";

    bar.style.background =
      `linear-gradient(to right,
        ${fillColor} 0%,
        ${fillColor} ${balloonPressure}%,
        transparent ${balloonPressure}%,
        transparent 100%),
       linear-gradient(to right,
        #eef2f3 0%,
        #eef2f3 60%,
        #d9f7cb 60%,
        #d9f7cb 80%,
        #ffc4c4 80%,
        #ffc4c4 100%)`;

    bar.style.overflow = "hidden";
    bar.style.boxShadow =
      balloonPressure >= 80
        ? "0 0 10px rgba(239, 83, 80, 0.6)"
        : "none";
  }

  image(balloonBackground, 0, 0, width, height);

  // Finished balloons stay inside the frame.
  for (const balloon of floatingBalloons) {
    balloon.x += balloon.vx * seconds;
    balloon.y += balloon.vy * seconds;

    if (balloon.x < 110) {
      balloon.x = 110;
      balloon.vx = Math.abs(balloon.vx);
    } else if (balloon.x > 700) {
      balloon.x = 700;
      balloon.vx = -Math.abs(balloon.vx);
    }

    if (balloon.y < 145) {
      balloon.y = 145;
      balloon.vy = Math.abs(balloon.vy);
    } else if (balloon.y > 360) {
      balloon.y = 360;
      balloon.vy = -Math.abs(balloon.vy);
    }

    image(
      balloonPicture,
      balloon.x,
      balloon.y,
      150,
      150 * 496 / 420
    );
  }

  noStroke();
  fill("#59433A");
  textAlign(CENTER, CENTER);
  textSize(34);
  text("PUMP IT UP!", 480, 60);

  textSize(16);
  text("FILL → READY → DANGER", 480, 95);

  image(pumpPicture, 180, 180, 500, 281);

  if (Date.now() < popUntil) {
    // Brief burst where the balloon was.
    stroke("#ef5350");
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

    noStroke();
    fill("#59433A");
    textSize(28);
    text("POP!", 470, 280);
  } else {
    const balloonWidth = 35 + balloonPressure * 1.15;
    const balloonHeight = balloonWidth * 496 / 420;

    image(
      balloonPicture,
      470 - balloonWidth * 0.71,
      350 - balloonHeight * 0.83,
      balloonWidth,
      balloonHeight
    );
  }

  stroke("#7B584B");
  strokeWeight(2);
  fill("#FFFEF8");
  rect(650, 220, 140, 130, 8);

  noStroke();
  fill("#59433A");
  textSize(24);
  text("TOTAL:", 720, 250);

  textSize(48);
  text(floatingBalloons.length, 720, 305);

  textSize(20);
  text(message, 480, 490);
}

function mousePressed() {
  if (Date.now() < popUntil) return;

  holdingPump =
    mouseX >= 180 && mouseX <= 365 &&
    mouseY >= 180 && mouseY <= 255;

  if (holdingPump) {
    message = "Keep holding—watch the bar!";
  }
}

function mouseReleased() {
  // Releasing after a pop cannot award a balloon.
  if (!holdingPump) return;

  holdingPump = false;

  if (balloonPressure >= 60) {
    const balloonWidth = 35 + balloonPressure * 1.15;
    const balloonHeight = balloonWidth * 496 / 420;

    floatingBalloons.push({
      x: 470 - balloonWidth * 0.71,
      y: 350 - balloonHeight * 0.83,
      vx: (Math.random() < 0.5 ? -1 : 1) *
          (20 + Math.random() * 20),
      vy: -(20 + Math.random() * 20)
    });

    message = "You did it! Hold the handle to make another.";
  } else {
    message = "A little more air next time! Try again.";
  }

  balloonPressure = 0;
}