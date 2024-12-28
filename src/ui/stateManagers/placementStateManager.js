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
      `.player-${suffix}-overlay`,
      true
    );
  },

  togglePlayerOverlay: (playerNum, show) => {
    const suffix = playerNum === 1 ? "one" : "two";
    const overlay = document.querySelector(`.player-${suffix}-overlay`);
    if (overlay) overlay.classList.toggle("hidden", !show);
  },
};
