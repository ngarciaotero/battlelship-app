import { createElement } from "./helpers/createElement.js";

export const createGameOverModal = () => {
  // create modal container
  const gameoverContainer = createElement("div", ["gameover-modal", "hidden"]);

  // create heading
  const heading = createElement("h1", null, "Game Over!");

  // create options container
  const optionsContainer = createElement("div", "gameover-options");

  // create buttons
  const rematchButton = createElement("button", "rematch-modal-btn", "Rematch");
  const endGameButton = createElement(
    "button",
    "end-game-modal-btn",
    "End Game"
  );

  // build the modal
  optionsContainer.appendChild(rematchButton);
  optionsContainer.appendChild(endGameButton);

  gameoverContainer.appendChild(heading);
  gameoverContainer.appendChild(optionsContainer);

  return gameoverContainer;
};
