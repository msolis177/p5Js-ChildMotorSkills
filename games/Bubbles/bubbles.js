let wandImages = ["../../assets/images/wand2.png", "../../assets/images/wand1.jpg", "../../assets/images/wand3.png"];
let bubbleSize = 0;
let maxBubbleSize = 180;
let chargePercent = 0;
let isGrowing = false;
let totalBubbles = 0;

let chosenWand = 0;
let canvas;
let startTouchDist = 0; 

document.querySelectorAll(".wand-card").forEach(function(button) {
  button.addEventListener("click", function() {
    chosenWand = Number(button.dataset.wand);
    let wandImage = button.querySelector("img");

    document.getElementById("selected-wand-image").src = wandImage.src;
    document.getElementById("selection-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "block";

    bubbleSize = 0;
    chargePercent = 0;
    isGrowing = false;
  });
});

function setup() {
  document.getElementById("game-screen").style.display = "none";
  let container = document.getElementById("bubble-container");
  
  canvas = createCanvas(400, 250);
  canvas.parent(container);
  
  let wandImgElement = document.getElementById("selected-wand-image");
  wandImgElement.after(canvas.elt);
}

function draw() {
  clear();
  handleGestureInput();

  if (isGrowing && chargePercent < 100) {
    chargePercent += 0.8; 
    bubbleSize = map(chargePercent, 0, 100, 0, maxBubbleSize);
    
    if (chargePercent >= 100) {
      chargePercent = 100;
      triggerBubbleSuccess();
    }
  }
  if (bubbleSize > 0) {
    drawOrganicBubble(40, height / 2, bubbleSize);
  }
  updateHTMLProgressBar();
}

function drawOrganicBubble(x, y, currentSize) {
  push();
  translate(x, y);
  
  let wobbleFactor = map(chargePercent, 0, 100, 1, 7); 
  
  stroke(180, 210, 255, 220);
  strokeWeight(2.5);
  fill(230, 245, 255, 45); 
  beginShape();
  for (let a = 0; a < TWO_PI; a += 0.15) {
    let xoff = map(cos(a), -1, 1, 0, 1.5);
    let yoff = map(sin(a), -1, 1, 0, 1.5);
    let r = (currentSize / 2) + noise(xoff, yoff, frameCount * 0.04) * wobbleFactor;
    let bx = r * cos(a);
    let by = r * sin(a);
    vertex(bx, by);
  }
  endShape(CLOSE);
  noStroke();
  fill(255, 255, 255, 190);
  ellipse(-currentSize * 0.18, -currentSize * 0.18, currentSize * 0.12, currentSize * 0.08);
  pop();
}

function handleGestureInput() {
  if (touches.length === 2) {
    let currentDist = dist(touches[0].x, touches[0].y, touches[1].x, touches[1].y);
    
    if (startTouchDist === 0) {
      startTouchDist = currentDist;
    } else if (currentDist > startTouchDist + 10) {
      isGrowing = true;
    }
  } else {
    startTouchDist = 0;
  }
}

function mousePressed() {
  if (touches.length < 2) {
    isGrowing = true;
  }
}

function mouseReleased() {
  if (touches.length < 2) {
    isGrowing = false;
  }
}

function updateHTMLProgressBar() {
  let progressBar = document.querySelector(".progress-bar");
  if (progressBar) {
    progressBar.style.background = `linear-gradient(to right, #a8ff78 ${chargePercent}%, #eef2f3 ${chargePercent}%)`;
  }
}

function triggerBubbleSuccess() {
  isGrowing = false;
  totalBubbles++;
  document.getElementById("score").innerText = totalBubbles;
  document.getElementById("message").innerText = "Success! Bubble blown! 🎉";
  
  setTimeout(() => {
    bubbleSize = 0;
    chargePercent = 0;
    document.getElementById("message").innerText = "Spread two fingers to blow another bubble!";
  }, 1200);
}
