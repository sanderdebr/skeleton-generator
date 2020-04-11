import Rectangle from "./Rectangle.js";
import { settings } from "./settings.js";

export default class Resize {
  constructor(ctx, canvas, rectangles, grid) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.rectangles = rectangles;
    this.grid = grid;
    this.canvas.addEventListener("mousedown", this.mouseDown.bind(this));
    this.canvas.addEventListener("mouseup", this.mouseUp.bind(this));
    this.canvas.addEventListener("mousemove", this.mouseMove.bind(this));
  }
  createRectangle(coords) {
    const rect = new Rectangle(
      this.ctx,
      coords[0],
      coords[1],
      settings.rectWidth,
      settings.rectHeight
    );
    this.rectangles.push({ obj: rect, drag: this.drag });
  }

  getCoords({ clientX, clientY }) {
    const c = this.canvas.getBoundingClientRect();
    const left = clientX - c.left;
    const top = clientY - c.top;
    return [left, top];
  }

  mouseDown(e) {
    const coords = this.getCoords(e);
    this.createRectangle(coords);
  }

  mouseMove(e) {
    const coords = this.getCoords(e);

    // if (this.drag.tl) {
    //   rect.w += rect.startX - coords[0];
    //   rect.h += rect.startY - coords[1];
    //   rect.startX = coords[0];
    //   rect.startY = coords[1];
    // } else if (this.drag.tr) {
    //   rect.w = Math.abs(rect.startX - coords[0]);
    //   rect.h += rect.startY - coords[1];
    //   rect.startY = coords[1];
    // } else if (this.drag.bl) {
    //   rect.w += rect.startX - coords[0];
    //   rect.h = Math.abs(rect.startY - coords[1]);
    //   rect.startX = coords[0];
    // } else if (this.drag.br) {
    //   rect.w = Math.abs(rect.startX - coords[0]);
    //   rect.h = Math.abs(rect.startY - coords[1]);
    // }

    this.clear();
    this.draw();
  }

  // Turn off drag
  mouseUp() {
    Object.keys(this.drag).forEach((e) => (this.drag[e] = false));
  }

  // Check if drag handle is being clicked
  checkCloseEnough(p1, p2) {
    return Math.abs(p1 - p2) < settings.closeEnough;
  }

  draw() {
    this.rectangles.forEach((rectangle) => rectangle.obj.draw());
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.grid.draw();
  }
}
