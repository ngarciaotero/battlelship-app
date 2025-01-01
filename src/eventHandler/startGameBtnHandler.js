import { gameStateManager } from "../ui/stateManagers/gameStateManager.js";
import { getGameController } from "./modeSelectionHandler.js";

export const handleStartGameButton = () => {
  const gameController = getGameController();
  gameController.initializeGame();

  gameStateManager.setupGameMode();
};
