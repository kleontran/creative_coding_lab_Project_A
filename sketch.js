let clouds = [];
const NUM_CLOUDS = 30;
let mousePressedDuration = 0;
let attractingWind = false;
let windStrength = 0;

let x1, y1, x2, y2, x3, y3;
let tailPoints = [];
const TAIL_LENGTH = 20;
let angle1 = 0;
let angle2 = 0;
let angle3 = 0;
let speedX1, speedX2, speedX3;
let triangleColor = 'white';
let sizeFactor = 1;

function setup() {
    createCanvas(800, 800);
    initializeVertices();
    initializeClouds();
    initializeTail();
}

function initializeVertices() {
    x1 = width / 2 - 10;
    x2 = width / 2;
    x3 = width / 2 + 10;
    speedX1 = 0.5;
    speedX2 = 0.5;
    speedX3 = 0.5;
}

function initializeClouds() {
    for (let i = 0; i < NUM_CLOUDS; i++) {
        let cloud = {
            x: random(-100, width),
            y: random(height / 3),
            size: random(50, 100)
        };
        clouds.push(cloud);
    }
}

function initializeTail() {
    for (let i = 0; i < TAIL_LENGTH; i++) {
        tailPoints.push({
            x: x3,
            y: y3 + i * 5
        });
    }
}

function drawClouds() {
    fill(255);
    noStroke();
    for (let cloud of clouds) {
        ellipse(cloud.x, cloud.y, cloud.size, cloud.size / 2);
        cloud.x += 1;
        if (cloud.x > width + 100) {
            cloud.x = -100;
            cloud.y = random(height / 3);
            cloud.size = random(50, 100);
        }
    }
}

function drawRoad() {
    fill(50, 50, 50); 
    rect(0, height * 0.75, width, height * 0.25);
    
    fill(255); 
    for (let i = 0; i < width; i += 40) {
        rect(i + frameCount % 40, height * 0.85, 20, 5); 
    }
}

function updateVertices() {
    if (attractingWind) {
        let direction = atan2(mouseY - (y1 + y2 + y3) / 3, mouseX - (x1 + x2 + x3) / 3);
        let force = windStrength * 0.5;
        x1 += cos(direction) * force;
        x2 += cos(direction) * force;
        x3 += cos(direction) * force;
    } else {
        x1 += speedX1;
        x2 += speedX2;
        x3 += speedX3;
    }

    let buffer = 50;
    if (x1 < buffer || x3 > width - buffer) {
        speedX1 = -speedX1;
        speedX2 = -speedX2;
        speedX3 = -speedX3;
    }
}

function draw() {
    background('skyblue');
    drawClouds();
    drawRoad();
    updateVertices();
    calculateYValues();
    drawTriangle();
    updateTail();
    drawTail();

    if (mouseIsPressed) {
        mousePressedDuration++;
        if (mousePressedDuration > 30) {
            attractingWind = true;
            windStrength += 0.05;
            windStrength = constrain(windStrength, 0, 5);
        }
    } else {
        mousePressedDuration = 0;
        attractingWind = false;
        windStrength *= 0.95; 
    }
}

function calculateYValues() {
    y1 = height / 2 + 50 * sin(angle1) * sizeFactor;
    y2 = height / 2 + 50 * sin(angle2) * sizeFactor + 10;
    y3 = height / 2 + 50 * sin(angle3) * sizeFactor;
    angle1 += 0.02;
    angle2 += 0.03;
    angle3 += 0.04;
}

function drawTriangle() {
    fill(triangleColor);
    triangle(x1, y1, x2, y2, x3, y3);
}

function updateTail() {
    for (let i = tailPoints.length - 1; i > 0; i--) {
        tailPoints[i].x = tailPoints[i - 1].x;
        tailPoints[i].y = tailPoints[i - 1].y;
    }

    tailPoints[0].x = x3;
    tailPoints[0].y = y3;
}

function drawTail() {
    noFill();
    stroke(triangleColor);
    strokeWeight(2);
    
    beginShape();
    for (let point of tailPoints) {
        vertex(point.x, point.y);
    }
    endShape();
}

function mousePressed() {
    let centerX = (x1 + x2 + x3) / 3;
    let centerY = (y1 + y2 + y3) / 3;
    
    let distance = dist(centerX, centerY, mouseX, mouseY);
    if (distance < 50 && !attractingWind) {
        triangleColor = color(random(255), random(255), random(255));
        sizeFactor *= 0.9;
    }
}
