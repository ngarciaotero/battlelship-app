import { createElement } from "./helpers/createElement.js";

export const createGameLayout = (
  onBackClick,
  onStartGameClick,
  onEndGameClick,
  onRestartGameClick
) => {
  const gameContainer = createElement("div", ["game-layout", "hidden"]);

  // create player sections
  const playerOneSection = createElement("div", [
    "player-section",
    "player-one-section",
  ]);
  const playerTwoSection = createElement("div", [
    "player-section",
    "player-two-section",
  ]);

  // create controls container
  const controls = createElement("div", "controls");

  // create setup controls
  const setupControls = createElement("div", "setup-controls");
  const backButton = createElement("button", "home-btn", "Go back");
  const startGameButton = createElement(
    "button",
    "start-game-btn",
    "Start Game"
  );

  backButton.addEventListener("click", () => {
    onBackClick();
  });
  startGameButton.addEventListener("click", () => {
    onStartGameClick();
  });

  setupControls.appendChild(backButton);
  setupControls.appendChild(startGameButton);

  // create game controls
  const gameControls = createElement("div", ["game-controls", "hidden"]);
  const endGameButton = createElement("button", "end-game-btn", "End Game");
  const restartGameButton = createElement(
    "button",
    "restart-game-btn",
    "Restart Game"
  );

  endGameButton.addEventListener("click", () => {
    onEndGameClick();
  });
  restartGameButton.addEventListener("click", () => {
    onRestartGameClick();
  });

  gameControls.appendChild(endGameButton);
  gameControls.appendChild(restartGameButton);

  // build the layout
  controls.appendChild(setupControls);
  controls.appendChild(gameControls);

  // add all sections to container
  gameContainer.appendChild(playerOneSection);
  gameContainer.appendChild(playerTwoSection);
  gameContainer.appendChild(controls);

  return gameContainer;
};
