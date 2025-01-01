import { placementStateManager } from "../ui/stateManagers/placementStateManager.js";

export const handleModeSelect = (mode) => {
  return placementStateManager.setupPlacementMode(mode);
};

export const getGameController = () =>
  placementStateManager.getGameController();
