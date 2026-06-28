// Generic convex polygon collision (Separating Axis Theorem). Used for shapes
// that aren't a simple axis-aligned rectangle or circle, like the triangles.

function rectVertices(x, y, w, h) {
  return [
    { x, y },
    { x: x + w, y },
    { x: x + w, y: y + h },
    { x, y: y + h }
  ];
}

function projectPolygon(poly, axis) {
  let min = Infinity, max = -Infinity;
  for (const p of poly) {
    const proj = p.x * axis.x + p.y * axis.y;
    if (proj < min) min = proj;
    if (proj > max) max = proj;
  }
  return [min, max];
}

function polygonCenter(poly) {
  let x = 0, y = 0;
  for (const p of poly) { x += p.x; y += p.y; }
  return { x: x / poly.length, y: y / poly.length };
}

// Minimum translation vector to push `movingVerts` out of `staticVerts`, or
// null if they don't overlap. Valid for any pair of convex polygons.
function polygonMTV(movingVerts, staticVerts) {
  let minOverlap = Infinity;
  let minAxis = null;

  for (const poly of [movingVerts, staticVerts]) {
    for (let i = 0; i < poly.length; i++) {
      const p1 = poly[i];
      const p2 = poly[(i + 1) % poly.length];
      const edge = { x: p2.x - p1.x, y: p2.y - p1.y };
      const len = Math.hypot(edge.x, edge.y);
      if (len === 0) continue;
      const axis = { x: -edge.y / len, y: edge.x / len };

      const [minA, maxA] = projectPolygon(movingVerts, axis);
      const [minB, maxB] = projectPolygon(staticVerts, axis);
      const overlap = Math.min(maxA, maxB) - Math.max(minA, minB);

      if (overlap <= 0) return null; // found a separating axis — no collision

      if (overlap < minOverlap) {
        minOverlap = overlap;
        minAxis = axis;
      }
    }
  }

  // Make sure the axis points away from the static shape, not just along it.
  const movingCenter = polygonCenter(movingVerts);
  const staticCenter = polygonCenter(staticVerts);
  const pointsTowardMoving =
    (movingCenter.x - staticCenter.x) * minAxis.x + (movingCenter.y - staticCenter.y) * minAxis.y;
  if (pointsTowardMoving < 0) {
    minAxis = { x: -minAxis.x, y: -minAxis.y };
  }

  return { x: minAxis.x * minOverlap, y: minAxis.y * minOverlap };
}
