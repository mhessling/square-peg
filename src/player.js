// The square. Holds its own position/velocity and knows how to move and jump.
const player = {
  x: 50,
  y: 350,
  size: 40,
  vx: 0,
  vy: 0,
  speed: 4,
  jumpStrength: -10,
  gravity: 0.5,
  onGround: false,

  update() {
    // Horizontal movement
    if (keys['ArrowLeft'] || keys['KeyA']) this.vx = -this.speed;
    else if (keys['ArrowRight'] || keys['KeyD']) this.vx = this.speed;
    else this.vx = 0;

    // Jump (only when standing on something)
    if ((keys['Space'] || keys['ArrowUp'] || keys['KeyW']) && this.onGround) {
      this.vy = this.jumpStrength;
      this.onGround = false;
    }

    // Gravity
    this.vy += this.gravity;

    this.x += this.vx;
    this.y += this.vy;

    // Floor collision
    const floorY = level.groundY - this.size;
    if (this.y >= floorY) {
      this.y = floorY;
      this.vy = 0;
      this.onGround = true;
    }
  },

  draw(ctx) {
    ctx.fillStyle = '#e0e0ff';
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
};
