import { toggleVisibility } from "./visibilityToggle.js";

export const displayToggle = {
  displayModeMenu: () => {
    toggleVisibility(
      `.mode-menu`,
      true,
      `.game-layout`,
      false,
      ".gameover-backdrop",
      false
    );
  },

  displayGameLayout: () => {
    toggleVisibility(
      `.game-layout`,
      true,
      `.mode-menu`,
      false,
      ".gameover-backdrop",
      false
    );
  },

  displayGameOverModal: () => {
    toggleVisibility(".gameover-backdrop", true);
  },
};
