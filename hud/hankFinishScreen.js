let hankFinishBackground;
let hankFinishConfetti;
let hankFinishFlags;
function preload() {
  hankFinishBackground = loadImage(
    "assets/images/finish-background.png"
  );
  hankFinishFlags = loadImage("assets/images/finish-flags.gif");
  hankFinishConfetti = loadImage(
  "assets/images/finish-confetti.gif"
);
}
function drawHankFinishScreen() {
  image(hankFinishBackground, 0, 0, width, height);

  fill("#59433A");
  textAlign(CENTER, CENTER);
  textSize(48);

  text("THE END", 480, 160);
image(hankFinishFlags, 320, 190, 320, 320);
image(hankFinishConfetti, 280, 210, 400, 225);
drawHudButton(
  { x: 260, y: 470, width: 200, height: 60 },
  "Play again",
  "#C95843"
);drawHudButton(
  { x: 500, y: 470, width: 200, height: 60 },
  "Home",
  "#FFE6A3"
);
}