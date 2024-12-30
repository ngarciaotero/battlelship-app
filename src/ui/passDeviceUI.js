import { createElement } from "./helpers/createElement.js";
import { handlePassScreenButton } from "../eventHandler/passBtnHandler.js";

export const createPassDeviceUI = () => {
  const container = createElement("div", ["pass-screen-container", "hidden"]);

  const instructions = createElement(
    "p",
    [],
    "Pass the device to the next player"
  );
  const passButton = createElement("button", "pass-btn", "Continue");
  passButton.disabled = true;

  passButton.addEventListener("click", () => handlePassScreenButton());

  container.append(instructions);
  container.append(passButton);
  return container;
};
