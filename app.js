import { elements } from "./data.js";
import Config from "./config.js";

class App {
  constructor() {
    this.tool = "box";
    this.color = Config.defaultColor;
    this.objects = [];
    this.grid = { x: [], y: [] };
  }

  // Adds element to the scene
  addElement(e) {
    const element = document.createElement("div");
    if (this.tool === "circle") element.style.borderRadius = "50%";
    element.classList.add("element");
    element.style.left = this.snapToGrid(e).left;
    element.style.top = this.snapToGrid(e).top;
    element.style.backgroundColor = this.color;
    this.objects.push(element);
    elements.scene.appendChild(element);
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
    console.log(width, height);
    for (let i = 1; i < Config.gridSpacing; i++) {
      // Horizontal lines
      const xLine = document.createElement("div");
      xLine.classList.add("xLine");
      const xValue = (i * width) / Config.gridSpacing;
      xLine.style.left = xValue;
      elements.scene.appendChild(xLine);
      this.grid.x.push(xValue);

      // Vertical lines
      const yLine = document.createElement("div");
      yLine.classList.add("yLine");
      const yValue = (i * height) / Config.gridSpacing;
      yLine.style.top = yValue;
      this.grid.y.push(yValue);
      elements.scene.appendChild(yLine);
    }
  }

  // Check closest intersection
  snapToGrid({ clientX, clientY }) {
    const x = clientX - elements.scene.offsetLeft;
    const y = clientY - elements.scene.offsetTop;
    const left = this.grid.x.reduce((prev, curr) =>
      Math.abs(curr - x) < Math.abs(prev - x) ? curr : prev
    );
    const top = this.grid.y.reduce((prev, curr) =>
      Math.abs(curr - y) < Math.abs(prev - y) ? curr : prev
    );
    return { left, top };
  }

  // Gets color
  getColor({ target: value }) {
    return value;
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
    elements.scene.addEventListener("click", this.addElement.bind(this));
    elements.color.addEventListener("change", this.getColor);
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
