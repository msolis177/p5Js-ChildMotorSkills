let pumpPicture;
let balloonPicture;
let balloonBackground;

function preload() {
  balloonBackground = loadImage(
    "../../assets/images/finish-background.png"
  );
  pumpPicture = loadImage("../../assets/images/balloon-pump.png");
  balloonPicture = loadImage("../../assets/images/red-balloon.gif");
}
function setup() {
  const balloonCanvas = createCanvas(960, 640);
balloonCanvas.parent("balloon-frame");
}

function draw() {
  image(balloonBackground, 0, 0, width, height);

  fill("#59433A");
  textAlign(CENTER, CENTER);
  textSize(34);
  text("PUMP IT UP!", width / 2, 60);
  image(pumpPicture, 180, 180, 500, 281);
  image(balloonPicture, 490, 185, 110, 130);
  // Total counter
stroke("#7B584B");
strokeWeight(2);
fill("#FFFEF8");
rect(650, 220, 140, 130, 8);

noStroke();
fill("#59433A");
textAlign(CENTER, CENTER);
textSize(24);
text("TOTAL:", 720, 250);

textSize(48);
text("0", 720, 305);

// Instructions
textSize(22);
text("Press and hold the pump to fill the balloon.", 480, 490);
}