const MAX_SHIP_COUNT = 5;

export const updatePassButtonUI = (player) => {
  const passButton = document.querySelector(".pass-btn");

  if (passButton) {
    passButton.disabled = !canPassScreen(player);
  }
};

const canPassScreen = (player) => {
  return player.placedShipCount() === MAX_SHIP_COUNT;
};
