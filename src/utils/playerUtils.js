import { getGameController } from "../eventHandler/modeSelectionHandler.js";

export const getPlayer = (suffix) => {
  const gameController = getGameController();
  if (!gameController) return null;

  const playerNum = suffix === "one" ? 0 : 1;
  const players = gameController.allPlayers;
  return players[playerNum];
};

export const isPlayerComputer = (player) => {
  return player.type === "computer";
};
