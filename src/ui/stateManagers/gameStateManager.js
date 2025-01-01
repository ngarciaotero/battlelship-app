import { toggleVisibility } from "../helpers/visibilityToggle.js";
import { getGameController } from "../../eventHandler/modeSelectionHandler.js";
import { boardUIHandler } from "./boardStateManager.js";
import { cellUIHandler } from "./cellStateManager.js";

export const gameStateManager = {
  setupGameMode() {
    const gameController = getGameController();
    gameController.initializeGame();

    // reset and setup boards
    boardUIHandler.clearBoardsUI();
    cellUIHandler.setupAttackListeners();

    // configure ui for game mode
    this.gameLayoutUI(1);
    this.gameLayoutUI(2);
    this.updateTurnOverlay();
  },

  gameLayoutUI(playerNum) {
    const suffix = playerNum === 1 ? "one" : "two";
    toggleVisibility(
      `.placement-menu-${suffix}`,
      false,
      `.scoreboard-${suffix}`,
      true,
      `.board-${suffix}`,
      true,
      `.player-${suffix}-overlay`,
      false,
      ".game-controls",
      true,
      ".setup-controls",
      false,
      ".pass-screen-container",
      false
    );
  },

  updateTurnOverlay() {
    const gameController = getGameController();
    if (gameController.currentPlayer === gameController.allPlayers[0]) {
      toggleVisibility(".turn-one-overlay", false, ".turn-two-overlay", true);
    } else {
      toggleVisibility(".turn-two-overlay", false, ".turn-one-overlay", true);
    }
  },
};
