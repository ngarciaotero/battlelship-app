import { gameStateManager } from "../ui/stateManagers/gameStateManager.js";

export const handleStartGameButton = () => {
  gameStateManager.setGameMode(1);
  gameStateManager.setGameMode(2);
};
