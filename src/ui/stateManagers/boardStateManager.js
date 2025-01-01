import { getCurrentPlayer } from "../../utils/playerUtils.js";
import { updatePassButtonUI } from "../updatePassBtnUI.js";
import { updateStartButtonUI } from "../updateStartBtnUI.js";

export const boardUIHandler = {
  displayShipBoardUI(suffix, gameboard) {
    // update board to show ships during placement phase
    const cells = document.querySelectorAll(`.cell-${suffix}`);
    cells.forEach((cell) => {
      cell.classList.remove("ship");
    });

    // display placed ships
    gameboard.placedShips.forEach((shipData) => {
      const { shipPositions } = shipData;
      shipPositions.forEach((pos) => {
        const cell = document.querySelector(
          `.cell-${suffix}[data-x="${pos.x}"][data-y="${pos.y}"]`
        );
        if (cell) {
          cell.classList.add("ship");
        }
      });
    });
  },

  // clear both boards when transitioning to game phase
  clearBoardsUI() {
    document.querySelectorAll(".cell").forEach((cell) => {
      cell.classList.remove("ship", "hit", "miss", "locked");
    });
  },

  clearShipsFromBoard(suffix, gameboard) {
    const currentPlayer = getCurrentPlayer(suffix);
    if (!currentPlayer) return;

    currentPlayer.clearBoard();
    this.displayShipBoardUI(suffix, gameboard);
    updateStartButtonUI();
    updatePassButtonUI(currentPlayer);
  },
};
