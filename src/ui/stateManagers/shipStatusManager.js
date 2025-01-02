import { SHIP_CONFIGS } from "../shipStatusBoardUI.js";

const sunkShipsByPlayer = {
  one: new Set(),
  two: new Set(),
};

const getShipKeyForLength = (ship, sunkShips) => {
  const matchingShips = Object.entries(SHIP_CONFIGS).filter(
    ([_, config]) => config.length === ship.length
  );

  if (matchingShips.length === 0) return null;

  let shipKey;
  if (matchingShips.length === 1) {
    shipKey = matchingShips[0][0];
  } else {
    shipKey = matchingShips.find(([key]) => !sunkShips.has(key))?.[0];
    if (!shipKey) return null;
  }

  return shipKey;
};

const updateShipElement = (shipKey, suffix, action) => {
  const className = `ship-${SHIP_CONFIGS[
    shipKey
  ].label.toLowerCase()}-${suffix}`;
  const shipElement = document.querySelector(`.${className}`);

  if (shipElement) {
    if (action === "sunk") {
      shipElement.classList.remove("ship-intact");
      shipElement.classList.add("ship-sunk");
    } else if (action === "reset") {
      shipElement.classList.remove("ship-sunk");
      shipElement.classList.add("ship-intact");
    }
  }
};

export const shipStatusUI = {
  displayShipTrack(ship, suffix) {
    const sunkShips = sunkShipsByPlayer[suffix];
    if (!sunkShips) return;

    const shipKey = getShipKeyForLength(ship, sunkShips);
    if (!shipKey) return;

    sunkShips.add(shipKey);
    updateShipElement(shipKey, suffix, "sunk");
  },

  clearShipTracker() {
    Object.keys(sunkShipsByPlayer).forEach((suffix) => {
      const sunkShips = sunkShipsByPlayer[suffix];

      sunkShips.forEach((shipKey) => {
        sunkShips.delete(shipKey);
        updateShipElement(shipKey, suffix, "reset");
      });
    });
  },
};
