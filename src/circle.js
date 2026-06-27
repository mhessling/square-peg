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
  }

  resolveCircleCollisions();

  for (const circle of circles) {
    // Keep circles from rolling off the edges of the canvas.
    circle.x = Math.max(circle.radius, Math.min(800 - circle.radius, circle.x));
  }
}

// Circles shouldn't overlap each other — push overlapping pairs apart.
function resolveCircleCollisions() {
  for (let i = 0; i < circles.length; i++) {
    for (let j = i + 1; j < circles.length; j++) {
      const a = circles[i];
      const b = circles[j];
      const dx = b.x - a.x;
      const overlap = a.radius + b.radius - Math.abs(dx);

      if (overlap > 0) {
        const direction = dx >= 0 ? 1 : -1;
        const push = overlap / 2;
        a.x -= direction * push;
        b.x += direction * push;
      }
    }
  }
}

// The square shouldn't be able to walk through a circle — push it back out on overlap.
function resolvePlayerCollisions(player) {
  for (const circle of circles) {
    const px0 = player.x, px1 = player.x + player.size;
    const py0 = player.y, py1 = player.y + player.size;
    const cx0 = circle.x - circle.radius, cx1 = circle.x + circle.radius;
    const cy0 = circle.y - circle.radius, cy1 = circle.y + circle.radius;

    const overlapX = Math.min(px1, cx1) - Math.max(px0, cx0);
    const overlapY = Math.min(py1, cy1) - Math.max(py0, cy0);

    if (overlapX <= 0 || overlapY <= 0) continue;

    if (overlapX < overlapY) {
      // Push out sideways.
      if (player.x + player.size / 2 < circle.x) player.x -= overlapX;
      else player.x += overlapX;
      player.vx = 0;
    } else {
      // Push out vertically.
      if (player.y + player.size / 2 < circle.y) {
        player.y -= overlapY;
        player.vy = 0;
        player.onGround = true;
      } else {
        player.y += overlapY;
        player.vy = 0;
      }
    }
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
