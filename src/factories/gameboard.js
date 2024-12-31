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
  let missedAttacksList = [];
  let successfulAttacksList = [];
  let placedShips = new Map();

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

  function placeShipAtPositions(positions, ship) {
    positions.forEach((pos) => {
      setPositionValue(pos, ship);
    });
  }

  function lockPositions(positions) {
    const lockedPositions = positions.filter(
      (pos) => getShipAt(pos) === EMPTY_POSITION
    );
    lockedPositions.forEach((pos) => setPositionValue(pos, LOCKED_POSITION));
    return lockedPositions;
  }

  function validateShipPlacement(startPos, ship, orientation) {
    if (
      !isPositionWithinBounds(startPos) ||
      !isShipInBounds(startPos, ship.length, orientation)
    )
      return false;
    return true;
  }

  function shipOverlapExists(shipPositions) {
    for (const shipData of placedShips.values()) {
      const conflictingShipPositions = [
        ...shipData.shipPositions,
        ...shipData.surroundingPositions,
      ];

      const hasOverlap = shipPositions.some((newPos) =>
        conflictingShipPositions.some((existingPos) =>
          isSamePosition(newPos, existingPos)
        )
      );

      if (hasOverlap) return true;
    }
    return false;
  }

  function placeShip(ship, startPos, orientation) {
    if (!validateShipPlacement(startPos, ship, orientation)) return false;

    const shipPositions = getShipPositions(startPos, ship.length, orientation);

    if (shipOverlapExists(shipPositions)) return false;

    placeShipAtPositions(shipPositions, ship);

    placedShips.set(ship, {
      shipPositions,
      shipOrientation: orientation,
      surroundingPositions: getSurroundingPositions(
        startPos,
        ship.length,
        orientation,
        shipPositions
      ),
    });

    return true;
  }

  function getShipAt(position) {
    return board[position.x][position.y];
  }

  function receiveAttack(position) {
    if (!isPositionWithinBounds(position)) return { status: "invalid" };

    return handleAttackResult(position);
  }

  function recordMissedAttack(position) {
    missedAttacksList.push(position);
    setPositionValue(position, MISSED_POSITION);
  }

  function recordHit(position, ship) {
    successfulAttacksList.push(position);
    ship.hit();
    setPositionValue(position, HIT_POSITION);
  }

  function markSunkShipSurroundings(ship) {
    const shipData = placedShips.get(ship);
    if (!shipData || !ship.isSunk()) return [];
    return lockPositions(shipData.surroundingPositions);
  }

  function handleAttackResult(position) {
    const currentValue = getShipAt(position);

    if (
      currentValue === HIT_POSITION ||
      currentValue === MISSED_POSITION ||
      currentValue === LOCKED_POSITION
    ) {
      return { status: "invalid" };
    } else if (currentValue === EMPTY_POSITION) {
      recordMissedAttack(position);
      return { status: "miss" };
    }

    const ship = currentValue;
    recordHit(position, ship);

    const lockedList = markSunkShipSurroundings(ship);
    
    return { status: "hit", lockedPositions: lockedList };
  }

  function getMissedAttacks() {
    return [...missedAttacksList];
  }

  function getSuccessfulAttacks() {
    return [...successfulAttacksList];
  }

  function setPositionValue(position, value) {
    board[position.x][position.y] = value;
  }

  function allShipsSunk() {
    return (
      placedShips.size > 0 &&
      Array.from(placedShips.keys()).every((ship) => ship.isSunk())
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
    placedShips = new Map();
  }

  function resetGameboard() {
    board = createEmptyBoard();
    missedAttacksList = [];
    successfulAttacksList = [];
    placedShips = new Map();
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

  function getPlacedShips() {
    return placedShips;
  }

  function getShipOrientation(ship) {
    const shipData = placedShips.get(ship);
    if (!shipData) return null;

    return shipData.shipOrientation;
  }

  function getAllAvailablePositions() {
    const availablePositions = [];
    board.forEach((row, x) => {
      row.forEach((cell, y) => {
        if (typeof cell === "object") {
          availablePositions.push({ x, y });
        }
      });
    });
    return availablePositions;
  }

  return {
    getShipAt,
    placeShip,
    receiveAttack,
    allShipsSunk,
    resetBoard,
    populateRandomly,
    resetGameboard,
    getShipOrientation,
    getAllAvailablePositions,
    get missedAttacks() {
      return getMissedAttacks();
    },
    get successfulAttacks() {
      return getSuccessfulAttacks();
    },
    get board() {
      return getBoard();
    },
    get placedShips() {
      return getPlacedShips();
    },
  };
}
