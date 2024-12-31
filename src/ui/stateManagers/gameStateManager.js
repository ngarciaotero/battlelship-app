import { toggleVisibility } from "../helpers/visibilityToggle.js";
import { getGameController } from "../../eventHandler/modeSelectionHandler.js";

export const gameStateManager = {
  setGameMode: (playerNum) => {
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
