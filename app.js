import { settings } from "./settings.js";
import Grid from "./Grid.js";
import Rectangle from "./Rectangle.js";
import Line from "./Line.js";

class App {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.grid = new Grid(this.ctx, this.canvas);
    this.drag = { tl: false, tr: false, bl: false, br: false };
    this.rectangles = [];
    this.init();
  }

  createRectangle(coords) {
    const rect = new Rectangle(
      this.ctx,
      coords.x,
      coords.y,
      settings.rectWidth,
      settings.rectHeight
    );
    this.rectangles.push({ obj: rect, drag: this.drag });
  }

  getCoords({ clientX, clientY }) {
    const c = this.canvas.getBoundingClientRect();
    const x = clientX - c.left;
    const y = clientY - c.top;
    return { x, y };
  }

  draw() {
    this.rectangles.forEach((rectangle) => rectangle.obj.draw());
  }

  mouseDown(e) {
    const coords = this.getCoords(e);

    // Check if the mouse is interacting with any of the current rectangles corners
    const result = this.rectangles.forEach((rectangle, i) => {
      if (
        this.checkCloseEnough(coords.x, rectangle.obj.left) &&
        this.checkCloseEnough(coords.y, rectangle.obj.top)
      ) {
        this.rectangles[i].drag.tl = true;
      }
    });

    // If not interacting when any rectangles, create one
    // result.length === 0 && this.createRectangle(coords);
  }

  mouseMove(e) {
    const coords = this.getCoords(e);
    console.log("berend", this.rectangles[0].drag.tl);

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

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.grid.draw();
  }

  addEventListeners() {
    this.canvas.addEventListener("mousedown", this.mouseDown.bind(this));
    this.canvas.addEventListener("mouseup", this.mouseUp.bind(this));
    this.canvas.addEventListener("mousemove", this.mouseMove.bind(this));

    document
      .getElementById("clear")
      .addEventListener("click", () => (this.rectangles = []));
  }

  init() {
    this.addEventListeners();
    this.grid.draw();
    this.createRectangle({ x: 10, y: 10 });
  }
}

function init() {
  const canvas = document.querySelector("canvas");
  return new App(canvas);
}

init();
