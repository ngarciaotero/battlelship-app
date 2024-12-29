export const updateBoardUI = (suffix, gameboard) => {
  // clear existing ship displays
  const cells = document.querySelectorAll(`.cell-${suffix}`);
  cells.forEach((cell) => {
    cell.classList.remove("ship");
  });

  // get all placed ship entries
  gameboard.placedShips.forEach((shipData) => {
    const { shipPositions } = shipData;
    shipPositions.forEach((pos) => {
      const cell = document.querySelector(
        `.cell-${suffix}[data-x="${pos.x}"][data-y="${pos.y}"]`
      );
      if (cell) {
        cell.classList.add("ship");
      }
    });
  });
};
