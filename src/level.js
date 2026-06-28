// The map: a bounded room made of wall rectangles. No floor/gravity anymore —
// this is a top-down puzzle space, not a side-scroller.
const level = {
  width: 800,
  height: 450,

  walls: [
    // Border walls, keeping everything inside the canvas.
    { x: 0, y: 0, w: 800, h: 20 },
    { x: 0, y: 430, w: 800, h: 20 },
    { x: 0, y: 0, w: 20, h: 450 },
    { x: 780, y: 0, w: 20, h: 450 },
    // One interior wall, just to prove obstacles work.
    { x: 350, y: 150, w: 20, h: 150 }
  ],

  draw(ctx) {
    ctx.fillStyle = '#2a2a3d';
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.fillStyle = '#444466';
    for (const wall of this.walls) {
      ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
    }
  },

  // Push a square (the player) back out of any wall it's overlapping.
  resolveSquareCollision(square) {
    for (const wall of this.walls) {
      const overlapX = Math.min(square.x + square.size, wall.x + wall.w) - Math.max(square.x, wall.x);
      const overlapY = Math.min(square.y + square.size, wall.y + wall.h) - Math.max(square.y, wall.y);
      if (overlapX <= 0 || overlapY <= 0) continue;

      if (overlapX < overlapY) {
        if (square.x + square.size / 2 < wall.x + wall.w / 2) square.x -= overlapX;
        else square.x += overlapX;
        square.vx = 0;
      } else {
        if (square.y + square.size / 2 < wall.y + wall.h / 2) square.y -= overlapY;
        else square.y += overlapY;
        square.vy = 0;
      }
    }
  },

  // Push a circle back out of any wall it's overlapping.
  resolveCircleCollision(circle) {
    for (const wall of this.walls) {
      const closestX = Math.max(wall.x, Math.min(circle.x, wall.x + wall.w));
      const closestY = Math.max(wall.y, Math.min(circle.y, wall.y + wall.h));
      const dx = circle.x - closestX;
      const dy = circle.y - closestY;
      const distance = Math.hypot(dx, dy);

      if (distance < circle.radius && distance > 0) {
        const overlap = circle.radius - distance;
        circle.x += (dx / distance) * overlap;
        circle.y += (dy / distance) * overlap;
      }
    }
  }
};
