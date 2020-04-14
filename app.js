import { elements } from "./data.js";
import Config from "./config.js";

class App {
  constructor() {
    this.tool = "box";
    this.objects = [];
    this.drag = false;
    this.coords = { x: 0, y: 0 };
    this.grid = { x: [], y: [] };
  }

  // Drag
  doDrag(target) {
    target.style.left = this.coords.x;
    target.style.top = this.coords.y;
  }

  // Adds element to the scene
  addElement(e) {
    const { target } = e;
    // If an element is clicked, initiate drag
    if (target.dataset.id) {
      elements.scene.addEventListener("mousemove", () => this.doDrag(target));
      elements.scene.addEventListener("mouseup", () => {
        elements.scene.removeEventListener("mousemove", () =>
          this.doDrag(target)
        );
      });
      // If no element is clicked, and not dragging currently, add element
    } else if (!this.drag) {
      const element = document.createElement("div");
      if (this.tool === "circle") element.style.borderRadius = "50%";
      element.classList.add("element");
      element.dataset.id = this.objects.length;
      element.style.left = this.snapToGrid(e).left;
      element.style.top = this.snapToGrid(e).top;

      // Fit size based on grid spacing
      element.style.width =
        this.tool === "circle"
          ? Config.gridSpacing * 2
          : (elements.scene.offsetWidth / Config.gridSpacing) * 2;
      element.style.height =
        this.tool === "circle"
          ? Config.gridSpacing * 2
          : (elements.scene.offsetHeight / Config.gridSpacing) * 3;

      element.style.backgroundColor = this.getColor();
      this.objects.push(element);
      elements.scene.appendChild(element);
    }
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

  // Generates a grid on the scene
  addGrid({ offsetWidth: width, offsetHeight: height }) {
    for (let i = 1; i < Config.gridSpacing; i++) {
      // Vertical lines
      const yLine = document.createElement("div");
      yLine.classList.add("yLine");
      const yValue = (i * width) / Config.gridSpacing;
      yLine.style.left = yValue;
      elements.scene.appendChild(yLine);
      this.grid.x.push(yValue);

      // Horizontal lines
      const xLine = document.createElement("div");
      xLine.classList.add("xLine");
      const xValue = (i * height) / Config.gridSpacing;
      xLine.style.top = xValue;
      this.grid.y.push(xValue);
      elements.scene.appendChild(xLine);
    }
  }

  // Check closest intersection
  snapToGrid({ clientX, clientY }) {
    const x = clientX - Config.gridSpacing - elements.scene.offsetLeft;
    const y = clientY - Config.gridSpacing - elements.scene.offsetTop;
    const left = this.grid.x.reduce((prev, curr) =>
      Math.abs(curr - x) < Math.abs(prev - x) ? curr : prev
    );
    const top = this.grid.y.reduce((prev, curr) =>
      Math.abs(curr - y) < Math.abs(prev - y) ? curr : prev
    );
    return { left, top };
  }

  // Gets color
  getColor() {
    return elements.color.value || Config.defaultColor;
  }
  // Updates current mouse position
  updateMouse({ clientX, clientY }) {
    this.coords = {
      x: clientX - elements.scene.offsetLeft,
      y: clientY - elements.scene.offsetTop,
    };
    return null;
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
    elements.scene.addEventListener("mousedown", this.addElement.bind(this));
    elements.clear.addEventListener("click", this.clear.bind(this));
    window.addEventListener("resize", () => {
      this.clearGrid();
      this.grid = { x: [], y: [] };
      this.addGrid(elements.scene);
    });
  }

  init() {
    this.toolPicker();
    this.attachListeners();
    this.addGrid(elements.scene);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();
});
