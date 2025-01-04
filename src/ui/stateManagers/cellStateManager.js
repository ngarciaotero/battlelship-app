import { getGameController } from "../../eventHandler/modeSelectionHandler.js";
import { handleAttackClick } from "../../eventHandler/attackClickHandler.js";
import { isPlayerComputer } from "../../utils/playerUtils.js";

export const cellUIHandler = {
  updateCellUI(cell, result) {
    const classToAdd = result === "hit" || result === "win" ? "hit" : "miss";
    cell.classList.add(classToAdd);
  },

  lockCells(positions, boardSuffix) {
    positions.forEach((pos) => {
      const cell = document.querySelector(
        `.cell-${boardSuffix}[data-x="${pos.x}"][data-y="${pos.y}"]`
      );

      if (cell) {
        cell.classList.add("locked");
      }
    });
  },

  setupAttackListeners() {
    const gameController = getGameController();

    const playerOneCells = document.querySelectorAll(".cell-one");
    this.setupCellListeners(playerOneCells, handleAttackClick);

    if (!isPlayerComputer(gameController.allPlayers[1])) {
      const playerTwoCells = document.querySelectorAll(".cell-two");
      this.setupCellListeners(playerTwoCells, handleAttackClick);
    }
  },

  setupCellListeners(cells, eventHandler) {
    cells.forEach((cell) => {
      const newCell = this.removeCellListeners(cell);
      newCell.addEventListener("click", eventHandler);
    });
  },
};
