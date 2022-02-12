// https://www.sitepoint.com/quick-tip-game-loop-in-javascript/

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const keyMap = {
    37: 'left',
    38: 'up',
    39: 'right'
};

const gameMechanics = {
    gravity: .005,
    rocket_acceleration: .01,
    rocket_angular_acceleration: .0001
};
let gameState = {
    rocket: {
        x: 100,
        y: 670,
        width: 25,
        height: 100,
        angle: 0,
        x_speed: 0,
        y_speed: -10,
        angular_speed: 0
    },
    pressedKeys: {
        left: false,
        up: false,
        right: false
    }
};

window.addEventListener("keydown", function() {
    let key = keyMap[event.keyCode];
    gameState.pressedKeys[key] = true;
}, false);

window.addEventListener("keyup", function() {
    let key = keyMap[event.keyCode];
    gameState.pressedKeys[key] = false;
}, false);

function updateAngle(renderTime) {
    if (gameState.pressedKeys.left) {
        gameState.rocket.angular_speed -= renderTime * gameMechanics.rocket_angular_acceleration;
    } else if (gameState.pressedKeys.right) {
        gameState.rocket.angular_speed += renderTime * gameMechanics.rocket_angular_acceleration;
    }
    gameState.rocket.angle += gameState.rocket.angular_speed;
};

function updateMovement(renderTime) {
    gameState.rocket.y_speed += renderTime * gameMechanics.gravity;

    if (gameState.pressedKeys.up) {
        gameState.rocket.x_speed += renderTime * gameMechanics.rocket_acceleration * Math.cos(gameState.rocket.angle - (Math.PI / 2));
        gameState.rocket.y_speed += renderTime * gameMechanics.rocket_acceleration * Math.sin(gameState.rocket.angle - (Math.PI / 2));
    }

    gameState.rocket.x += gameState.rocket.x_speed;
    gameState.rocket.y += gameState.rocket.y_speed;

    cornerXs = [
        gameState.rocket.x + ((gameState.rocket.width / 2) * Math.cos(gameState.rocket.angle)) - ((gameState.rocket.height / 2) * Math.sin(gameState.rocket.angle)),
        gameState.rocket.x + ((-gameState.rocket.width / 2) * Math.cos(gameState.rocket.angle)) - ((gameState.rocket.height / 2) * Math.sin(gameState.rocket.angle)),
        gameState.rocket.x + ((-gameState.rocket.width / 2) * Math.cos(gameState.rocket.angle)) - ((-gameState.rocket.height / 2) * Math.sin(gameState.rocket.angle)),
        gameState.rocket.x + ((gameState.rocket.width / 2) * Math.cos(gameState.rocket.angle)) - ((-gameState.rocket.height / 2) * Math.sin(gameState.rocket.angle))
    ];
    cornerYs = [
        gameState.rocket.y + ((gameState.rocket.width / 2) * Math.sin(gameState.rocket.angle)) + ((gameState.rocket.height / 2) * Math.cos(gameState.rocket.angle)),
        gameState.rocket.y + ((-gameState.rocket.width / 2) * Math.sin(gameState.rocket.angle)) + ((gameState.rocket.height / 2) * Math.cos(gameState.rocket.angle)),
        gameState.rocket.y + ((-gameState.rocket.width / 2) * Math.sin(gameState.rocket.angle)) + ((-gameState.rocket.height / 2) * Math.cos(gameState.rocket.angle)),
        gameState.rocket.y + ((gameState.rocket.width / 2) * Math.sin(gameState.rocket.angle)) + ((-gameState.rocket.height / 2) * Math.cos(gameState.rocket.angle))
    ];
    let maxX = Math.max.apply(Math, cornerXs);
    let maxY = Math.max.apply(Math, cornerYs);
    let minX = Math.min.apply(Math, cornerXs);
    let minY = Math.min.apply(Math, cornerYs);

    
    if (minX < 0) {
        let theta = Math.abs(((gameState.rocket.angle + (100 * Math.PI)) % Math.PI) - (Math.PI / 2)) - Math.asin(gameState.rocket.width / gameState.rocket.height);
        let dist = Math.sqrt((gameState.rocket.height ** 2) + (gameState.rocket.width ** 2)) / 2;
        let newX = dist * Math.cos(theta);

        gameState.rocket.x = newX;
        gameState.rocket.x_speed = 0;
        gameState.rocket.y_speed = 0;
    }

    if (maxX > canvas.width) {
        let theta = Math.abs(((gameState.rocket.angle + (100 * Math.PI)) % Math.PI) - (Math.PI / 2)) - Math.asin(gameState.rocket.width / gameState.rocket.height);
        let dist = Math.sqrt((gameState.rocket.height ** 2) + (gameState.rocket.width ** 2)) / 2;
        let newX = canvas.width - (dist * Math.cos(theta));

        gameState.rocket.x = newX;
        gameState.rocket.x_speed = 0;
        gameState.rocket.y_speed = 0;
    }

    if (minY < 0) {
        let theta = Math.abs(((gameState.rocket.angle + (199 * Math.PI / 2)) % Math.PI) - (Math.PI / 2)) - Math.asin(gameState.rocket.width / gameState.rocket.height);
        let dist = Math.sqrt((gameState.rocket.height ** 2) + (gameState.rocket.width ** 2)) / 2;
        let newY = dist * Math.cos(theta);

        gameState.rocket.y = newY;
        gameState.rocket.x_speed = 0;
        gameState.rocket.y_speed = 0;
    }

    if (maxY > canvas.height) {
        let theta = Math.abs(((gameState.rocket.angle + (199 * Math.PI / 2)) % Math.PI) - (Math.PI / 2)) - Math.asin(gameState.rocket.width / gameState.rocket.height);
        let dist = Math.sqrt((gameState.rocket.height ** 2) + (gameState.rocket.width ** 2)) / 2;
        let newY = canvas.height - (dist * Math.cos(theta));

        gameState.rocket.y = newY;
        gameState.rocket.x_speed = 0;
        gameState.rocket.y_speed = 0;
    }
};

function updateGameState(renderTime) {
    updateAngle(renderTime);
    updateMovement(renderTime);
};

function drawFrame() {
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.translate(gameState.rocket.x, gameState.rocket.y);
    ctx.rotate(gameState.rocket.angle);

    ctx.fillStyle = "white";
    ctx.fillRect(-(gameState.rocket.width / 2), -(gameState.rocket.height / 2), gameState.rocket.width, gameState.rocket.height);

    ctx.restore();

    ctx.fillStyle = "red";
    ctx.fillRect(cornerXs[0], cornerYs[0], 3, 3);
    ctx.fillRect(cornerXs[1], cornerYs[1], 3, 3);
    ctx.fillStyle = "blue";
    ctx.fillRect(cornerXs[2], cornerYs[2], 3, 3);
    ctx.fillRect(cornerXs[3], cornerYs[3], 3, 3);
};

function loop(currentRender) {
    let renderTime = currentRender - lastRender;
    
    updateGameState(renderTime);
    drawFrame();

    lastRender = currentRender;
    window.requestAnimationFrame(loop);
};

let lastRender = 0;
window.requestAnimationFrame(loop);