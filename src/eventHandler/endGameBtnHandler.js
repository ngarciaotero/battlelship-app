import { displayToggle } from "../ui/helpers/displayToggle.js";
import { getGameController } from "./modeSelectionHandler.js";
import { updateStartButtonUI } from "../ui/updateStartBtnUI.js";
import { shipStatusUI } from "../ui/stateManagers/shipStatusManager.js";

export const handleEndGameButton = () => {
  const gameController = getGameController();
  gameController.endGame();

  displayToggle.displayModeMenu();
  updateStartButtonUI();
  shipStatusUI.clearShipTracker();
};
