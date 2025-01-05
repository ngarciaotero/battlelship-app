const DIRECTIONS = {
  HORIZONTAL: [
    { dx: 1, dy: 0, name: "right" },
    { dx: -1, dy: 0, name: "left" },
  ],
  VERTICAL: [
    { dx: 0, dy: 1, name: "down" },
    { dx: 0, dy: -1, name: "up" },
  ],
};

const ORIENTATION = {
  HORIZONTAL: "horizontal",
};

// create a new position
const createPosition = (x, y) => ({ x, y });

// position validity helper functions
const isPositionEqual = (pos1, pos2) => pos1.x === pos2.x && pos1.y === pos2.y;

const calculateNewPosition = (position, direction) =>
  createPosition(position.x + direction.dx, position.y + direction.dy);

// create a new node
const createNode = (position, direction = null, parent = null) => ({
  position,
  direction,
  parent,
  children: [],
  tried: false,
});

export function createMoveGenerator(gameboard) {
  // state management
  const state = {
    previousMove: null,
    currentShip: null,
    searchTree: null,
    currentNode: null,
  };

  // ship/position status helper functions
  const isValidPosition = (position) =>
    gameboard
      .getAllAvailablePositions()
      .some((pos) => isPositionEqual(pos, position));

  const getShipOrientation = (ship) => {
    const shipData = gameboard.placedShips.get(ship);
    return shipData?.shipOrientation;
  };

  const getDirectionsForShip = (ship) =>
    getShipOrientation(ship) === ORIENTATION.HORIZONTAL
      ? DIRECTIONS.HORIZONTAL
      : DIRECTIONS.VERTICAL;

  return { generateMove };
}
