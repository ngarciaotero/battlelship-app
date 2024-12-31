import { createElement } from "./helpers/createElement.js";
import { handleEndGameButton } from "../eventHandler/endGameBtnHandler.js";
import { handleRestartGameButton } from "../eventHandler/restartGameBtnHandler.js";

export const createGameOverModal = () => {
  const gameoverBackdrop = createElement("div", [
    "gameover-backdrop",
    "hidden",
  ]);
  // create modal container
  const gameoverContainer = createElement("div", "gameover-modal");

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

  rematchButton.addEventListener("click", () => {
    handleRestartGameButton();
  });
  endGameButton.addEventListener("click", () => {
    handleEndGameButton();
  });

  // build the modal
  optionsContainer.appendChild(rematchButton);
  optionsContainer.appendChild(endGameButton);

  gameoverContainer.appendChild(heading);
  gameoverContainer.appendChild(optionsContainer);

  gameoverBackdrop.appendChild(gameoverContainer);

  return gameoverBackdrop;
};
