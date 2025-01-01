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

    // set up listeners for player one's board
    playerOneCells.forEach((cell) => {
      // remove existing listeners by cloning
      const newCell = cell.cloneNode(true);
      cell.parentNode.replaceChild(newCell, cell);

      newCell.addEventListener("click", (e) => {
        handleAttackClick(e);
      });
    });

    if (!isPlayerComputer(gameController.allPlayers[1])) {
      const playerTwoCells = document.querySelectorAll(".cell-two");
      // set up listeners for player two's board
      playerTwoCells.forEach((cell) => {
        const newCell = cell.cloneNode(true);
        cell.parentNode.replaceChild(newCell, cell);

        newCell.addEventListener("click", (e) => {
          handleAttackClick(e);
        });
      });
    }
  },
};
