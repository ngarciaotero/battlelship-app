import { createAttributionsUI } from "./attributionUI.js";
import { createElement } from "./helpers/createElement.js";

const MODES = {
  HUMAN_VS_COMPUTER: "hvc",
  HUMAN_VS_HUMAN: "hvh",
};

export const createModeMenu = (onModeSelect) => {
  const menuContainer = createElement("div", "mode-menu");

  //   create heading
  const heading = createElement("h3", null, "Ahoy, Captain! Ready to Play?");
  menuContainer.appendChild(heading);

  // create instruction paragraph
  const instructions = createElement("p", null, "Select your game mode:");
  menuContainer.appendChild(instructions);

  // create mode options container
  const modeOptions = createElement("div", "mode-options");

  // create Human vs Computer button
  const hvcButton = createElement("button", "mode-btn");
  hvcButton.setAttribute("data-mode", MODES.HUMAN_VS_COMPUTER);
  const personIcon1 = createElement("span", ["icon", "person-icon"]);
  const robotIcon = createElement("span", ["icon", "robot-icon"]);
  hvcButton.appendChild(personIcon1);
  hvcButton.appendChild(document.createTextNode("Human vs Computer"));
  hvcButton.appendChild(robotIcon);

  // create Human vs Human button
  const hvhButton = createElement("button", "mode-btn");
  hvhButton.setAttribute("data-mode", MODES.HUMAN_VS_HUMAN);
  const personIcon2 = createElement("span", ["icon", "person-icon"]);
  const personIcon3 = createElement("span", ["icon", "person-icon"]);
  hvhButton.appendChild(personIcon2);
  hvhButton.appendChild(document.createTextNode("Human vs Human"));
  hvhButton.appendChild(personIcon3);

  // add event handler to mode buttons
  const handleModeClick = (event) => {
    const selectedMode = event.currentTarget.dataset.mode;
    onModeSelect(selectedMode);
  };

  // add event listeners to mode buttons
  hvcButton.addEventListener("click", handleModeClick);
  hvhButton.addEventListener("click", handleModeClick);

  // add buttons to mode options
  modeOptions.appendChild(hvcButton);
  modeOptions.appendChild(hvhButton);

  // add mode options to container
  menuContainer.appendChild(modeOptions);

  // create attribution footer
  menuContainer.appendChild(createAttributionsUI());

  return menuContainer;
};
