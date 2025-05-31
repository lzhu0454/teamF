function setup() {
  createCanvas(600, 800);
  background(199, 244, 255);

  // draw the blue card background
  noStroke();
  fill('#7E94BE');
  rect(37, 35, 525, 718, 20);  // x, y, width, height, border-radius


   // Move the origin of the coordinate system to (300, 600)
  translate(300, 600);

  // The green rectangle at the buttom
 fill('#65C18D');
 stroke('#373A7D');
 strokeWeight(2);
 rect(-262, 0, 523, 86);
 
  // The base of the tree
  fill('#FFF28C');
  rect(-115, 0, 225, 70);


  // Store all circle info on all lines for handling intersections
  let allCircles = [];
  
  // Create line of the tree
  let lines = [
    {x1: 0, y1: -380, x2: 0, y2: 0}, // line 1
    {x1: -160, y1: -300, x2: 160, y2: -300}, // line 2
    {x1: -160, y1: -450, x2: -160, y2: -300}, // line 3
    {x1: 160, y1: -400, x2: 160, y2: -300}, // line 4
    {x1: -80, y1: -380, x2: 80, y2: -380}, // line 5
    {x1: -100, y1: 0, x2: 100, y2: 0}, // line 6
  ];
  
  // Step1: Draw the circle of the line
  for (let lineSegment of lines) {
    drawCirclesOnLine(lineSegment.x1, lineSegment.y1, lineSegment.x2, lineSegment.y2, allCircles);
  }
  
  // Step2: Draw the lines
  stroke(234, 204, 70);
  strokeWeight(2);
  for (let lineSegment of lines) {
    line(lineSegment.x1, lineSegment.y1, lineSegment.x2, lineSegment.y2);
  }
}

function drawCirclesOnLine(x1, y1, x2, y2, allCircles) {
  // Calculate the length of the line
  let len = dist(x1, y1, x2, y2);
  let dx = (x2 - x1) / len;
  let dy = (y2 - y1) / len;

  let circles = [];  // This will store the circles for the current line segment
  let pos = 0;       // Position along the line segment
  
  while (pos < len) {
    let r = random(15, 40);  // radius of the circle
    
    // Calculate the position of the center of the circle
    let cx = x1 + dx * (pos + r);
    let cy = y1 + dy * (pos + r);
    
    // Check if it would exceed the line length
    if (pos + r * 2 > len) {
      // If too close and not at intersection, mark as overlapping
      let remainingSpace = len - pos;
      r = remainingSpace / 2;
      if (r < 3) break; // if radius is too small, stop adding circles
      cx = x1 + dx * (pos + r);
      cy = y1 + dy * (pos + r);
    }
    
    // Check overlap with existing circles (except intersections)
    let overlapping = false;
    for (let existingCircle of allCircles) {
      let distance = dist(cx, cy, existingCircle.x, existingCircle.y);
      let minDistance = r + existingCircle.r;
      
      // If too close and not at intersection, mark as overlapping
      if (distance < minDistance * 0.8) {
        // Allow slight overlap at intersections
        let isIntersection = isNearIntersection(cx, cy, x1, y1, x2, y2);
        if (!isIntersection) {
          overlapping = true;
          break;
        }
      }
    }
    
    if (!overlapping) {
      // Compute angle of the line
      let lineAngle = atan2(dy, dx);
      
      // decide the color of the half-circles randomly
      let isRedFirst = random() > 0.5;
      let color1 = isRedFirst ? [232, 80, 78] : [120, 161, 100]; // 红色或绿色
      let color2 = isRedFirst ? [120, 161, 100] : [232, 80, 78]; // 绿色或红色
      
      // draw the half circle
      fill(color1[0], color1[1], color1[2]);
      noStroke();
      arc(cx, cy, r * 2, r * 2, lineAngle, lineAngle + PI);
      
      // draw another half circle
      fill(color2[0], color2[1], color2[2]);
      noStroke();
      arc(cx, cy, r * 2, r * 2, lineAngle + PI, lineAngle + 2*PI);
      
      // add the circle to the current line's circles
      let circle = {x: cx, y: cy, r: r};
      circles.push(circle);
      allCircles.push(circle);
    }
    
    // move the position forward
    pos += r * 2 - 2; // reduce by 2 to avoid overlap
  }
}

// check if the point is near an intersection
function isNearIntersection(x, y, lineX1, lineY1, lineX2, lineY2) {
  // define a threshold for intersection proximity
  let intersectionThreshold = 30;
  
  // check if the point is near any of the intersection points
  if (dist(x, y, 400, 400) < intersectionThreshold) return true;
  if (dist(x, y, 200, 400) < intersectionThreshold) return true;
  if (dist(x, y, 600, 400) < intersectionThreshold) return true;
  if (dist(x, y, 400, 300) < intersectionThreshold) return true;
  
  return false;
}
