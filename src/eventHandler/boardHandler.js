import { getGameController } from "./modeSelectionHandler.js";
import { updateBoardUI } from "../ui/updateBoardUI.js";

export const handleRandomPopulation = (suffix) => {
  const gameController = getGameController();
  if (!gameController) return;

  const playerNum = suffix === "one" ? 0 : 1;
  const players = gameController.allPlayers;
  const currentPlayer = players[playerNum];

  currentPlayer.clearBoard();
  currentPlayer.populateBoard();

  updateBoardUI(suffix, currentPlayer.gameboard);
};

export const handleClearBoard = (suffix) => {
  const gameController = getGameController();
  if (!gameController) return;

  const playerNum = suffix === "one" ? 0 : 1;
  const players = gameController.allPlayers;
  const currentPlayer = players[playerNum];

  currentPlayer.clearBoard();
  updateBoardUI(suffix, currentPlayer.gameboard);
};
