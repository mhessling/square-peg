// The game loop: clear screen, update everything, draw everything, repeat every frame.
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  player.update();
  updateCircles(player);
  resolvePlayerCollisions(player);

  level.draw(ctx);
  drawCircles(ctx);
  player.draw(ctx);

  requestAnimationFrame(loop);
}

loop();
