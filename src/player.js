// The square. Holds its own position/velocity and knows how to move
// (top-down: 4 directions, no gravity or jumping).
const player = {
  x: 60,
  y: 60,
  size: 40,
  vx: 0,
  vy: 0,
  speed: 4,

  update() {
    if (keys['ArrowLeft'] || keys['KeyA']) this.vx = -this.speed;
    else if (keys['ArrowRight'] || keys['KeyD']) this.vx = this.speed;
    else this.vx = 0;

    if (keys['ArrowUp'] || keys['KeyW']) this.vy = -this.speed;
    else if (keys['ArrowDown'] || keys['KeyS']) this.vy = this.speed;
    else this.vy = 0;

    this.x += this.vx;
    this.y += this.vy;

    level.resolveSquareCollision(this);
  },

  draw(ctx) {
    ctx.fillStyle = '#e0e0ff';
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
};
