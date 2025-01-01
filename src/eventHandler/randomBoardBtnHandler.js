import { boardUIHandler } from "../ui/stateManagers/boardStateManager.js";
import { getPlayer } from "../utils/playerUtils.js";

export const handleRandomPopulation = (suffix) => {
  const currentPlayer = getPlayer(suffix);
  if (!currentPlayer) return;

  currentPlayer.clearBoard();
  currentPlayer.populateBoard();
  boardUIHandler.randomlyPopulateBoard(suffix, currentPlayer);
};
