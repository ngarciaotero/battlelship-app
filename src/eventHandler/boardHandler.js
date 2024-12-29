import { getGameController } from "./modeSelectionHandler.js";
import { updateBoardUI } from "../ui/updateBoardUI.js";

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

  updateBoardUI(suffix, currentPlayer.gameboard);
};

export const handleClearBoard = (suffix) => {
  const currentPlayer = getCurrentPlayer(suffix);
  if (!currentPlayer) return;

  currentPlayer.clearBoard();
  updateBoardUI(suffix, currentPlayer.gameboard);
};
