import { createGameboard } from "./gameboard";

const PLAYER_TYPE = Object.freeze({ REAL: "real", COMPUTER: "computer" });

function validatePlayerType(playerType) {
  if (![PLAYER_TYPE.REAL, PLAYER_TYPE.COMPUTER].includes(playerType)) {
    throw new Error(
      `Invalid player type: type must be "${PLAYER_TYPE.REAL}" or "${PLAYER_TYPE.COMPUTER}"`
    );
  }
}

export function createPlayer(playerType) {
  validatePlayerType(playerType);

  const type = playerType;
  let gameboard = initializeGameboard();

  function getType() {
    return type;
  }

  function getGameboard() {
    return gameboard;
  }

  function initializeGameboard() {
    const gameboard = createGameboard();

    if (type === PLAYER_TYPE.REAL) return gameboard;

    if (!gameboard.populateRandomly()) {
      throw new Error("Failed to initialize gameboard for computer player");
    }
    return gameboard;
  }

  function resetShipConfig() {
    try {
      gameboard.resetBoard();
      gameboard.populateRandomly();
      return true;
    } catch (error) {
      console.error(
        `Failed to regenerate a new ship configuration for ${type} player: `,
        error
      );
      return false;
    }
  }

  function placedShipCount() {
    return gameboard.placedShips;
  }

  function isDefeated() {
    return gameboard.allShipsSunk();
  }

  function resetGameboard() {
    if (type === PLAYER_TYPE.COMPUTER) {
      gameboard.resetGameboard();
      gameboard.populateRandomly();
    }
    gameboard.resetGameboard();
  }

  return {
    get type() {
      return getType();
    },
    get gameboard() {
      return getGameboard();
    },
    get isPlayerObject() {
      return true;
    },
    resetShipConfig,
    placedShipCount,
    isDefeated,
    resetGameboard,
  };
}
