import { createElement } from "./helpers/createElement.js";

const BOARD_SIZE = 10;

export const createGameboardUI = (suffix) => {
  const board = createElement("div", `board-grid-container`);
  const grid = createGrid(`grid-${suffix}`, `cell-${suffix}`);
  const columnLabels = createAxisLabel("column-labels");
  const rowLabels = createAxisLabel("row-labels");

  board.append(columnLabels, rowLabels, grid);
  return board;
};

// create 10x10 grid of cells
const createGrid = (gridClass, cellClass) => {
  const grid = createElement("div", ["grid", gridClass]);

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = createElement("div", ["cell", cellClass]);

      // add data attributes for positioning
      cell.dataset.x = row;
      cell.dataset.y = col;

      grid.appendChild(cell);
    }
  }

  return grid;
};

// create coordinate labels
const createAxisLabel = (axisClass) => {
  const labelContainer = createElement("div", axisClass);

  for (let i = 0; i < BOARD_SIZE; i++) {
    const label = createElement("div", "label", i.toString());
    labelContainer.appendChild(label);
  }

  return labelContainer;
};
