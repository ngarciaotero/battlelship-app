import { getGameController } from "../eventHandler/modeSelectionHandler.js";

export const updateStartButtonUI = () => {
  const startButton = document.querySelector(".start-game-btn");

  if (startButton) {
    startButton.disabled = !canStartGame();
  }
};

const canStartGame = () => {
  const gameController = getGameController();
  if (!gameController) return false;

  return gameController.validatePlayerBoards();
};
