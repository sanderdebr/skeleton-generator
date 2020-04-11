export default class Line {
  constructor(ctx, x = 0, y = 0, width = 0, height = 0, strokeColor = "") {
    this.ctx = ctx;
    this.x = Number(x);
    this.y = Number(y);
    this.width = Number(width);
    this.height = Number(height);
    this.fillColor = fillColor;
  }

  get left() {
    return this.x;
  }

  get right() {
    return this.x + this.width;
  }

  get top() {
    return this.y;
  }

  get bottom() {
    return this.y + this.height;
  }

  draw() {
    const { ctx, x, y, width, height, strokeColor } = this;
    ctx.save();
    ctx.strokeStyle = strokeColor;
    ctx.beginPath();
    ctx.moveTo(x, y, width, height);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}
