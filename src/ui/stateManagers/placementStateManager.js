import { toggleVisibility } from "../helpers/visibilityToggle.js";

export const placementStateManager = {
  setHumanPlacementMode: (playerNum) => {
    const suffix = playerNum === 1 ? "one" : "two";
    toggleVisibility(
      `.placement-menu-${suffix}`,
      true,
      `.scoreboard-${suffix}`,
      false,
      ".setup-controls",
      true,
      ".game-controls",
      false
    );
  },

  setComputerPlacementMode: (playerNum) => {
    const suffix = playerNum === 1 ? "one" : "two";
    toggleVisibility(
      `.placement-menu-${suffix}`,
      false,
      `.scoreboard-${suffix}`,
      false,
      `.board-${suffix}`,
      false,
      `.player-${suffix}-overlay`,
      true
    );
  },

  togglePlayerOverlay: (playerNum) => {
    const suffix = playerNum === 1 ? "one" : "two";
    toggleVisibility(
      `.player-${suffix}-overlay`,
      true,
      `.board-${suffix}`,
      false
    );
  },

  setPassScreen: () => {
    toggleVisibility(`.pass-screen-container`, true);
  },

  removePlayerOverlay: (playerNum) => {
    const suffix = playerNum === 1 ? "one" : "two";
    toggleVisibility(
      `.player-${suffix}-overlay`,
      false,
      `.board-${suffix}`,
      true
    );
  },
};
