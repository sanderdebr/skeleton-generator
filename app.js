import { elements } from "./data.js";
import Config from "./config.js";
import './html2canvas.js';

class App {
  constructor() {
    this.tool = "box";
    this.objects = [];
    this.dragging = false;
    this.resizing = false;
    this.target = null;
    this.coords = { x: 0, y: 0 };
    this.grid = { x: [], y: [] };
    this.start = { x: null, y: null, startWidth: null, startHeight: null };
    this.gridSize = Config.gridSpacing;
  }

  // Drag
  drag() {
    if (this.dragging) {
      this.target.style.left =
        this.coords.x - elements.scene.offsetWidth / this.gridSize;
      this.target.style.top =
        this.coords.y - elements.scene.offsetHeight / this.gridSize;
    }
  }

  endDrag() {
    if (this.dragging) {
      this.dragging = false;
      this.target = null;
    }
    if (this.resizing) {
      this.resizing = false;
      this.target = null;
    }
  }

  // Adds element to the scene
  handleClick(e) {
    const { target } = e;

    // If something else than the left button has been clicked and it is an element, remove the node
    if (e.button !== 0 && target.dataset.id) {
      const myTarget = target.parentNode
      myTarget.parentNode.removeChild(myTarget);
      const index = this.objects.indexOf(myTarget);
      this.objects.splice(index, 1);
      console.log(this.objects)
      e.preventDefault();
      return;
    }

    // Resize
    if (target.classList.contains("resizer")) {
      this.target = target;
      this.resizing = true;
      const startWidth = parseInt(
        document.defaultView.getComputedStyle(target.parentNode).width,
        10
      );
      const startHeight = parseInt(
        document.defaultView.getComputedStyle(target.parentNode).width,
        10
      );
      this.start = {
        x: this.coords.x,
        y: this.coords.y,
        startWidth,
        startHeight,
      };
      elements.scene.addEventListener("mousemove", this.resize.bind(this));
      return;
    }

    // If an element is clicked, initiate drag
    if (target.dataset.id && !this.dragging) {
      this.dragging = true;
      this.target = target.parentNode;
      elements.scene.addEventListener("mousemove", this.drag.bind(this));

      // If no element is clicked, and not dragging currently, add element
    } else if (!this.dragging) {
      const element = document.createElement("div");
      if (this.tool === "circle") element.style.borderRadius = "50%";
      element.classList.add("element");
      element.classList.add(this.tool);
      element.dataset.id = this.objects.length;
      element.style.zIndex = this.objects.length;
      element.style.left = this.snapToGrid(e).left;
      element.style.top = this.snapToGrid(e).top;

      // Fit size based on grid spacing
      element.style.width =
        this.tool === "circle"
          ? (elements.scene.offsetHeight / this.gridSize) * 3
          : (elements.scene.offsetWidth / this.gridSize) * 2;
      element.style.height = (elements.scene.offsetHeight / this.gridSize) * 3;

      element.style.backgroundColor = this.getColor();
      this.objects.push(element);
      elements.scene.appendChild(element);

      // Add resizers
      const resizers = `<div class="resizers" data-id="${
        this.objects.length - 1
      }"><div class='resizer top-left'></div>
      <div class='resizer top-right'></div>
      <div class='resizer bottom-left'></div>
      <div class='resizer bottom-right'></div></div>`;
      element.insertAdjacentHTML("beforeend", resizers);
    }
  }

  resize() {
    const { startWidth, startHeight, x, y } = this.start;
    if (this.target) {
      const target = this.target.parentNode.parentNode;
      const pos = Array.from(this.target.classList)[1];
      switch (pos) {
        case "bottom-right":
          target.style.width = startWidth + this.coords.x - x + "px";
          target.style.height = startHeight + this.coords.y - y + "px";
        // Add more cases in future
        default:
          return;
      }
    }
  }

  // Generates a grid on the scene
  addGrid({ offsetWidth: width, offsetHeight: height }) {
    for (let i = 1; i < this.gridSize; i++) {
      // Vertical lines
      const yLine = document.createElement("div");
      yLine.classList.add("yLine");
      const yValue = (i * width) / this.gridSize;
      yLine.style.left = yValue;
      elements.scene.appendChild(yLine);
      this.grid.x.push(yValue);

      // Horizontal lines
      const xLine = document.createElement("div");
      xLine.classList.add("xLine");
      const xValue = (i * height) / this.gridSize;
      xLine.style.top = xValue;
      this.grid.y.push(xValue);
      elements.scene.appendChild(xLine);
    }
  }

  // Updates grid when changing grid input value
  updateGrid({ target: { value } }) {
    this.clear();
    this.gridSize = value;
    this.clearGrid();
    this.grid = { x: [], y: [] };
    this.addGrid(elements.scene);
  }

  // Check closest intersection
  snapToGrid({ clientX, clientY }) {
    const x = clientX - this.gridSize - elements.scene.offsetLeft;
    const y = clientY - this.gridSize - elements.scene.offsetTop;
    const left = this.grid.x.reduce((prev, curr) =>
      Math.abs(curr - x) < Math.abs(prev - x) ? curr : prev
    );
    const top = this.grid.y.reduce((prev, curr) =>
      Math.abs(curr - y) < Math.abs(prev - y) ? curr : prev
    );
    return { left, top };
  }

  // Sets active class to clicked tool, if it was not active yet
  toolPicker() {
    elements.tools.forEach((tool) => {
      tool.addEventListener("click", () => {
        const classList = Array.from(tool.classList);
        if (!classList.includes("active")) {
          elements.tools.forEach((tool) => tool.classList.remove("active"));
          tool.classList.add("active");
          this.tool = tool.id;
        }
      });
    });
  }

  // Gets color from input
  getColor() {
    return elements.color.value;
  }

  // Updates current mouse position
  updateMouse({ clientX, clientY }) {
    this.coords = {
      x: clientX - elements.scene.offsetLeft,
      y: clientY - elements.scene.offsetTop,
    };
    return null;
  }

  // Renders image based of div
  getSkeleton() {
    html2canvas(document.getElementById("scene")).then((canvas) => {
      elements.result.appendChild(canvas);
      if (elements.result.style.display !== 'block') elements.result.style.display = 'block';
      window.scrollTo({
        bottom: 0,
        behavior: 'smooth',
      });
    });
  }

  // Clear scene
  clear() {
    elements.scene.innerHTML = "";
    this.objects = [];
    this.addGrid(elements.scene);
  }

  // Clear grid only
  clearGrid() {
    const xLines = Array.from(document.querySelectorAll(".xLine"));
    const yLines = Array.from(document.querySelectorAll(".yLine"));
    const lines = [...xLines, ...yLines];
    lines.forEach((line) => line.parentNode.removeChild(line));
  }

  // Add eventlisteners
  attachListeners() {
    elements.scene.addEventListener("mousemove", this.updateMouse.bind(this));
    elements.scene.addEventListener("mousedown", this.handleClick.bind(this));
    elements.scene.addEventListener("mouseup", this.endDrag.bind(this));
    elements.clear.addEventListener("click", this.clear.bind(this));
    window.addEventListener("resize", () => {
      this.clearGrid();
      this.grid = { x: [], y: [] };
      this.addGrid(elements.scene);
    });
    elements.gridSize.addEventListener("change", this.updateGrid.bind(this));
    elements.generate.addEventListener("click", this.getSkeleton);
  }

  init() {
    // Set default values
    elements.color.value = Config.defaultColor;
    elements.gridSize.value = this.gridSize;

    // Initialise methods
    this.toolPicker();
    this.attachListeners();
    this.addGrid(elements.scene);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();
});
