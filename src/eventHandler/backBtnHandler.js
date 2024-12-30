import { displayToggle } from "../ui/helpers/displayToggle.js";
import { getGameController } from "./modeSelectionHandler.js";
import { updateStartButtonUI } from "../ui/updateStartBtnUI.js";

export const handleBackButton = () => {
  const gameController = getGameController();
  gameController.endPreGame();

  displayToggle.displayModeMenu();
  updateStartButtonUI();
};
