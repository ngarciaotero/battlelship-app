import { boardUIHandler } from "../ui/stateManagers/boardStateManager.js";
import { getPlayer } from "../utils/playerUtils.js";

export const handleClearBoard = (suffix) => {
  const currentPlayer = getPlayer(suffix);
  if (!currentPlayer) return;
  currentPlayer.clearBoard();

  boardUIHandler.clearShipsFromBoard(suffix, currentPlayer);
};
