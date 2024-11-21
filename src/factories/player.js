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
  const gameboard = createGameboard();

  function getType() {
    return type;
  }

  function getBoard() {
    return gameboard;
  }

  return {
    get type() {
      return getType();
    },
    get gameboard() {
      return getBoard();
    },
  };
}
