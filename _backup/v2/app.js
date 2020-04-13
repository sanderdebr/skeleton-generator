import Config from "./config.js";
import Grid from "./shapes/Grid.js";
import Circle from "./shapes/Circle.js";

class App {
  constructor() {
    this.canvas = document.querySelector("canvas"); // Our canvas
    this.canvas.id = "CANVAS";

    this.info = {
      // Canvas information
      WIDTH: this.canvas.width,
      HEIGHT: this.canvas.height,
      isDrag: false,
      isResizeDrag: false,
      expectResize: -1, // Saves the number of the selection handle if mouse is over one
      canvasValid: false, // When set to true, will redraw everything
    };

    this.mySel = null; // Selected node, if any
    this.coords = { x: 0, y: 0 }; // Mouse coordinates
    this.offset = { x: 0, y: 0 }; // / Save offset of mouse when starting to drag
    this.boxes = []; // Holds all the boxes
    this.selectionHandles = []; // Holds the selection handles
    this.ctx = this.canvas.getContext("2d"); // Canvas context
    this.offsetX = 0;
    this.offsetY = 0;

    this.styles = {
      paddingLeft: 0,
      paddingTop: 0,
      borderLeft: 0,
      borderTop: 0,
    };

    this.ghostcanvas = document.createElement("canvas"); // Ghost canvas
    this.ghostcanvas.id = "GHOSTCANVAS";
    this.ghostcanvas.height = this.info.HEIGHT;
    this.ghostcanvas.width = this.info.WIDTH;
    this.gctx = this.ghostcanvas.getContext("2d");
  }

  myMove(e) {
    this.getMouse(e);
  }

  // Happens when the mouse is clicked in the canvas
  myDown(e) {
    this.getMouse(e);

    //we are over a selection box
    if (this.info.expectResize !== -1) {
      this.info.isResizeDrag = true;
      return;
    }

    this.clear(this.gctx);

    const l = this.boxes.length;

    for (let i = l - 1; i >= 0; i--) {
      // draw shape onto ghost context
      this.boxes[i].draw(this.gctx);

      // get image data at the mouse x,y pixel
      const imageData = this.gctx.getImageData(
        this.coords.x,
        this.coords.y,
        1,
        1
      );
      const index = (this.coords.x + this.coords.y * imageData.width) * 4;

      // if the mouse pixel exists, select and break
      if (imageData.data[3] > 0) {
        alert();

        this.mySel = this.boxes[i];
        offsetx = this.coords.x - this.mySel.x;
        offsety = this.coords.y - this.mySel.y;
        this.mySel.x = this.coords.x - offsetx;
        this.mySel.y = this.coords.y - offsety;
        this.info.isDrag = true;

        this.invalidate();
        this.clear(this.gctx);
        return;
      }
    }
    // havent returned means we have selected nothing
    this.mySel = null;
    // clear the ghost canvas for next time
    this.clear(this.gctx);
    // invalidate because we might need the selection border to disappear
    this.invalidate();
  }

  myUp() {
    this.isDrag = false;
    this.isResizeDrag = false;
    this.expectResize = -1;
  }

  // Sets mx,my to the mouse position relative to the canvas
  // unfortunately this can be tricky, we have to worry about padding and borders
  getMouse(e) {
    let element = this.canvas;

    if (element.offsetParent) {
      do {
        this.offsetX += element.offsetLeft;
        this.offsetY += element.offsetTop;
      } while ((element = element.offsetParent));
    }

    this.coords.x = e.pageX - this.offsetX;
    this.coords.y = e.pageY - this.offsetY;
  }

  //Initialize a new Box, add it, and invalidate the canvas
  addRect(x, y, width, height, fillColor, handles) {
    const rect = new Box(x, y, width, height, fillColor, handles);
    this.boxes.push(rect);
    this.invalidate();
  }

  invalidate() {
    this.info.canvasValid = false;
  }

