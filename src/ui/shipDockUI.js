import { createElement } from "./helpers/createElement.js";
import { SHIP_CONFIGS } from "./shipStatusBoardUI.js";

export const createUnplacedShipContainer = (suffix) => {
  const dock = createElement("div", [
    "ship-dock",
    `ship-dock-${suffix}`,
    "ship-dock-horizontal",
  ]);

  Object.entries(SHIP_CONFIGS).forEach(([type, config]) => {
    const ship = createDockShip(type, config, suffix);
    dock.appendChild(ship);
  });

  return dock;
};

const createDockShip = (type, config, suffix) => {
  const wrapper = createElement("div", [
    "dock-ship",
    `dock-ship-${suffix}`,
    "dock-ship-horizontal",
  ]);
  wrapper.dataset.orientation = "horizontal";

  const label = createElement(
    "div",
    ["ship-label", "ship-label-horizontal"],
    type
  );

  const ship = createElement("div", [
    "ship-body",
    `ship-${type}`,
    "ship-horizontal",
  ]);

  for (let i = 0; i < config.length; i++) {
    ship.appendChild(createElement("div", "ship-segment"));
  }

  wrapper.append(label, ship);
  return wrapper;
};
