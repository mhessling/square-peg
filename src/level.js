// The world is a sequence of rooms. Each room defines its own walls, a door
// to the next room, where circles start, and where the player starts.
const level = {
  rooms: [
    {
      width: 800,
      height: 450,
      walls: [
        { x: 0, y: 0, w: 800, h: 20 },     // top
        { x: 0, y: 430, w: 800, h: 20 },   // bottom
        { x: 0, y: 0, w: 20, h: 450 },     // left
        { x: 780, y: 0, w: 20, h: 195 },   // right, above the door
        { x: 780, y: 255, w: 20, h: 195 }, // right, below the door
        { x: 350, y: 150, w: 20, h: 150 }  // interior obstacle
      ],
      door: { x: 780, y: 195, w: 20, h: 60 },
      playerStart: { x: 60, y: 60 },
      circleDefs: [
        { x: 300, y: 200, radius: 20, speed: 3, fleeRange: 150 },
        { x: 550, y: 300, radius: 20, speed: 3, fleeRange: 150 }
      ],
      triangleDefs: [
        { x: 650, y: 350, radius: 24, angle: 0 }
      ],
      hexagonDefs: [
        { x: 200, y: 350, radius: 28 }
      ]
    },
    {
      width: 800,
      height: 450,
      walls: [
        { x: 0, y: 0, w: 800, h: 20 },
        { x: 0, y: 430, w: 800, h: 20 },
        { x: 0, y: 0, w: 20, h: 450 },
        { x: 780, y: 0, w: 20, h: 450 }
      ],
      door: null, // nothing past this room yet
      playerStart: { x: 60, y: 60 },
      circleDefs: [
        { x: 400, y: 225, radius: 20, speed: 3, fleeRange: 150 }
      ],
      triangleDefs: [
        { x: 600, y: 225, radius: 24, angle: 0 }
      ],
      hexagonDefs: [
        { x: 250, y: 150, radius: 28 }
      ]
    }
  ],

  currentIndex: 0,

  get current() {
    return this.rooms[this.currentIndex];
  },

  draw(ctx) {
    const room = this.current;
    ctx.fillStyle = '#2a2a3d';
    ctx.fillRect(0, 0, room.width, room.height);

    ctx.fillStyle = '#444466';
    for (const wall of room.walls) {
      ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
    }

    if (room.door) {
      ctx.fillStyle = '#7fffa0';
      ctx.fillRect(room.door.x, room.door.y, room.door.w, room.door.h);
    }
  },

  // Push a square (the player) back out of any wall it's overlapping.
  resolveSquareCollision(square) {
    for (const wall of this.current.walls) {
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
    for (const wall of this.current.walls) {
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
  },

  // Push a triangle back out of any wall it's overlapping (exact polygon collision).
  resolveTriangleCollision(triangle) {
    for (const wall of this.current.walls) {
      const mtv = polygonMTV(triangleVertices(triangle), rectVertices(wall.x, wall.y, wall.w, wall.h));
      if (mtv) {
        triangle.x += mtv.x;
        triangle.y += mtv.y;
      }
    }
  },

  // True if the square is touching this room's door.
  isAtDoor(square) {
    const door = this.current.door;
    if (!door) return false;

    const overlapX = Math.min(square.x + square.size, door.x + door.w) - Math.max(square.x, door.x);
    const overlapY = Math.min(square.y + square.size, door.y + door.h) - Math.max(square.y, door.y);
    return overlapX > 0 && overlapY > 0;
  },

  // Move to the next room, resetting the player and circles into it.
  // Returns false (and does nothing) if there's no next room yet.
  advance() {
    if (this.currentIndex >= this.rooms.length - 1) return false;

    this.currentIndex++;
    player.x = this.current.playerStart.x;
    player.y = this.current.playerStart.y;
    resetCircles(this.current.circleDefs);
    resetTriangles(this.current.triangleDefs);
    resetHexagons(this.current.hexagonDefs);
    return true;
  }
};
