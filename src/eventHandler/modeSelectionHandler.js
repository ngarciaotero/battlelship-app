import { createPlayerSection } from "../ui/playerSectionUI.js";
import { displayToggle } from "../ui/helpers/displayToggle.js";
import { placementStateManager } from "../ui/stateManagers/placementStateManager.js";

const MODES = {
  HUMAN_VS_COMPUTER: "hvc",
  HUMAN_VS_HUMAN: "hvh",
};

export const handleModeSelect = (mode) => {
  const playerOneContainer = document.querySelector(".player-one-section");
  const playerTwoContainer = document.querySelector(".player-two-section");

  const playerOneSection = createPlayerSection(1);
  const playerTwoSection = createPlayerSection(2);

  playerOneContainer.innerHTML = "";
  playerTwoContainer.innerHTML = "";

  playerOneContainer.appendChild(playerOneSection);
  playerTwoContainer.appendChild(playerTwoSection);

  if (mode === MODES.HUMAN_VS_COMPUTER) {
    placementStateManager.setHumanPlacementMode(1);
    placementStateManager.setComputerPlacementMode(2);
    placementStateManager.togglePlayerOverlay(2, true);

    displayToggle.displayGameLayout();
  } else if (mode === MODES.HUMAN_VS_HUMAN) {
    placementStateManager.setHumanPlacementMode(1);
    placementStateManager.setHumanPlacementMode(2);
    placementStateManager.togglePlayerOverlay(2, true);

    displayToggle.displayGameLayout();
  }
};
