import { boardUIHandler } from "../ui/stateManagers/boardStateManager.js";
import { getPlayer } from "../utils/playerUtils.js";
import { dragDropUIHandler } from "../ui/stateManagers/dragAndDropStateManager.js";

export const handleClearBoard = (suffix) => {
  const currentPlayer = getPlayer(suffix);
  if (!currentPlayer) return;
  currentPlayer.clearBoard();
  dragDropUIHandler.resetDockShips(suffix);

  boardUIHandler.clearShipsFromBoard(suffix, currentPlayer);
};
