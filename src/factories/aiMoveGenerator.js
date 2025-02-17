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

  // tree operations
  const createSearchTree = (hitPosition) => {
    const newTree = createNode(hitPosition);
    const directions = getDirectionsForShip(state.currentShip);

    directions.forEach((dir) => {
      const newPos = calculateNewPosition(hitPosition, dir);
      if (isValidPosition(newPos)) {
        const childNode = createNode(newPos, dir.name, newTree);
        newTree.children.push(childNode);
      }
    });

    state.searchTree = newTree;
    state.currentNode = newTree;
    return newTree;
  };

  const findUntried = (node) => {
    if (!node.tried && isValidPosition(node.position)) {
      return node;
    }

    return node.children.reduce(
      (found, child) => found || findUntried(child),
      null
    );
  };

  const expandSearchPath = () => {
    const directions = getDirectionsForShip(state.currentShip);
    const direction = directions.find(
      (d) => d.name === state.currentNode.direction
    );

    if (!direction) return null;

    const newPos = calculateNewPosition(state.currentNode.position, direction);

    if (!isValidPosition(newPos)) return null;

    const newNode = createNode(
      newPos,
      state.currentNode.direction,
      state.currentNode
    );
    state.currentNode.tried = true;
    state.currentNode.children.push(newNode);
    state.currentNode = newNode;
    state.previousMove = newPos;

    return newNode;
  };

  // state checks
  const lastMoveWasHit = () =>
    state.previousMove &&
    gameboard.successfulAttacks.some((pos) =>
      isPositionEqual(pos, state.previousMove)
    );

  const getLastHitPosition = () =>
    gameboard.successfulAttacks[gameboard.successfulAttacks.length - 1];

  const storeMoveIfShip = (move) => {
    const currentValue = gameboard.getShipAt(move);
    if (typeof currentValue === "object" && currentValue !== null) {
      state.currentShip = currentValue;
    }
  };

  // move generation
  const smartRandomMove = () => {
    const availableMoves = gameboard.getAllAvailablePositions();
    const checkerboardMoves = availableMoves.filter(
      (move) => (move.x + move.y) % 2 === 0
    );

    const moves =
      checkerboardMoves.length > 0 ? checkerboardMoves : availableMoves;
    const move = moves[Math.floor(Math.random() * moves.length)];

    storeMoveIfShip(move);
    state.previousMove = move;
    return move;
  };

  const getNextSearchMove = () => {
    const untried = findUntried(state.searchTree);
    if (!untried) return null;

    state.currentNode.tried = true;
    state.currentNode = untried;
    state.previousMove = untried.position;
    return untried.position;
  };

  // main move generation orchestrator
  const generateMove = () => {
    if (state.currentShip?.isSunk()) {
      state.currentShip = null;
      state.searchTree = null;
      state.currentNode = null;
    } else if (lastMoveWasHit() && !state.searchTree) {
      createSearchTree(getLastHitPosition());
      return getNextSearchMove() || smartRandomMove();
    }

    if (state.searchTree) {
      if (lastMoveWasHit()) {
        const expandedMove = expandSearchPath();
        if (expandedMove) {
          return expandedMove.position;
        }
      }
      return getNextSearchMove() || smartRandomMove();
    }

    return smartRandomMove();
  };

  return { generateMove };
}
