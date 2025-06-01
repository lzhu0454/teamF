let allCircles = [];
let lines = [];
let btn;

function setup() {
  createCanvas(600, 800);
  drawBackground();

  // Initialize the line segments of the tree
  lines = [
    {x1: 0, y1: -380, x2: 0, y2: 0},
    {x1: -160, y1: -300, x2: 160, y2: -300},
    {x1: -160, y1: -450, x2: -160, y2: -300},
    {x1: 160, y1: -400, x2: 160, y2: -300},
    {x1: -80, y1: -380, x2: 80, y2: -380},
    {x1: -100, y1: 0, x2: 100, y2: 0},
  ];

  // Add button
  btn = createButton('🌲 Generate Apple Tree 🍎');
  btn.position(80, 700);
  btn.mousePressed(drawCandy);

  // Style the button
  btn.style('background-color', '#FFB6B9');
  btn.style('color', '#ffffff');
  btn.style('font-size', '16px');
  btn.style('padding', '10px 20px');
  btn.style('border', 'none');
  btn.style('border-radius', '12px');
  btn.style('cursor', 'pointer');
  btn.style('box-shadow', '2px 2px 8px rgba(0, 0, 0, 0.2)');
  btn.style('transition', 'all 0.3s ease-in-out');
  btn.style('font-family', 'Helvetica, sans-serif');

  btn.mouseOver(() => btn.style('background-color', '#ff9aa2'));
  btn.mouseOut(() => btn.style('background-color', '#FFB6B9'));
}

function drawBackground() {
  background(199, 244, 255);
  noStroke();
  fill('#7E94BE');
  rect(37, 35, 525, 718, 20); // Blue card background

  push();
  translate(width / 2, height / 2 + 200);

  fill('#65C18D');  // Green bottom rectangle
  stroke('#373A7D');
  strokeWeight(2);
  rect(-262, 0, 523, 86);

  fill('#FFF28C');  // Yellow base
  noStroke();
  rect(-115, 0, 225, 70);
  pop();
}

function drawCandy() {
  drawBackground();   // Redraw background
  allCircles = [];    // Clear previous circles

  push();
  translate(width / 2, height / 2 + 200);
  for (let lineSegment of lines) {
    drawCirclesOnLine(lineSegment.x1, lineSegment.y1, lineSegment.x2, lineSegment.y2, allCircles);
  }

  // Draw tree lines
  stroke(234, 204, 70);
  strokeWeight(2);
  for (let lineSegment of lines) {
    line(lineSegment.x1, lineSegment.y1, lineSegment.x2, lineSegment.y2);
  }
  pop();
}

function drawCirclesOnLine(x1, y1, x2, y2, allCircles) {
  let len = dist(x1, y1, x2, y2);
  let dx = (x2 - x1) / len;
  let dy = (y2 - y1) / len;
  let pos = 0;

  while (pos < len) {
    let r = random(15, 40);
    let cx = x1 + dx * (pos + r);
    let cy = y1 + dy * (pos + r);

    // Adjust if near end of segment
    if (pos + r * 2 > len) {
      let remaining = len - pos;
      r = remaining / 2;
      if (r < 3) break;
      cx = x1 + dx * (pos + r);
      cy = y1 + dy * (pos + r);
    }

    // Check for overlap
    let overlapping = false;
    for (let c of allCircles) {
      if (dist(cx, cy, c.x, c.y) < (r + c.r) * 0.8 && !isNearIntersection(cx, cy)) {
        overlapping = true;
        break;
      }
    }

    if (!overlapping) {
      let angle = atan2(dy, dx);
      let isRedFirst = random() > 0.5;
      let color1 = isRedFirst ? [232, 80, 78] : [120, 161, 100];
      let color2 = isRedFirst ? [120, 161, 100] : [232, 80, 78];

      noStroke();
      fill(...color1);
      arc(cx, cy, r * 2, r * 2, angle, angle + PI);

      fill(...color2);
      arc(cx, cy, r * 2, r * 2, angle + PI, angle + TWO_PI);

      allCircles.push({x: cx, y: cy, r: r});
    }

    pos += r * 2 - 2;
  }
}

function isNearIntersection(x, y) {
  let threshold = 30;
  let intersections = [
    {x: 0, y: -300},
    {x: -160, y: -300},
    {x: 160, y: -300},
    {x: 0, y: 0}
  ];
  for (let p of intersections) {
    if (dist(x, y, p.x, p.y) < threshold) return true;
  }
  return false;
}