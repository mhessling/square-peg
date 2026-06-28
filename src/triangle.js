// Triangles. They always rotate so a flat edge stays parallel to the
// square's nearest face, "turning their backs" on it rather than facing it.
const TURN_SPEED = 0.08; // max radians a triangle can rotate per frame

let triangles = [];

// Replace the active triangles with a fresh set, e.g. when entering a new room.
function resetTriangles(defs) {
  triangles = defs.map(def => ({ ...def }));
}

resetTriangles(level.current.triangleDefs);

function updateTriangles(player) {
  const squareCenterX = player.x + player.size / 2;
  const squareCenterY = player.y + player.size / 2;

  for (const triangle of triangles) {
    const dx = triangle.x - squareCenterX;
    const dy = triangle.y - squareCenterY;

    // Point the apex straight away from the square, along whichever axis
    // the square is nearer on. That puts the flat opposite edge parallel
    // to the square's nearest face, with its back to the square.
    let targetAngle;
    if (Math.abs(dx) >= Math.abs(dy)) {
      targetAngle = dx >= 0 ? 0 : Math.PI;
    } else {
      targetAngle = dy >= 0 ? Math.PI / 2 : -Math.PI / 2;
    }

    triangle.angle = stepTowardAngle(triangle.angle, targetAngle, TURN_SPEED);

    level.resolveTriangleCollision(triangle);
  }
}

// Rotate `angle` towards `target` by at most `step`, taking the shorter way around.
function stepTowardAngle(angle, target, step) {
  const diff = Math.atan2(Math.sin(target - angle), Math.cos(target - angle));
  if (Math.abs(diff) <= step) return angle + diff;
  return angle + Math.sign(diff) * step;
}

// The triangle's 3 corners in world space — its actual shape, for exact collision and drawing.
function triangleVertices(triangle) {
  const verts = [];
  for (let i = 0; i < 3; i++) {
    const a = triangle.angle + (i * 2 * Math.PI) / 3;
    verts.push({
      x: triangle.x + Math.cos(a) * triangle.radius,
      y: triangle.y + Math.sin(a) * triangle.radius
    });
  }
  return verts;
}

// The square shouldn't be able to walk through a triangle — push it back out
// on overlap, using the triangle's exact shape rather than a bounding circle.
function resolvePlayerTriangleCollisions(player) {
  for (const triangle of triangles) {
    const mtv = polygonMTV(
      rectVertices(player.x, player.y, player.size, player.size),
      triangleVertices(triangle)
    );
    if (mtv) {
      player.x += mtv.x;
      player.y += mtv.y;
      player.vx = 0;
      player.vy = 0;
    }
  }
}

function drawTriangles(ctx) {
  ctx.fillStyle = '#4caf50';
  for (const triangle of triangles) {
    const verts = triangleVertices(triangle);
    ctx.beginPath();
    ctx.moveTo(verts[0].x, verts[0].y);
    ctx.lineTo(verts[1].x, verts[1].y);
    ctx.lineTo(verts[2].x, verts[2].y);
    ctx.closePath();
    ctx.fill();
  }
}
