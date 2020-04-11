export default class Circle {
  constructor(ctx, x = 0, y = 0, radius = 10, fillColor = "#f56565") {
    this.ctx = ctx;
    this.x = Number(x);
    this.y = Number(y);
    this.radius = Number(radius);
    this.fillColor = fillColor;
  }

  draw() {
    const { x, y, width, height, radius, fillColor } = this;
    // saves the current styles set elsewhere
    // to avoid overwriting them
    this.ctx.save();

    // set the styles for this shape
    this.ctx.fillStyle = fillColor;

    // create the *path*
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);

    // draw the path to screen
    this.ctx.fill();

    // restores the styles from earlier
    // preventing the colors used here
    // from polluting other drawings
    this.ctx.restore();
  }
}
