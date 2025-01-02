import { getGameController } from "./modeSelectionHandler.js";
import { displayToggle } from "../ui/helpers/displayToggle.js";
import { cellUIHandler } from "../ui/stateManagers/cellStateManager.js";
import { gameStateManager } from "../ui/stateManagers/gameStateManager.js";
import { messageUI } from "../ui/stateManagers/messageStateManager.js";

export const handleAttackClick = (event) => {
  const cell = event.target;
  const boardSuffix = cell.classList.contains("cell-one") ? "one" : "two";

  processGameTurn(cell, boardSuffix);
};

const processGameTurn = (cell, boardSuffix) => {
  const gameController = getGameController();
  const moveResult = getMoveResult(cell, gameController);

  // if move wasn't successful, return early
  if (!moveResult.success) {
    messageUI.updateMessageUI(boardSuffix, moveResult);
    return;
  }

  const targetCell = cell || getComputerCell(moveResult.move, boardSuffix);
  processMoveResult(targetCell, moveResult, boardSuffix);

  if (moveResult.type === "win") {
    handleWinCondition(boardSuffix, moveResult);
    return;
  }

  gameStateManager.updateTurnOverlay();

  if (gameController.currentPlayer.isComputer()) {
    scheduleComputerTurn();
  }
};

// get move result based on player type
const getMoveResult = (cell, gameController) => {
  if (cell) {
    const move = {
      x: parseInt(cell.dataset.x),
      y: parseInt(cell.dataset.y),
    };
    return gameController.makeMove(move);
  }
  return gameController.makeMove(null);
};

// update board based on move result
const processMoveResult = (targetCell, moveResult, boardSuffix) => {
  cellUIHandler.updateCellUI(targetCell, moveResult.type);

  if (moveResult.type === "miss") {
    messageUI.updateMessageUI(boardSuffix, moveResult);
    return;
  }

  if (hasShipBeenSunk(moveResult)) {
    cellUIHandler.lockCells(moveResult.lockedPositions, boardSuffix);
    messageUI.updateMessageUI(boardSuffix, { type: "sunk" });
  } else {
    messageUI.updateMessageUI(boardSuffix, moveResult);
  }
};

// check if ship was sunk
const hasShipBeenSunk = (moveResult) => {
  return moveResult.ship.isSunk();
};

// process win condition
const handleWinCondition = (boardSuffix, moveResult) => {
  messageUI.updateMessageUI(boardSuffix, moveResult);
  displayToggle.displayGameOverModal();
};

// schedule computer's turn
const scheduleComputerTurn = () => {
  setTimeout(() => {
    processGameTurn(null, "two");
  }, 1000);
};

// get computer's target cell
const getComputerCell = (move, boardSuffix) => {
  return document.querySelector(
    `.cell-${boardSuffix}[data-x="${move.x}"][data-y="${move.y}"]`
  );
};
