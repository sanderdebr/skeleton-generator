import { settings } from "./settings.js";
import Grid from "./shapes/Grid.js";
import Rectangle from "./shapes/Rectangle.js";
import Circle from "./shapes/Circle.js";

class App {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.grid = new Grid(this.ctx, this.canvas);
    this.objects = [];
    this.start();
  }

  addObjects(coords) {
    const rect = new Rectangle(
      this.ctx,
      coords.x,
      coords.y,
      settings.rectWidth,
      settings.rectHeight,
      settings.rectColor
    );
    // Add handlers
    const topLeft = new Circle(
      this.ctx,
      coords.x,
      coords.y,
      settings.closeEnough,
      settings.circleColor
    );
    const topRight = new Circle(
      this.ctx,
      coords.x + settings.rectWidth,
      coords.y,
      settings.closeEnough
    );
    const bottomLeft = new Circle(
      this.ctx,
      coords.x,
      coords.y + settings.rectHeight,
      settings.closeEnough
    );
    const bottomRight = new Circle(
      this.ctx,
      coords.x + settings.rectWidth,
      coords.y + settings.rectHeight,
      settings.closeEnough
    );
    this.objects.push({
      obj: rect,
      hovered: false,
      drag: { tl: false, tr: false, bl: false, br: false },
      circles: [topLeft, topRight, bottomLeft, bottomRight],
    });
  }

  getCoords({ clientX, clientY }) {
    const c = this.canvas.getBoundingClientRect();
    const x = clientX - c.left;
    const y = clientY - c.top;
    return { x, y };
  }

  mouseDown(e) {
    const coords = this.getCoords(e);

    this.activeObject() === undefined && this.addObjects(coords);

    // Check if the mouse is interacting with any of the handlers
    this.objects.forEach((object, i) => {
      // Left top
      if (
        this.isHoveringHandle(coords.x, object.obj.left) &&
        this.isHoveringHandle(coords.y, object.obj.top)
      ) {
        this.objects[i].drag.tl = true;
        // Right top
      } else if (
        this.isHoveringHandle(coords.x, object.obj.left + object.obj.width) &&
        this.isHoveringHandle(coords.y, object.obj.top)
      ) {
        this.objects[i].drag.tr = true;
        // Left bottom
      } else if (
        this.isHoveringHandle(coords.x, object.obj.left) &&
        this.isHoveringHandle(coords.y, object.obj.top + object.obj.height)
      ) {
        this.objects[i].drag.bl = true;
        // Right bottom
      } else if (
        this.isHoveringHandle(coords.x, object.obj.left + object.obj.width) &&
        this.isHoveringHandle(coords.y, object.obj.top + object.obj.height)
      ) {
        this.objects[i].drag.br = true;
      }
    });
  }

  activeObject() {
    return this.objects.filter((object) => object.hovered === true)[0];
  }

  mouseMove(e) {
    const coords = this.getCoords(e);

    // Set hover state if any object is hovered
    this.objects.forEach((object, i) => {
      if (this.isHoveringObject(coords, object.obj)) {
        object.hovered = true;
        document.body.style.cursor = "grab";
      } else {
        object.hovered = false;
        document.body.style.cursor = "default";
      }
    });

    // Select active object, if any
    if (this.activeObject()) {
      const coords = this.getCoords(e);

      const { tl, tr, bl, br } = this.activeObject().drag;
      const { obj, circles, hovered } = this.activeObject();

      // Check which side is dragged, update items accordingly
      if (tl) {
        obj.width += obj.left - coords.x;
        obj.height += obj.top - coords.y;
        obj.x = coords.x;
        obj.y = coords.y;
        circles[0].x = coords.x;
        circles[0].y = coords.y;
        circles[1].y = coords.y;
        circles[2].x = coords.x;
      } else if (tr) {
        obj.width = Math.abs(obj.left - coords.x);
        obj.height += obj.top - coords.y;
        obj.y = coords.y;
        circles[0].y = coords.y;
        circles[1].x = coords.x;
        circles[1].y = coords.y;
        circles[3].x = coords.x;
      } else if (bl) {
        obj.width += obj.left - coords.x;
        obj.height = Math.abs(obj.top - coords.y);
        obj.x = coords.x;
        circles[0].x = coords.x;
        circles[2].x = coords.x;
        circles[2].y = coords.y;
        circles[3].y = coords.y;
      } else if (br) {
        obj.width = Math.abs(obj.left - coords.x);
        obj.height = Math.abs(obj.top - coords.y);
        circles[1].x = coords.x;
        circles[2].y = coords.y;
        circles[3].x = coords.x;
      }
    }

    this.clear();
  }

  // Turn off drag
  mouseUp() {
    this.objects.forEach((object) =>
      Object.keys(object.drag).forEach((e) => (object.drag[e] = false))
    );
  }

  // Check if drag handle is being clicked
  isHoveringHandle(p1, p2) {
    return Math.abs(p1 - p2) < settings.closeEnough;
  }

  isHoveringObject(coords, obj) {
    return (
      coords.x >= obj.left - settings.closeEnough &&
      coords.x <= obj.right + settings.closeEnough &&
      coords.y >= obj.top - settings.closeEnough &&
      coords.y <= obj.bottom + settings.closeEnough
    );
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.grid.draw();
  }

  draw() {
    if (this.objects.length) {
      this.objects.forEach((object) => {
        object.obj.draw();
        if (object.hovered) {
          object.circles.forEach((circle) => {
            circle.draw();
          });
        }
      });
    }
    window.requestAnimationFrame(() => this.draw());
  }

  addEventListeners() {
    this.canvas.addEventListener("mousedown", this.mouseDown.bind(this));
    this.canvas.addEventListener("mouseup", this.mouseUp.bind(this));
    this.canvas.addEventListener("mousemove", this.mouseMove.bind(this));

    document.getElementById("clear").addEventListener("click", () => {
      this.clear();
      this.objects = [];
    });
  }

  start() {
    this.addEventListeners();
    window.requestAnimationFrame(() => this.draw());
    this.grid.draw();
  }
}

function init() {
  const canvas = document.querySelector("canvas");
  return new App(canvas);
}

init();
