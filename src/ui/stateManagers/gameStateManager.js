import { toggleVisibility } from "../helpers/visibilityToggle.js";

export const gameStateManager = {
  setGameMode: (playerNum) => {
    const suffix = playerNum === 1 ? "one" : "two";
    toggleVisibility(
      `.placement-menu-${suffix}`,
      false,
      `.scoreboard-${suffix}`,
      true,
      `.player-${suffix}-overlay`,
      false,
      ".game-controls",
      true,
      ".setup-controls",
      false
    );
  },
};