  //wipes the canvas context
  clear(context) {
    context.clearRect(0, 0, this.info.WIDTH, this.info.HEIGHT);
  }

  mainDraw() {
    if (this.info.canvasValid == false) {
      this.clear(this.ctx);

      // draw all boxes
      var l = this.boxes.length;
      for (var i = 0; i < l; i++) {
        this.boxes[i].draw(this.ctx);
      }

      this.info.canvasValid = true;
    }
  }

  init() {
    // make mainDraw() fire every INTERVAL milliseconds
    setInterval(this.mainDraw.bind(this), Config.INTERVAL);

    //fixes a problem where double clicking causes text to get selected on the canvas
    this.canvas.onselectstart = function () {
      return false;
    };

    // Set event handlers
    this.canvas.onmousedown = this.myDown.bind(this);
    this.canvas.onmousemove = this.myMove.bind(this);

    // Set canvas width
    if (window.innerWidth > 1200) {
      this.canvas.width = window.innerWidth * 0.5;
    } else {
      this.canvas.width = window.innerWidth * 0.9;
    }
    this.canvas.height = window.innerHeight * 0.5;

    // set up the selection handle boxes
    for (var i = 0; i < 8; i++) {
      var rect = new Box();
      this.selectionHandles.push(rect);
    }

    this.addRect(10, 10, 40, 45, "rgba(0,205,0,0.7)", this.selectionHandles);
  }
}

class Box extends App {
  constructor(
    x = 0,
    y = 0,
    width = 25,
    height = 25,
    fillColor = "grey",
    selectionHandles
  ) {
    super();
    this.x = Number(x);
    this.y = Number(y);
    this.width = Number(width);
    this.height = Number(height);
    this.fillColor = fillColor;
    this.selectionHandles = selectionHandles;
  }

  draw(context) {
    // Each box is responsible for its own drawing
    const {
      info,
      mySel,
      x,
      y,
      width,
      height,
      fillColor,
      selectionHandles,
    } = this;

    if (context === this.gctx) {
      context.fillStyle = "black"; // always want black for the ghost canvas
    } else {
      context.fillStyle = fillColor;
    }

    // We can skip the drawing of elements that have moved off the screen:
    if (x > info.WIDTH || y > info.HEIGHT) return;
    if (x + width < 0 || y + height < 0) return;

    context.fillRect(x, y, width, height);

    // draw selection
    // this is a stroke along the box and also 8 new selection handles
    if (!mySel) {
      context.strokeStyle = Config.mySelColor;
      context.lineWidth = Config.mySelWidth;
      context.strokeRect(x, y, width, height);

      // draw the boxes
      const half = Config.mySelBoxSize / 2;

      // top left, middle, right
      selectionHandles[0].x = x - half;
      selectionHandles[0].y = y - half;

      selectionHandles[1].x = x + width / 2 - half;
      selectionHandles[1].y = y - half;

      selectionHandles[2].x = x + width - half;
      selectionHandles[2].y = y - half;

      //middle left
      selectionHandles[3].x = x - half;
      selectionHandles[3].y = y + height / 2 - half;

      //middle right
      selectionHandles[4].x = x + width - half;
      selectionHandles[4].y = y + height / 2 - half;

      //bottom left, middle, right
      selectionHandles[6].x = x + width / 2 - half;
      selectionHandles[6].y = y + height - half;

      selectionHandles[5].x = x - half;
      selectionHandles[5].y = y + height - half;

      selectionHandles[7].x = x + width - half;
      selectionHandles[7].y = y + height - half;

      context.fillStyle = Config.mySelBoxColor;

      for (let i = 0; i < 8; i++) {
        let cur = selectionHandles[i];
        context.fillRect(
          cur.x,
          cur.y,
          Config.mySelBoxSize,
          Config.mySelBoxSize
        );
      }
    }
  }
}

// Initialize our app
document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();
});
