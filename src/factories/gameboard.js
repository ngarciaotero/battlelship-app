import { createRandomShipConfig } from "./randomShipConfig";
import { createShip } from "./ship";

const BOARD_SIZE = 10;
const AXIS = Object.freeze({ HORIZONTAL: "horizontal", VERTICAL: "vertical" });

const LOCKED_POSITION = 0;
const EMPTY_POSITION = null;
const MISSED_POSITION = -1;
const HIT_POSITION = 1;

export function createGameboard() {
  let board = createEmptyBoard();
  const missedAttacksList = [];
  let placedShips = new Set();

  function isPositionWithinBounds(position) {
    return (
      position.x >= 0 &&
      position.y >= 0 &&
      position.x < BOARD_SIZE &&
      position.y < BOARD_SIZE
    );
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
      setPositionValue(pos, ship);
    });
  }

  function lockPositions(positions) {
    positions.forEach((pos) => {
      setPositionValue(pos, LOCKED_POSITION);
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
    placedShips.add(ship);

    return true;
  }

  function getShipAt(position) {
    return board[position.x][position.y];
  }

  function receiveAttack(position) {
    if (!isValidAttackPosition(position)) return false;

    return handleAttackResult(position);
  }

  function isValidAttackPosition(position) {
    if (!isPositionWithinBounds(position)) return false;

    const currentValue = getShipAt(position);
    return currentValue !== HIT_POSITION && currentValue !== MISSED_POSITION;
  }

  function recordMissedAttack(position) {
    missedAttacksList.push({ x: position.x, y: position.y });
    setPositionValue(position, MISSED_POSITION);
  }

  function recordHit(position, ship) {
    ship.hit();
    setPositionValue(position, HIT_POSITION);
  }

  function handleAttackResult(position) {
    const targetShip = getShipAt(position);

    if (targetShip === EMPTY_POSITION || targetShip === LOCKED_POSITION) {
      recordMissedAttack(position);
    } else {
      recordHit(position, targetShip);
    }

    return true;
  }

  function getMissedAttacks() {
    return [...missedAttacksList];
  }

  function setPositionValue(position, value) {
    board[position.x][position.y] = value;
  }

  function allShipsSunk() {
    return (
      placedShips.size > 0 &&
      Array.from(placedShips).every((ship) => ship.isSunk())
    );
  }

  function getBoard() {
    return board.map((row) => [...row]);
  }

  function createEmptyBoard() {
    return Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(null));
  }

  function resetBoard() {
    board = createEmptyBoard();
    placedShips = new Set();
  }

  function populateRandomly() {
    try {
      const shipConfigs = createRandomShipConfig();
      for (const config of shipConfigs) {
        const ship = createShip(config.length);
        const placed = placeShip(ship, config.position, config.orientation);
        if (!placed) {
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error(`Failed to populate board randomly: ${error}`);
      return false;
    }
  }

  return {
    getShipAt,
    placeShip,
    receiveAttack,
    get missedAttacks() {
      return getMissedAttacks();
    },
    allShipsSunk,
    get board() {
      return getBoard();
    },
    resetBoard,
    populateRandomly,
  };
}
