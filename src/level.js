// The floor the player stands on. Later levels will add platforms/gaps here.
const level = {
  groundY: 400,

  draw(ctx) {
    ctx.fillStyle = '#444466';
    ctx.fillRect(0, this.groundY, ctx.canvas.width, ctx.canvas.height - this.groundY);
  }
};
