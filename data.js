export const elements = {
  tools: Array.from(document.querySelectorAll(".tool")),
  scene: document.getElementById("scene"),
  color: document.getElementById("color"),
  clear: document.getElementById("clear"),
  gridSize: document.getElementById("grid-size"),
  generate: document.getElementById("generate"),
  result: document.getElementById("result"),
  canvas: document.getElementById("canvas"),
  indicator: document.getElementById("indicator"),
};

export default elements;
