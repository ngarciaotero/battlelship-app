import { placementStateManager } from "../ui/stateManagers/placementStateManager.js";
import { getGameController } from "./modeSelectionHandler.js";

export const handleRestartGameButton = () => {
  const gameController = getGameController();
  gameController.resetGame();

  placementStateManager.resetGameMode();
};
