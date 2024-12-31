import { getGameController } from "./modeSelectionHandler.js";
import { displayToggle } from "../ui/helpers/displayToggle.js";
import { cellUIHandler } from "../ui/stateManagers/cellStateManager.js";
import { gameStateManager } from "../ui/stateManagers/gameStateManager.js";

export const handleAttackClick = (event) => {
  const cell = event.target;
  const boardSuffix = cell.classList.contains("cell-one") ? "one" : "two";

  processGameTurn(cell, boardSuffix);
};

const processGameTurn = (cell, boardSuffix) => {
  const gameController = getGameController();
  let moveResult;

  // human player's attack
  if (cell) {
    const move = {
      x: parseInt(cell.dataset.x),
      y: parseInt(cell.dataset.y),
    };
    moveResult = gameController.makeMove(move);
  } else {
    // handle computer player's attack
    moveResult = gameController.makeMove(null);
  }

  // if move wasn't successful, return early
  if (!moveResult.success) return;

  const targetCell = cell || getComputerCell(moveResult.move, boardSuffix);
  cellUIHandler.updateCellUI(targetCell, moveResult.type);

  if (moveResult.type === "win" || moveResult.type === "hit") {
    cellUIHandler.lockCells(moveResult.lockedPositions, boardSuffix);
  }

  if (moveResult.type === "win") {
    displayToggle.displayGameOverModal();
    return;
  }

  gameStateManager.updateTurnOverlay();

  //   if computer's turn, process the next move after a delay
  if (gameController.currentPlayer.isComputer()) {
    setTimeout(() => {
      processGameTurn(null, "two");
    }, 1000);
  }
};

const getComputerCell = (move, boardSuffix) => {
  return document.querySelector(
    `.cell-${boardSuffix}[data-x="${move.x}"][data-y="${move.y}"]`
  );
};
