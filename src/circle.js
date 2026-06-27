// Circles. They don't like squares — when the player gets close, they flinch, then roll away.
const FLINCH_DURATION = 20; // frames spent startled before a circle actually flees

const circles = [
  { x: 300, y: 360, radius: 20, speed: 3, fleeRange: 150, state: 'idle', flinchTimer: 0 },
  { x: 550, y: 360, radius: 20, speed: 3, fleeRange: 150, state: 'idle', flinchTimer: 0 }
];

function updateCircles(player) {
  for (const circle of circles) {
    const dx = circle.x - (player.x + player.size / 2);
    const dy = circle.y - (player.y + player.size / 2);
    const distance = Math.hypot(dx, dy);

    if (distance < circle.fleeRange) {
      if (circle.state === 'idle') {
        circle.state = 'flinching';
        circle.flinchTimer = FLINCH_DURATION;
      } else if (circle.state === 'flinching') {
        circle.flinchTimer--;
        if (circle.flinchTimer <= 0) circle.state = 'fleeing';
      } else if (circle.state === 'fleeing') {
        // Roll away from the player, faster the closer they get.
        const direction = dx > 0 ? 1 : -1;
        circle.x += direction * circle.speed;
      }
    } else {
      circle.state = 'idle';
    }

    // Stay on the ground, same as the player.
    circle.y = level.groundY - circle.radius;

    // Keep circles from rolling off the edges of the canvas.
    circle.x = Math.max(circle.radius, Math.min(800 - circle.radius, circle.x));
  }
}

function drawCircles(ctx) {
  for (const circle of circles) {
    ctx.fillStyle = '#ffd0a0';
    ctx.save();
    ctx.translate(circle.x, circle.y);

    if (circle.state === 'flinching') {
      // Jittery squash-and-stretch while startled, before bolting.
      const wobble = Math.sin(circle.flinchTimer * 2) * 0.15;
      ctx.scale(1 + wobble, 1 - wobble);
    }

    ctx.beginPath();
    ctx.arc(0, 0, circle.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
