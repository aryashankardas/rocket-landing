const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
const keyMap = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
}

let state = {
  x: (width/2),
  y: (height/2),
  pressedKeys: {
    left: false,
    right: false,
    up: false,
    down: false
  }
};

function keydown(event) {
  var key = keyMap[event.keyCode]
  state.pressedKeys[key] = true
}

function keyup(event) {
  var key = keyMap[event.keyCode]
  state.pressedKeys[key] = false
}

window.addEventListener("keydown", keydown, false)
window.addEventListener("keyup", keyup, false)

function update(progress) {
  if (state.pressedKeys.left) state.x -= progress;
  if (state.pressedKeys.right) state.x += progress;
  if (state.pressedKeys.up) state.y -= progress;
  if (state.pressedKeys.down) state.y += progress;

  if (state.x > width) state.x -= width+50;
  else if (state.x < -50) state.x += width+50;
  if (state.y > height) state.y -= height+50;
  else if (state.y < -50) state.y += height+50;
}

function draw() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#fff";
  ctx.fillRect(state.x - 5, state.y - 5, 50, 50);
}

function loop(timestamp) {
  let progress = timestamp - lastRender;
  update(progress);
  draw();
  lastRender = timestamp;
  window.requestAnimationFrame(loop);
}

let lastRender = 0;
window.requestAnimationFrame(loop);