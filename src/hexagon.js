// Hexagons. They're bullies — they don't move themselves, but anything that
// touches one (the square, circles, triangles) gets shoved away along
// whichever face it hit, instead of just being blocked.
let hexagons = [];

// Replace the active hexagons with a fresh set, e.g. when entering a new room.
function resetHexagons(defs) {
  hexagons = defs.map(def => ({ ...def }));
}

resetHexagons(level.current.hexagonDefs);

// The hexagon's 6 corners in world space — its actual shape, for exact collision and drawing.
function hexagonVertices(hexagon) {
  const verts = [];
  for (let i = 0; i < 6; i++) {
    const a = (hexagon.angle || 0) + (i * Math.PI) / 3;
    verts.push({
      x: hexagon.x + Math.cos(a) * hexagon.radius,
      y: hexagon.y + Math.sin(a) * hexagon.radius
    });
  }
  return verts;
}

// Shove the player, circles, and triangles away from any hexagon they're
// touching, perpendicular to the face they hit.
function resolveHexagonCollisions(player, circles, triangles) {
  for (const hexagon of hexagons) {
    const verts = hexagonVertices(hexagon);

    const playerMtv = polygonMTV(rectVertices(player.x, player.y, player.size, player.size), verts);
    if (playerMtv) {
      player.x += playerMtv.x;
      player.y += playerMtv.y;
      player.vx = 0;
      player.vy = 0;
    }

    for (const circle of circles) {
      const circleMtv = circlePolygonMTV(circle, verts);
      if (circleMtv) {
        circle.x += circleMtv.x;
        circle.y += circleMtv.y;
      }
    }

    for (const triangle of triangles) {
      const triangleMtv = polygonMTV(triangleVertices(triangle), verts);
      if (triangleMtv) {
        triangle.x += triangleMtv.x;
        triangle.y += triangleMtv.y;
      }
    }
  }
}

function drawHexagons(ctx) {
  ctx.fillStyle = '#c0392b';
  for (const hexagon of hexagons) {
    const verts = hexagonVertices(hexagon);
    ctx.beginPath();
    ctx.moveTo(verts[0].x, verts[0].y);
    for (let i = 1; i < verts.length; i++) ctx.lineTo(verts[i].x, verts[i].y);
    ctx.closePath();
    ctx.fill();
  }
}
