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
let obstacleContainer = document.getElementById("obstacleContainer");

function createObstacle() {
    let obstacleContainerWidth = obstacleContainer.offsetWidth;
    generateObstaclePosition();
    let startPositionPixels = (startPosition / 100) * obstacleContainerWidth;
    let obstacle = {
        id: obstacleArray.length,
        element: document.createElement('div'),
    }
    obstacle.element.classList.add("obstacle");
    obstacle.element.style.left = startPositionPixels + 'px';
    obstacleArray.push(obstacle);
    obstacleContainer.appendChild(obstacle.element);
    advanceObstacle(obstacle);
}

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
    obstacleContainer.removeChild(obstacle.element);
    obstacleArray.splice(obstacleArray.indexOf(obstacle), 1);
}

function showScore(score) {
    score_display.textContent = "Score: " + score;
}

function collisionCheck(obstacle) {
    let obstacleLocation = obstacle.element.getBoundingClientRect();
    let planeLocation = plane.getBoundingClientRect();
    if (
        obstacleLocation.top < planeLocation.bottom &&
        obstacleLocation.right > planeLocation.left &&
        obstacleLocation.bottom > planeLocation.top &&
        obstacleLocation.left < planeLocation.right
    ) gameOver();
}

let projectileArray = [];
let projectileContainer = document.getElementById("projectileContainer");
let projectile = null;


function createProjectile () {
    if (pressedKeys['x']) {
        let planeLocation = plane.getBoundingClientRect();
        let projectilePosition = planeLocation.left;
        projectile = {
            id: projectileArray.length,
            unit: document.createElement("div"),
        }
        projectile.unit.classList.add("projectile");
        projectile.unit.style.left = projectilePosition + 'px';
        projectileArray.push(projectile);
        projectileContainer.appendChild(projectile.unit);
    
    }
    advanceProjectile(projectile);
}

let projectileBottom = [];
let topEdge = window.innerHeight;

function advanceProjectile(projectile) {
    if (projectile !== null) { 
        let projectileBottomValue = parseInt(projectile.unit.style.bottom) || 0;
        projectileBottom[projectile.id] = projectileBottomValue;
        if (topEdge > projectileBottom[projectile.id]) {
            projectileBottom[projectile.id] += moveInterval;
            projectile.unit.style.bottom = projectileBottom[projectile.id] + "px";
            projectile.unit.textContent = projectile.id;
        } else {
            removeProjectile(projectile);
        }
        hitCheck(projectile);
    }
}

function hitCheck(projectile) {
    if (projectile !== null) { 
        let projectileLocation = projectile.unit.getBoundingClientRect();
        obstacleArray.forEach(obstacle => {
            let obstacleLocation = obstacle.element.getBoundingClientRect();
            if (
                projectileLocation.bottom > obstacleLocation.top &&
                projectileLocation.top < obstacleLocation.bottom &&
                projectileLocation.right > obstacleLocation.left &&
                projectileLocation.left < obstacleLocation.right
           ) {
                removeProjectile(projectile);
                removeObstacle(obstacle);
                ++score;
                showScore(score);
            }
        });
    }
}

function removeProjectile(projectile) {
    projectileContainer.removeChild(projectile.unit);
    projectileArray.splice(projectileArray.indexOf(projectile), 1);
}

let message = document.getElementById("gameOver");

function gameOver() {
    clearInterval(moveObstacleInterval);
    clearInterval(createObstaclesInterval);
    message.textContent = "Game Over!";
    message.classList.add("gameOverStyle");
}

let createObstaclesInterval = setInterval(createObstacle, 1000); //frecventa cu care sunt create obstacolele
let moveObstacleInterval = setInterval(function() { // viteza cu care se misca obstacolele
    obstacleArray.forEach(advanceObstacle);
}, 100);
let moveProjectilesInterval = setInterval(function() {
    projectileArray.forEach(advanceProjectile);
}, 100);

let keyPressed = {};

document.addEventListener('keydown', (e) => {
    pressedKeys[e.key] = true;
    setInterval(moveAirPlane, 1000);
    if (!keyPressed[e.key]) {
        keyPressed[e.key] = true;
        createProjectile();        
    }
});

document.addEventListener('keyup', (e) => {
    delete pressedKeys[e.key];
    keyPressed[e.key] = false;
});
