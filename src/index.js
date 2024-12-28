import "./style.css";
import { createModeMenu } from "./ui/modeMenuUI.js";
import { createGameLayout } from "./ui/gameLayoutUI.js";
import { createGameOverModal } from "./ui/gameOverModalUI.js";

import { handleModeSelect } from "./eventHandler/modeSelectionHandler.js";
import { handleBackButton } from "./eventHandler/backBtnHandler.js";
import { handleStartGameButton } from "./eventHandler/startGameBtnHandler.js";
import { handleEndGameButton } from "./eventHandler/endGameBtnHandler.js";
import { handleRestartGameButton } from "./eventHandler/restartGameBtnHandler.js";

document.addEventListener("DOMContentLoaded", () => {
  const mainContent = document.querySelector(".main-content");

  // create and append the mode menu
  const modeMenuElement = createModeMenu(handleModeSelect);
  const gameoverModalElement = createGameOverModal();
  const gameElement = createGameLayout(
    handleBackButton,
    handleStartGameButton,
    handleEndGameButton,
    handleRestartGameButton
  );

  mainContent.appendChild(modeMenuElement);
  mainContent.appendChild(gameElement);
  mainContent.append(gameoverModalElement);
});
