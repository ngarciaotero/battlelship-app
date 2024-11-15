import { createGameboard } from "./gameboard";

const REAL_PLAYER = "real";
const COMPUTER_PLAYER = "computer";

function validatePlayerType(playerType) {
  if (![REAL_PLAYER, COMPUTER_PLAYER].includes(playerType)) {
    throw new Error(
      `Invalid player type: type must be "${REAL_PLAYER}" or "${COMPUTER_PLAYER}"`
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
