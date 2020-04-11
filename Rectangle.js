export default class Rectangle {
  constructor(ctx, x = 0, y = 0, width = 25, height = 25, fillColor = "grey") {
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
    const { x, y, width, height, fillColor } = this;
    // saves the current styles set elsewhere
    // to avoid overwriting them
    this.ctx.save();

    // set the styles for this shape
    this.ctx.fillStyle = fillColor;

    // create the *path*
    this.ctx.beginPath();
    this.ctx.rect(x, y, width, height);

    // draw the path to screen
    this.ctx.fill();

    // restores the styles from earlier
    // preventing the colors used here
    // from polluting other drawings
    this.ctx.restore();
  }
}
