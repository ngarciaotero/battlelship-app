const ATTACK_TYPE = Object.freeze({
  MISS: "missed",
  SUCCESS: "successful",
  FIRST: "first",
});
const AXIS = Object.freeze({ HORIZONTAL: "horizontal", VERTICAL: "vertical" });
const DIRECTION = Object.freeze({
  HORIZONTAL: { LEFT: "left", RIGHT: "right" },
  VERTICAL: { UP: "up", DOWN: "down" },
});

export function createMoveGenerator(gameboard) {
  let previousHit = null;
  let partiallyDamagedShips = new Map();

  function initializeShipTracking(ship) {
    const orientation = gameboard.getShipOrientation(ship);
    partiallyDamagedShips.set(ship, {
      origin: previousHit,
      orientation,
      searchDirection: initializeSearchDirection(orientation),
      searchTraverse: 0,
    });
  }

  function initializeSearchDirection(orientation) {
    return orientation === AXIS.HORIZONTAL
      ? {
          [DIRECTION.HORIZONTAL.LEFT]: false,
          [DIRECTION.HORIZONTAL.RIGHT]: false,
        }
      : { [DIRECTION.VERTICAL.UP]: false, [DIRECTION.VERTICAL.DOWN]: false };
  }

  function handlePartiallyDamagedShips() {
    if (partiallyDamagedShips.size === 0) return null;

    for (const ship of partiallyDamagedShips.entries()) {
      if (ship.isSunk()) {
        partiallyDamagedShips.delete(ship);
        continue;
      }

      const targetedMove = targetMove(ship);
      if (targetedMove) {
        previousHit = targetedMove;
        return targetedMove;
      }
    }
    return null;
  }

  function searchInDirections(
    shipData,
    directions,
    primaryAxis,
    secondaryAxis
  ) {
    const { origin, searchDirection, searchTraverse } = shipData;

    for (const { key, offset } of directions) {
      if (searchDirection[key]) continue;

      const nextMove = {
        [primaryAxis]: origin[primaryAxis] + offset * (searchTraverse + 1),
        [secondaryAxis]: origin[secondaryAxis],
      };

      if (isValidMove(nextMove)) {
        shipData.searchTraverse += 1;
        return nextMove;
      }

      searchDirection[key] = true;
      if (offset === -1) shipData.searchTraverse = 0;
    }

    return null;
  }

  function handleHorizontalSearch(shipData) {
    const directions = [
      { key: DIRECTION.HORIZONTAL.LEFT, offset: -1 },
      { key: DIRECTION.HORIZONTAL.RIGHT, offset: 1 },
    ];

    return searchInDirections(shipData, directions, "x", "y");
  }

  function handleVerticalSearch(shipData) {
    const directions = [
      { key: DIRECTION.VERTICAL.UP, offset: -1 },
      { key: DIRECTION.VERTICAL.DOWN, offset: 1 },
    ];

    return searchInDirections(shipData, directions, "y", "x");
  }

  function isSearchExhausted(shipData) {
    const { orientation, searchDirection } = shipData;
    return orientation === AXIS.HORIZONTAL
      ? searchDirection[DIRECTION.HORIZONTAL.LEFT] &&
          searchDirection[DIRECTION.HORIZONTAL.RIGHT]
      : searchDirection[DIRECTION.VERTICAL.UP] &&
          searchDirection[DIRECTION.VERTICAL.DOWN];
  }

  function targetMove(ship) {
    const shipData = partiallyDamagedShips.get(ship);
    if (!shipData) return null;

    const { orientation } = shipData;

    if (isSearchExhausted(shipData)) {
      partiallyDamagedShips.delete(ship);
      return null;
    }

    return orientation === AXIS.HORIZONTAL
      ? handleHorizontalSearch(shipData)
      : handleVerticalSearch(shipData);
  }

  function smartRandomMove() {
    const availableMoves = gameboard.getAllAvailablePositions();
    const checkerboardMoves = availableMoves.filter(
      (move) => (move.x + move.y) % 2 === 0
    );

    const moves =
      checkerboardMoves.length > 0 ? checkerboardMoves : availableMoves;
    const move = moves[Math.floor(Math.random() * moves.length)];
    previousHit = move;
    return move;
  }

  function isValidMove(move) {
    return gameboard
      .getAllAvailablePositions()
      .some((pos) => pos.x === move.x && pos.y === move.y);
  }

  function getAttackResult() {
    if (previousHit === null) return ATTACK_TYPE.FIRST;

    const isMatch = (hit) => hit.x === previousHit.x && hit.y === previousHit.y;

    if (gameboard.successfulAttacks.some(isMatch)) {
      return ATTACK_TYPE.SUCCESS;
    }

    if (gameboard.missedAttacks.some(isMatch)) {
      return ATTACK_TYPE.MISS;
    }

    return ATTACK_TYPE.FIRST;
  }

  function generateMove() {
    const attackStatus = getAttackResult();

    if (attackStatus === ATTACK_TYPE.FIRST) {
      return smartRandomMove();
    }

    if (attackStatus === ATTACK_TYPE.SUCCESS) {
      const hitShip = gameboard.getShipAt(previousHit);

      if (hitShip.isSunk()) {
        partiallyDamagedShips.delete(hitShip);
        return smartRandomMove();
      }

      if (!partiallyDamagedShips.has(hitShip)) {
        initializeShipTracking(hitShip);
      }

      const targetedMove = targetMove(hitShip);
      if (targetedMove) {
        previousHit = targetedMove;
        return targetedMove;
      }
    }

    return handlePartiallyDamagedShips() || smartRandomMove();
  }

  return { generateMove };
}
