import { toggleVisibility } from "../helpers/visibilityToggle.js";
import { createGameController } from "../../game/gameController.js";
import { createPlayer } from "../../factories/player.js";
import { createPlayerSection } from "../playerSectionUI.js";
import { displayToggle } from "../helpers/displayToggle.js";
import { updateStartButtonUI } from "../updateStartBtnUI.js";
import { boardUIHandler } from "./boardStateManager.js";
import { getPlayer } from "../../utils/playerUtils.js";
import { updatePassButtonUI } from "../updatePassBtnUI.js";
import { messageUI } from "./messageStateManager.js";
import { shipStatusUI } from "./shipStatusManager.js";
import { dragDropUIHandler } from "./dragAndDropStateManager.js";

const MODES = {
  HUMAN_VS_COMPUTER: "hvc",
  HUMAN_VS_HUMAN: "hvh",
};

let gameController = null;

export const placementStateManager = {
  setHumanPlacementMode(playerNum) {
    const suffix = playerNum === 1 ? "one" : "two";
    toggleVisibility(
      `.placement-menu-${suffix}`,
      true,
      `.scoreboard-${suffix}`,
      false,
      ".setup-controls",
      true,
      ".game-controls",
      false,
      ".turn-one-overlay",
      false,
      ".turn-two-overlay",
      false
    );
  },

  setComputerPlacementMode(playerNum) {
    const suffix = playerNum === 1 ? "one" : "two";
    toggleVisibility(
      `.placement-menu-${suffix}`,
      false,
      `.scoreboard-${suffix}`,
      false,
      `.board-${suffix}`,
      false,
      `.player-${suffix}-overlay`,
      true,
      ".turn-one-overlay",
      false,
      ".turn-two-overlay",
      false
    );
  },

  togglePlayerOverlay(playerNum) {
    const suffix = playerNum === 1 ? "one" : "two";
    toggleVisibility(
      `.player-${suffix}-overlay`,
      true,
      `.board-${suffix}`,
      false
    );
  },

  setPassScreen() {
    toggleVisibility(`.pass-screen-container`, true);
  },

  removePlayerOverlay(playerNum) {
    const suffix = playerNum === 1 ? "one" : "two";
    toggleVisibility(
      `.player-${suffix}-overlay`,
      false,
      `.board-${suffix}`,
      true
    );
  },

  passScreenUI(opponentPlayerNum, currentPlayerNum) {
    this.togglePlayerOverlay(opponentPlayerNum);
    this.removePlayerOverlay(currentPlayerNum);
  },

  getGameController() {
    return gameController;
  },

  setupPlacementMode(mode) {
    this.setupPlayerContainers();
    this.initializeController(mode);
    this.setupPlacementState(mode);
    displayToggle.displayGameLayout();
    dragDropUIHandler.initializeDragAndDrop("one");
    dragDropUIHandler.initializeDragAndDrop("two");
    return gameController;
  },

  setupPlayerContainers() {
    const playerOneContainer = document.querySelector(".player-one-section");
    const playerTwoContainer = document.querySelector(".player-two-section");

    playerOneContainer.innerHTML = "";
    playerTwoContainer.innerHTML = "";

    playerOneContainer.appendChild(createPlayerSection(1));
    playerTwoContainer.appendChild(createPlayerSection(2));
  },

  initializeController(mode) {
    const players =
      mode === MODES.HUMAN_VS_COMPUTER
        ? [createPlayer("real"), createPlayer("computer")]
        : [createPlayer("real"), createPlayer("real")];

    gameController = createGameController();
    gameController.addPlayers(players);
  },

  setupPlacementState(mode) {
    if (mode === MODES.HUMAN_VS_COMPUTER) {
      this.setHumanPlacementMode(1);
      this.setComputerPlacementMode(2);
    } else {
      this.setHumanPlacementMode(1);
      this.setHumanPlacementMode(2);
      this.setPassScreen();
      updatePassButtonUI(getPlayer("one"));
    }
    this.togglePlayerOverlay(2);
  },

  determineCurrentMode() {
    const players = gameController.allPlayers;
    return players.some((player) => player.isComputer())
      ? MODES.HUMAN_VS_COMPUTER
      : MODES.HUMAN_VS_HUMAN;
  },

  resetGameMode() {
    const currentMode = this.determineCurrentMode();
    boardUIHandler.clearBoardsUI();
    this.setupPlacementState(currentMode);
    displayToggle.displayGameLayout();
    updateStartButtonUI();
    dragDropUIHandler.resetDockShips("one");
    dragDropUIHandler.resetDockShips("two");
    dragDropUIHandler.initializeDragAndDrop("one");
    dragDropUIHandler.initializeDragAndDrop("two");
    messageUI.clearMessageBoard("one");
    messageUI.clearMessageBoard("two");
    shipStatusUI.clearShipTracker();
  },
};
