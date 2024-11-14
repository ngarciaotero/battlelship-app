import { createGameboard } from "./gameboard";

export function createPlayer(playerType) {
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
