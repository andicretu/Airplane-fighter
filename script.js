let plane = document.getElementById("airplane");
let planePosition = plane.offsetLeft;
let moveInterval = 5;
let pressedKeys = {};

function moveAirPlane() {
    if (pressedKeys['ArrowLeft']) {
        planePosition -= moveInterval;
        plane.style.left = planePosition + 'px';
    } else if (pressedKeys['ArrowRight']) {
        planePosition += moveInterval;
        plane.style.left = planePosition + 'px';
    }
}

let startPosition = 0;

function generateObstaclePosition() {
    startPosition = Math.floor(Math.random() * 100);
}

let obstacleArray = [];
let container = document.getElementById("container");
let obstacleID = obstacleArray.length;

function createObstacle() {
    let containerWidth = container.offsetWidth;
    generateObstaclePosition();
    let startPositionPixels = (startPosition / 100) * containerWidth;
    let obstacle = {
        id: obstacleArray.length,
        element: document.createElement('div'),
    }
    obstacle.element.setAttribute('class', 'obstacle');
    obstacle.element.style.height = '75px';
    obstacle.element.style.width = '75px';
    obstacle.element.style.backgroundColor = 'red';
    obstacle.element.style.position = 'absolute';
    obstacle.element.style.top = '0';
    obstacle.element.style.transform = 'translateX(-50%)';
    obstacle.element.textContent = 'Obstacle';
    obstacle.element.style.left = startPositionPixels + 'px';
    obstacleArray.push(obstacle);
    container.appendChild(obstacle.element)
    advanceObstacle(obstacle);
}

let createObstaclesInterval = setInterval(createObstacle, 1000);
let obstacleVerticalPosition = 0;
let moveObstacleInterval = setInterval(function() {
    obstacleArray.forEach(advanceObstacle);
}, 100);

let obstacleTop = [];
let bottomEdge = window.innerHeight;
let score = 0;
let score_display = document.getElementById("score");

function advanceObstacle(obstacle) {
    let obstacleTopValue = parseInt(obstacle.element.style.top) || 0;
    obstacleTop[obstacle.id] = obstacleTopValue;
    if (bottomEdge >= obstacleTop[obstacle.id]) {
        obstacleTop[obstacle.id] += moveInterval;
        obstacle.element.style.top = obstacleTop[obstacle.id] + "px";
    } else { 
        removeObstacle(obstacle);
        ++score;
        showScore(score);
    }
    collisionCheck(obstacle);
}

function removeObstacle(obstacle) {
    container.removeChild(obstacle.element);
        obstacleArray.splice(obstacleArray.indexOf(obstacle), 1);
}

function showScore(score) {
    score_display.textContent = "Score: " + score;
}

function collisionCheck(obstacle) {
    let obstacleLocation = obstacle.element.getBoundingClientRect(); // Get the position of the obstacle
    let planeLocation = plane.getBoundingClientRect();
    if (
        obstacleLocation.top < planeLocation.bottom &&
        obstacleLocation.right > planeLocation.left &&
        obstacleLocation.bottom > planeLocation.top &&
        obstacleLocation.left < planeLocation.right
    ) gameOver();
}

let message = document.getElementById("gameOver");

function gameOver() {
    clearInterval(moveObstacleInterval);
    clearInterval(createObstaclesInterval);
    message.textContent = "Game Over!";
    message.classList.add("gameOverStyle");
}

document.addEventListener('keydown', (e) => {
    pressedKeys[e.key] = true;
    setInterval(moveAirPlane(), 1000);
});

document.addEventListener('keyup', (e) => {
    delete pressedKeys[e.key];
});
