const BOARD_SIZE = 10;
const AXIS = Object.freeze({ HORIZONTAL: "horizontal", VERTICAL: "vertical" });

const LOCKED_POSITION = 0;
const EMPTY_POSITION = null;

export function createGameboard() {
  const board = Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));

  function isPositionWithinBounds({ x, y }) {
    return x >= 0 && y >= 0 && x < BOARD_SIZE && y < BOARD_SIZE;
  }

  function isShipInBounds(startPos, shipLength, orientation) {
    const endPos =
      orientation === AXIS.HORIZONTAL
        ? startPos.x + shipLength
        : startPos.y + shipLength;

    return endPos < BOARD_SIZE;
  }

  function getShipPositions(startPos, shipLength, orientation) {
    const positions = [];

    for (let i = 0; i < shipLength; i++) {
      positions.push({
        x: orientation === AXIS.HORIZONTAL ? startPos.x + i : startPos.x,
        y: orientation === AXIS.HORIZONTAL ? startPos.y : startPos.y + i,
      });
    }

    return positions;
  }

  function getSurroundingPositions(
    startPos,
    shipLength,
    orientation,
    shipPositions
  ) {
    const bounds = {
      minX: startPos.x - 1,
      minY: startPos.y - 1,
      maxX:
        orientation === AXIS.HORIZONTAL
          ? startPos.x + shipLength
          : startPos.x + 1,
      maxY:
        orientation === AXIS.HORIZONTAL
          ? startPos.y + 1
          : startPos.y + shipLength,
    };

    const positions = [];

    for (let x = bounds.minX; x <= bounds.maxX; x++) {
      for (let y = bounds.minY; y <= bounds.maxY; y++) {
        const currentPos = { x, y };
        if (
          isPositionWithinBounds(currentPos) &&
          !shipPositions.some((pos) => isSamePosition(pos, currentPos))
        ) {
          positions.push(currentPos);
        }
      }
    }

    return positions;
  }

  function isSamePosition(position1, position2) {
    return position1.x === position2.x && position1.y === position2.y;
  }

  function arePositionsEmpty(positions) {
    return positions.every(
      (pos) =>
        isPositionWithinBounds(pos) && board[pos.x][pos.y] === EMPTY_POSITION
    );
  }

  function placeShipAtPositions(positions, ship) {
    positions.forEach((pos) => {
      board[pos.x][pos.y] = ship;
    });
  }

  function lockPositions(positions) {
    positions.forEach((pos) => {
      board[pos.x][pos.y] = LOCKED_POSITION;
    });
  }

  function placeShip(ship, startPos, orientation) {
    if (
      !isPositionWithinBounds(startPos) ||
      !isShipInBounds(startPos, ship.length, orientation)
    )
      return false;

    const shipPositions = getShipPositions(startPos, ship.length, orientation);
    if (!arePositionsEmpty(shipPositions)) return false;

    const surroundingPositions = getSurroundingPositions(
      startPos,
      ship.length,
      orientation,
      shipPositions
    );

    placeShipAtPositions(shipPositions, ship);
    lockPositions(surroundingPositions);

    return true;
  }

  function getShipAt(position) {
    return board[position.x][position.y];
  }

  return { getShipAt, placeShip };
}
