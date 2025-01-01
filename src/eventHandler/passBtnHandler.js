import { placementStateManager } from "../ui/stateManagers/placementStateManager.js";

export const handlePassScreenButton = () => {
  const opponentPlayerNum = 1;
  const currentPlayerNum = 2;

  placementStateManager.passScreenUI(opponentPlayerNum, currentPlayerNum);
};
