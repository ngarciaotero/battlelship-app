import { createElement } from "./helpers/createElement.js";

export const createShipTrackerBoard = (suffix) => {
  const placedShipsContainer = createElement("div", [
    "placed-ships",
    `placed-ships-${suffix}`,
  ]);

  // create ship elements
  Object.entries(SHIP_CONFIGS).forEach(([shipType, config]) => {
    const shipElement = createShipElement(shipType, config, suffix);
    placedShipsContainer.appendChild(shipElement);
  });

  return placedShipsContainer;
};

export const SHIP_CONFIGS = {
  carrier: { length: 5, label: "Carrier" },
  battleship: { length: 4, label: "Battleship" },
  cruiser: { length: 3, label: "Cruiser" },
  submarine: { length: 3, label: "Submarine" },
  destroyer: { length: 2, label: "Destroyer" },
};

const createShipElement = (shipType, config, suffix) => {
  const shipContainer = createElement("div", ["ship-status-container"]);

  const shipLabel = createElement("span", ["ship-label"], config.label);

  // create ship visualization container
  const shipVisual = createElement("div", [
    "ship-visual",
    `ship-${shipType}-${suffix}`,
    "ship-intact",
  ]);

  // create segments to represent ship length
  for (let i = 0; i < config.length; i++) {
    const segment = createElement("div", ["ship-segment", "segment-intact"]);
    shipVisual.appendChild(segment);
  }

  shipContainer.append(shipLabel, shipVisual);
  return shipContainer;
};
