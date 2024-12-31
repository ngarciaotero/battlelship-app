import { getGameController } from "./modeSelectionHandler.js";
import { boardUIHandler } from "../ui/stateManagers/boardStateManager.js";
import { updateStartButtonUI } from "../ui/updateStartBtnUI.js";
import { updatePassButtonUI } from "../ui/updatePassBtnUI.js";

const getCurrentPlayer = (suffix) => {
  const gameController = getGameController();
  if (!gameController) return null;

  const playerNum = suffix === "one" ? 0 : 1;
  const players = gameController.allPlayers;
  return players[playerNum];
};

export const handleRandomPopulation = (suffix) => {
  const currentPlayer = getCurrentPlayer(suffix);
  if (!currentPlayer) return;

  currentPlayer.clearBoard();
  currentPlayer.populateBoard();

  boardUIHandler.displayShipBoardUI(suffix, currentPlayer.gameboard);
  updateStartButtonUI();
  updatePassButtonUI(currentPlayer);
};

export const handleClearBoard = (suffix) => {
  const currentPlayer = getCurrentPlayer(suffix);
  if (!currentPlayer) return;

  currentPlayer.clearBoard();
  boardUIHandler.displayShipBoardUI(suffix, currentPlayer.gameboard);
  updateStartButtonUI();
  updatePassButtonUI(currentPlayer);
};
