import { createGameboard } from "./gameboard.js";
import { createShip } from "./ship.js";

const BOARD_CONFIG = Object.freeze({
  SIZE: 10,
  SHIP_LENGTHS: [5, 4, 3, 3, 2],
  MAX_PLACEMENT_ATTEMPTS: 100,
  AXIS: { HORIZONTAL: "horizontal", VERTICAL: "vertical" },
});

function createPositionTracker() {
  let attempted = new Set();

  function add(position) {
    validatePosition(position);
    attempted.add(getPositionKey(position));
  }

  function has(position) {
    return attempted.has(getPositionKey(position));
  }

  function clear() {
    attempted.clear();
  }

  function isFull() {
    return attempted.size >= BOARD_CONFIG.SIZE * BOARD_CONFIG.SIZE;
  }

  function getPositionKey(position) {
    return `${position.x},${position.y}`;
  }

  function validatePosition(position) {
    if (
      !position ||
      typeof position.x !== "number" ||
      typeof position.y !== "number"
    ) {
      throw new Error("Invalid position object");
    }

    if (
      position.x < 0 ||
      position.x >= BOARD_CONFIG.SIZE ||
      position.y < 0 ||
      position.y >= BOARD_CONFIG.SIZE
    ) {
      throw new Error("Position out of board bounds");
    }
  }

  return { add, has, clear, isFull, getPositionKey };
}

function createShipPlacer() {
  const orientations = [
    BOARD_CONFIG.AXIS.HORIZONTAL,
    BOARD_CONFIG.AXIS.VERTICAL,
  ];

  function generatePosition(positionTracker) {
    if (positionTracker.isFull()) return null;

    const maxAttempts = BOARD_CONFIG.SIZE * BOARD_CONFIG.SIZE;
    for (let attempts = 0; attempts < maxAttempts; attempts++) {
      const position = {
        x: Math.floor(Math.random() * BOARD_CONFIG.SIZE),
        y: Math.floor(Math.random() * BOARD_CONFIG.SIZE),
      };

      if (!positionTracker.has(position)) {
        positionTracker.add(position);
        return position;
      }
    }
    return null;
  }

  function placeShipRandomly(board, ship, positionTracker) {
    positionTracker.clear();

    for (
      let attempts = 0;
      attempts < BOARD_CONFIG.MAX_PLACEMENT_ATTEMPTS;
      attempts++
    ) {
      const orientation = orientations[attempts % orientations.length];
      const position = generatePosition(positionTracker);

      if (!position) break;

      if (board.placeShip(ship, position, orientation)) {
        return { success: true, position, orientation };
      }
    }

    return { success: false, reason: "Max placement attempts reached" };
  }

  return { placeShipRandomly };
}

function presetShipConfig() {
  return [
    {
      length: 5,
      position: { x: 0, y: 0 },
      orientation: BOARD_CONFIG.AXIS.HORIZONTAL,
    },
    {
      length: 4,
      position: { x: 2, y: 2 },
      orientation: BOARD_CONFIG.AXIS.VERTICAL,
    },
    {
      length: 3,
      position: { x: 4, y: 4 },
      orientation: BOARD_CONFIG.AXIS.HORIZONTAL,
    },
    {
      length: 3,
      position: { x: 6, y: 6 },
      orientation: BOARD_CONFIG.AXIS.VERTICAL,
    },
    {
      length: 2,
      position: { x: 8, y: 8 },
      orientation: BOARD_CONFIG.AXIS.HORIZONTAL,
    },
  ];
}

export function createRandomShipConfig() {
  try {
    const gameboard = createGameboard();
    const positionTracker = createPositionTracker();
    const shipPlacer = createShipPlacer();
    const shipConfigs = [];

    for (const length of BOARD_CONFIG.SHIP_LENGTHS) {
      const ship = createShip(length);
      const placementResult = shipPlacer.placeShipRandomly(
        gameboard,
        ship,
        positionTracker
      );

      if (!placementResult.success) {
        console.warn(
          `Failed to place ship of length ${length}: ${placementResult.reason}. Falling back to preset board.`
        );
        return presetShipConfig();
      }

      shipConfigs.push({
        length,
        position: placementResult.position,
        orientation: placementResult.orientation,
      });
    }
    return shipConfigs;
  } catch (error) {
    console.error("Failed to generate ship configurations:", error);
    return presetShipConfig();
  }
}
