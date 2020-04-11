export default class Grid {
  constructor(ctx, canvas) {
    this.ctx = ctx;
    this.canvas = canvas;
  }
  draw() {
    const { ctx, canvas } = this;
    // save previous styles & set our current styles
    ctx.save();
    ctx.strokeStyle = "#eee";
    ctx.lineWidth = 0.5;

    for (let i = 0; i < 100; i++) {
      ctx.beginPath();
      ctx.moveTo(10 * i, 0);
      ctx.lineTo(10 * i, canvas.height);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, 10 * i);
      ctx.lineTo(canvas.width, 10 * i);
      ctx.closePath();
      ctx.stroke();
    }

    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 0.5;

    for (let i = 0; i < 100; i++) {
      ctx.beginPath();
      ctx.moveTo(50 * i, 0);
      ctx.lineTo(50 * i, canvas.height);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, 50 * i);
      ctx.lineTo(canvas.width, 50 * i);
      ctx.closePath();
      ctx.stroke();
    }

    ctx.restore();
  }
}
