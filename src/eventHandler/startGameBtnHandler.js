import { gameStateManager } from "../ui/stateManagers/gameStateManager.js";
import { getGameController } from "./modeSelectionHandler.js";
import { boardUIHandler } from "../ui/stateManagers/boardStateManager.js";
import { cellUIHandler } from "../ui/stateManagers/cellStateManager.js";

export const handleStartGameButton = () => {
  const gameController = getGameController();
  gameController.initializeGame();

  // clear both player boards
  boardUIHandler.clearBoardsUI();
  cellUIHandler.setupAttackListeners();

  gameStateManager.updateTurnOverlay();
  gameStateManager.setGameMode(1);
  gameStateManager.setGameMode(2);
};
