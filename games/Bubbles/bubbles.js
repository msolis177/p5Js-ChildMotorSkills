let wandImages = ["../../assets/images/AnimalPinkBubbleWand.png", "../../assets/images/AnimalBlueBubbleWand.png", "../../assets/images/AnimalPurpleBubbleWand.png"];
let bubbleSize = 0;
let maxBubbleSize = 100;
let totalBubbles = 0;
let chosenWand = 0;
let canvas;

let gamePhase = "trace";

let circleX = 350;
let circleY = 145;
let circleRadius = 75;

let traceProgress = 0;
let isTracing = false;
let lastTraceAngle = 0;

let bubbleX = 210;
let bubbleY = 70;
let bubbleReady = false;

document.querySelectorAll(".wand-card").forEach(function(button) {

  button.addEventListener("click", function() {
    chosenWand = Number(button.dataset.wand);
    let selectedImage = wandImages[chosenWand];
    document.getElementById("selected-wand-image").src = selectedImage;
    document.getElementById("selection-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "block";
    resetRound();
  });
});


function setup() {
  document.getElementById("game-screen").style.display = "none";
  let container = document.getElementById("bubble-container");
  canvas = createCanvas(500, 250);
  canvas.parent(container);
  let wandImgElement = document.getElementById("selected-wand-image");
  wandImgElement.after(canvas.elt);
  canvas.elt.style.touchAction = "none";
}

function draw() {
  clear();
  if (gamePhase === "trace") {
    drawTracingCircle();
  }
  if (gamePhase === "bubble") {
    if (!bubbleReady) {
      bubbleSize += 1.5;

      if (bubbleSize >= maxBubbleSize) {
        bubbleSize = maxBubbleSize;
        bubbleReady = true;
        document.getElementById("message").innerText = "Pop Bubble!";
      }
    }

    if (bubbleSize > 0) {
      drawOrganicBubble(bubbleX, bubbleY, bubbleSize);
    }

    fill(51);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(18);
  
    let fingerBounce = sin(frameCount * .12) * 3;
    textSize(30);
    let fingerX = bubbleX + 30; 
    let fingerY = bubbleY - bubbleSize / 2 + 50 + fingerBounce;
    text("POP!", fingerX, fingerY);
  }
}

function drawTracingCircle() {
  textAlign(CENTER, CENTER);
  textSize(18);
  fill(51);
  noStroke();

  let totalDots = 40;

  for (let i = 0; i < totalDots; i++) {
    let angle = -HALF_PI + (i / totalDots) * TWO_PI;

    let x = circleX + cos(angle) * circleRadius;
    let y = circleY + sin(angle) * circleRadius;

    if (i < traceProgress * totalDots) {
      fill('rgb(0, 255, 0)');
    } else {
      fill(200);
    }

    noStroke();
    circle(x, y, 11);
  }

  let pulse = 20 + sin(frameCount * 0.1) * 4;
  fill(50, 230, 80);
  circle(circleX, circleY - circleRadius, pulse);
  fill(51);
  textSize(17);
  text("START HERE!", circleX, circleY - circleRadius - 22);

  // Draw the clockwise arrow
  drawClockwiseArrow();
}

function drawClockwiseArrow() {
  let arrowRadius = circleRadius + 22;

  noFill();
  stroke(255, 190, 40);
  strokeWeight(5);

  arc(circleX,circleY,arrowRadius * 2,arrowRadius * 2, -PI / 3,PI / 3 );


  let angle = PI / 3;
  let tipX = circleX + cos(angle) * arrowRadius;
  let tipY = circleY + sin(angle) * arrowRadius;
  let directionX = -sin(angle);
  let directionY = cos(angle);
  let backX = tipX - directionX * 16;
  let backY = tipY - directionY * 16;
  let sideX = -directionY * 9;
  let sideY = directionX * 9;

  line(tipX, tipY, backX + sideX, backY + sideY);
  line(tipX, tipY, backX - sideX, backY - sideY);
  noStroke();
}

function startTracing(x, y) {
  if (gamePhase !== "trace") return;

  let startX = circleX;
  let startY = circleY - circleRadius;
  let distanceFromStart = dist(x, y, startX, startY);

  if (distanceFromStart < 25) {
    isTracing = true;
    traceProgress = 0;
    lastTraceAngle = atan2(y - circleY, x - circleX);
  }
}

function continueTracing(x, y) {
  if (!isTracing || gamePhase !== "trace") return;
  let currentDistance = dist(x, y, circleX, circleY);

  if (abs(currentDistance - circleRadius) > 30) {
    return;
  }

  let currentAngle = atan2(y - circleY,x - circleX);
  let angleDifference = currentAngle - lastTraceAngle;

  while (angleDifference > PI) {
    angleDifference -= TWO_PI;
  }

  while (angleDifference < -PI) {
    angleDifference += TWO_PI;
  }

  if (angleDifference > 0) {
    traceProgress += angleDifference / TWO_PI;
  }

  lastTraceAngle = currentAngle;

  if (traceProgress >= 0.98) {
    traceProgress = 1;
    isTracing = false;
    gamePhase = "bubble";
    bubbleSize = 0;
    bubbleReady = false;

    document.getElementById("message").innerText = "Hurray!";
  }
}

function stopTracing() {
  if (gamePhase === "trace" && isTracing) {
    isTracing = false;
    if (traceProgress < 0.98) {
      triggerBubbleFailure();
    }
  }
}

function drawOrganicBubble(x, y, currentSize) {
  push();
  translate(x, y);
  let wobbleFactor = map(currentSize, 0, maxBubbleSize, 1, 7);

  stroke(180, 210, 255, 220);
  strokeWeight(2.5);
  fill(230, 245, 255, 55);
  beginShape();

  for (let a = 0; a < TWO_PI; a += 0.15) {
    let xoff = map(cos(a), -1, 1, 0, 1.5);
    let yoff = map(sin(a), -1, 1, 0, 1.5);
    let r = (currentSize / 2) + noise(xoff, yoff, frameCount * 0.04) * wobbleFactor;
    vertex(r * cos(a), r * sin(a));
  }

  endShape(CLOSE);
  noStroke();
  fill(255, 255, 255, 190);

  ellipse(-currentSize * 0.18, -currentSize * 0.18, currentSize * 0.12, currentSize * 0.08);
  pop();
}

function mousePressed() {
  if (gamePhase === "trace") {
    startTracing(mouseX, mouseY);
  }else if (gamePhase === "bubble" && bubbleReady) {
    let distanceFromBubble = dist(mouseX, mouseY, bubbleX, bubbleY);

    if (distanceFromBubble < bubbleSize / 2 + 15) {
      triggerBubbleSuccess();
    }
  }
}

function mouseDragged() {
  continueTracing(mouseX, mouseY);
  return false;
}

function mouseReleased() {
  stopTracing();
}

function touchStarted() {
  if (gamePhase === "trace") {
    startTracing(mouseX, mouseY);
  }else if (gamePhase === "bubble" && bubbleReady) {
    let distanceFromBubble = dist(mouseX, mouseY, bubbleX, bubbleY);

    if (distanceFromBubble < bubbleSize / 2 + 15) {
      triggerBubbleSuccess();
    }
  }
  return false;
}

function touchMoved() {
  continueTracing(mouseX, mouseY);
  return false;
}

function touchEnded() {
  stopTracing();
  return false;
}

function triggerBubbleSuccess() {
  if (gamePhase !== "bubble" || !bubbleReady) return;
  gamePhase = "success";
  totalBubbles++;
  document.getElementById("score").innerText = totalBubbles;
  document.getElementById("next-button").style.display = "block";
  setTimeout(function() {
    resetRound();
    document.getElementById("message").innerText = "Let's make another bubble!";
  }, 1200);

}

function triggerBubbleFailure() {
  gamePhase = "failed";
  isTracing = false;
  totalBubbles = 0;
  document.getElementById("score").innerText = 0;
  document.getElementById("message").innerText ="Oops!Try again!";
  document.getElementById("try-again-button").style.display = "block";
}

function resetRound() {
  bubbleSize = 0;
  traceProgress = 0;
  bubbleReady = false;
  isTracing = false;
  gamePhase = "trace";
  document.getElementById("try-again-button").style.display = "none";
}

function resetGame() {
  totalBubbles = 0;
  document.getElementById("score").innerText = 0;
  resetRound();

}