import { placementStateManager } from "../ui/stateManagers/placementStateManager.js";

export const handlePassScreenButton = () => {
  placementStateManager.togglePlayerOverlay(1);
  placementStateManager.removePlayerOverlay(2);
};
