import { createElement } from "./helpers/createElement.js";
import { createGameboardUI } from "./gameboardUI.js";

export const createPlayerSection = (playerNum) => {
  const suffix = playerNum === 1 ? "one" : "two";

  const playerContainer = createElement("div", `player-${suffix}-container`);

  //   create board
  const board = createElement("div", `board-${suffix}`);
  const boardGrid = createGameboardUI(suffix);

  board.appendChild(boardGrid);

  //   create ship info container
  const shipInfoContainer = createElement("div", [
    "ship-info-container",
    `ship-info-${suffix}`,
  ]);

  //   create placement menu
  const placementMenu = createPlacementMenu(suffix);

  //   create scoreboard container
  const scoreboardContainer = createScoreboardContainer(suffix);

  shipInfoContainer.append(placementMenu, scoreboardContainer);

  // create message board
  const messageBoard = createMessageBoard(suffix);

  // create overlay
  const overlay = createOverlay(suffix);

  playerContainer.append(board, shipInfoContainer, messageBoard, overlay);

  return playerContainer;
};

const createPlacementMenu = (suffix) => {
  const placementMenu = createElement("div", [
    "placement-menu",
    `placement-menu-${suffix}`,
  ]);
  const menuTitle = createElement("h3", null, "Place Your Ships");
  const quickSetup = createQuickSetup(suffix);
  const manualSetup = createManualSetup(suffix);

  placementMenu.append(menuTitle, quickSetup, manualSetup);
  return placementMenu;
};

//   quick setup section
const createQuickSetup = (suffix) => {
  const quickSetup = createElement("div", "quick-setup");
  const quickSetupTitle = createElement("h5", null, "Quick Setup");

  const populateBtn = createElement(
    "button",
    ["populate-board-btn", `populate-btn-${suffix}`],
    "Generate Random Board"
  );

  quickSetup.append(quickSetupTitle, populateBtn);
  return quickSetup;
};

//   manual setup section
const createManualSetup = (suffix) => {
  const manualSetup = createElement("div", "manual-setup");
  const manualSetupTitle = createElement("h5", null, "Manual Setup");

  const setupInstructions = createElement(
    "p",
    null,
    "Drag and drop ships to position them"
  );

  const unplacedShips = createElement("div", [
    "unplaced-ships",
    `unplaced-ships-${suffix}`,
  ]);
  const clearBtn = createElement("button", "clear-board-btn", "Clear Board");

  manualSetup.append(
    manualSetupTitle,
    setupInstructions,
    unplacedShips,
    clearBtn
  );
  return manualSetup;
};

// scoreboard section
const createScoreboardContainer = (suffix) => {
  const scoreboardContainer = createElement("div", [
    "scoreboard-container",
    `scoreboard-${suffix}`,
    "hidden",
  ]);
  const scoreboardTitle = createElement("h4", null, "Ships Status");

  const placedShips = createElement("div", [
    "placed-ships",
    `placed-ships-${suffix}`,
  ]);

  scoreboardContainer.append(scoreboardTitle, placedShips);
  return scoreboardContainer;
};

// message section
const createMessageBoard = (suffix) => {
  const messageBoard = createElement("div", [
    "message-board",
    `message-board-${suffix}`,
  ]);
  const message = createElement("h3", `message-${suffix}`);
  messageBoard.appendChild(message);
  return messageBoard;
};

// overlay section
const createOverlay = (suffix) => {
  const overlay = createElement(
    "div",
    ["player-overlay", `player-${suffix}-overlay`, "hidden"],
    "Waiting for Player to finish ..."
  );

  return overlay;
};
