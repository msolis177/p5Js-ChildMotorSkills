function setup() { 
    let cnv = createCanvas(400, 400);
    cnv.parent('canvas-container'); 
}

function draw() {
     background(220);
     fill('red');
     ellipse(width / 2, height / 2, 50, 50);
}