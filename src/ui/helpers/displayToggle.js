import { toggleVisibility } from "./visibilityToggle.js";

export const displayToggle = {
  displayModeMenu: () => {
    toggleVisibility(
      `.mode-menu`,
      true,
      `.game-layout`,
      false,
      ".gameover-modal",
      false
    );
  },

  displayGameLayout: () => {
    toggleVisibility(
      `.game-layout`,
      true,
      `.mode-menu`,
      false,
      ".gameover-modal",
      false
    );
  },

  displayGameOverModal: () => {
    ".gameover-modal", true;
  },
};
