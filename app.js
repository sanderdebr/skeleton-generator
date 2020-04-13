import { elements } from "./data.js";

class App {
  constructor() {}

  init() {
    elements.tools.forEach((tool) =>
      tool.addEventListener("click", () => tool.classList.toggle("active"))
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();
});
