import { boardUIHandler } from "../ui/stateManagers/boardStateManager.js";
import { getPlayer } from "../utils/playerUtils.js";
import { dragDropUIHandler } from "../ui/stateManagers/dragAndDropStateManager.js";

export const handleRandomPopulation = (suffix) => {
  const currentPlayer = getPlayer(suffix);
  if (!currentPlayer) return;

  dragDropUIHandler.resetDockShips(suffix);
  currentPlayer.clearBoard();
  currentPlayer.populateBoard();
  boardUIHandler.randomlyPopulateBoard(suffix, currentPlayer);
};
