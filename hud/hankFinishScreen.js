let hankFinishBackground;
let hankFinishConfetti;
let hankPartyElephant;
let hankPartyBalloon;
let hankPartyBubbleFriend;

const hankPartyButtons = {
  playAgain: { x: 260, y: 520, width: 200, height: 60 },
  home: { x: 500, y: 520, width: 200, height: 60 }
};

function preload() {
  hankFinishBackground = loadImage(
    "./assets/images/finish-background.png"
  );
  hankFinishConfetti = loadImage(
    "./assets/images/finish-confetti.gif"
  );
  hankPartyElephant = loadImage(
    "./assets/images/elephantFlipped.png"
  );
  hankPartyBalloon = loadImage(
    "./assets/images/red-balloon.gif"
  );
  hankPartyBubbleFriend = loadImage(
    "./assets/images/greenguy.png"
  );
  hankPartyPouringFriend = loadImage(
    "./assets/images/party_corgi.png"
  );
}

function drawHankFinishScreen() {
  push();

  image(hankFinishBackground, 0, 0, width, height);

  // Celebration stays behind the characters.
  image(hankFinishConfetti, 250, 145, 460, 260);

  drawHankBirthdayBanner();
  drawHankPartyElephant();
  drawHankPartyDragon();
  drawHankPartyPouringFriend();
  // Bubble friend stands beside the table.
  drawHankPartyBubbles();

  // Table goes in front of Dragon.
  drawHankPartyTable();

  drawHudButton(
    hankPartyButtons.playAgain,
    "Play again",
    "#C95843"
  );

  drawHudButton(
    hankPartyButtons.home,
    "Home",
    "#FFE6A3"
  );

  pop();
}

function drawHankBirthdayBanner() {
  push();

  stroke("#B74D51");
  strokeWeight(2);

  // Ribbon tails.
  fill("#D9686A");
  beginShape();
  vertex(210, 64);
  vertex(170, 61);
  vertex(184, 88);
  vertex(170, 114);
  vertex(220, 119);
  endShape(CLOSE);

  beginShape();
  vertex(750, 64);
  vertex(790, 61);
  vertex(776, 88);
  vertex(790, 114);
  vertex(740, 119);
  endShape(CLOSE);

  // Gently curved main ribbon.
  fill("#FFE6A3");
  beginShape();
  vertex(210, 48);
  bezierVertex(370, 67, 590, 67, 750, 48);
  vertex(750, 115);
  bezierVertex(590, 139, 370, 139, 210, 115);
  endShape(CLOSE);

  noStroke();
  fill("#59433A");
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(32);
  text("Happy Birthday, Dragon!", 480, 96);

  pop();
}

function drawHankPartyElephant() {
  push();

  const balloons = [
    { x: 195, y: 176 },
    { x: 250, y: 147 },
    { x: 310, y: 176 }
  ];

  for (const balloon of balloons) {
    stroke("#7B584B");
    strokeWeight(2);

    line(360, 304, balloon.x + 50, balloon.y + 66);

    image(
      hankPartyBalloon,
      balloon.x, balloon.y,
      70, 70,
      0, 0, 420, 420
    );
  }

  image(hankPartyElephant, 210, 260, 170, 172);
  pop();
}

function drawHankPartyDragon() {
  push();

  // Preserve the feeding game's design at a smaller party size.
  translate(450, 300);
  scale(0.73);
  translate(-730, -320);

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

  fill("#6D3940");
  ellipse(690, 334, 48, 31);

  fill("#F6C7B7");
  arc(690, 339, 22, 12, 0, PI);

  fill("#F49B55");
  stroke("#8C5534");
  strokeWeight(3);
  triangle(793, 355, 830, 330, 812, 378);

  pop();
}

function drawHankPartyPouringFriend() {
  push();
 image(hankPartyPouringFriend, 520, 265, 145, 145);

  pop();
}

function drawHankPartyTable() {
  push();

  // Small table, with space below before the buttons.
  noStroke();
  fill("#B67D56");
  rect(390, 408, 14, 55, 5);
  rect(556, 408, 14, 55, 5);

  stroke("#C08577");
  strokeWeight(2);
  fill("#F6B7AA");
  rect(360, 383, 240, 39, 12);

  fill("#FFE5CF");
  ellipse(480, 383, 240, 39);

  // Cake plate.
  noStroke();
  fill("#DCE3E5");
  ellipse(480, 382, 128, 22);
  fill("#FFFFFF");
  ellipse(480, 379, 112, 15);

  // Cake with a missing portion on the right.
  stroke("#D6A45C");
  strokeWeight(1);
  fill("#F6C56E");

  beginShape();
  vertex(438, 341);
  vertex(503, 341);
  vertex(503, 354);
  vertex(518, 354);
  vertex(518, 376);
  vertex(438, 376);
  endShape(CLOSE);

  // Cream layer follows the remaining cake.
  noStroke();
  fill("#FFF0D7");
  rect(439, 361, 78, 5);

  // Pink frosting.
  fill("#F47A8A");
  rect(438, 338, 65, 13, 5);

  fill("#FFFDF7");
  circle(450, 344, 4);
  circle(468, 344, 4);
  circle(486, 344, 4);

  // A little cake left on the plate.
  fill("#F6C56E");
  ellipse(528, 382, 7, 4);
  ellipse(536, 379, 5, 3);

  pop();
}

function drawHankPartyBubbles() {
  push();
  image(hankPartyBubbleFriend, 610, 285, 145, 165);

  pop();
}

function hankFinishMousePressed() {
  if (
    isInsideHudButton(
      mouseX,
      mouseY,
      hankPartyButtons.playAgain
    )
  ) {
    // Clear only this app's four completion flags.
    ["balloons", "pouring", "feedMe", "bubbles"].forEach(
      function (game) {
        localStorage.removeItem(
          "tinyTots." + game + "Complete"
        );
      }
    );

    window.location.href = "index.html";
    return;
  }

  if (
    isInsideHudButton(
      mouseX,
      mouseY,
      hankPartyButtons.home
    )
  ) {
    window.location.href = "accessmenu.html";
  }
}