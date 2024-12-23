const { createGameboard } = require("../gameboard.js");
const { createShip } = require("../ship.js");

describe("Gameboard", () => {
  let gameboard;
  let ship2;
  let ship3;

  beforeEach(() => {
    ship2 = createShip(2);
    ship3 = createShip(3);
    gameboard = createGameboard();
  });

  describe("ship placement", () => {
    test("should place ship at specific coordinates horizontally", () => {
      const placement = gameboard.placeShip(
        ship3,
        { x: 0, y: 0 },
        "horizontal"
      );

      const shipCoords = [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
      ];

      expect(placement).toBe(true);
      shipCoords.forEach((coord) => {
        expect(gameboard.getShipAt(coord)).toBe(ship3);
      });
    });

    test("should place ship at specific coordinates vertically", () => {
      const placement = gameboard.placeShip(ship3, { x: 0, y: 0 }, "vertical");

      const shipCoords = [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: 2 },
      ];

      expect(placement).toBe(true);
      shipCoords.forEach((coord) => {
        expect(gameboard.getShipAt(coord)).toBe(ship3);
      });
    });

    test("should not place ship outside board boundaries horizontally", () => {
      const placement = gameboard.placeShip(
        ship3,
        { x: 9, y: 0 },
        "horizontal"
      );

      expect(placement).toBe(false);
    });

    test("should not place ship outside board boundaries vertically", () => {
      const placement = gameboard.placeShip(ship3, { x: 0, y: 9 }, "vertical");

      expect(placement).toBe(false);
    });

    test("should not place overlapping ships", () => {
      gameboard.placeShip(ship3, { x: 0, y: 0 }, "horizontal");
      const placement = gameboard.placeShip(ship2, { x: 1, y: 0 }, "vertical");

      expect(placement).toBe(false);
    });
  });

  describe("receive attack", () => {
    beforeEach(() => {
      gameboard.placeShip(ship3, { x: 0, y: 0 }, "horizontal");
    });

    test("should record a hit on a ship", () => {
      const attack = gameboard.receiveAttack({ x: 0, y: 0 });
      expect(attack.status).toBe("hit");
    });

    test("should record a missed attack and track its coordinates", () => {
      gameboard.receiveAttack({ x: 0, y: 1 });
      gameboard.receiveAttack({ x: 0, y: 2 });

      const missedAttacks = gameboard.missedAttacks;

      expect(missedAttacks).toContainEqual({ x: 0, y: 1 });
      expect(missedAttacks).toContainEqual({ x: 0, y: 2 });
    });

    test("should not allow repeated attacks on the same coordinate", () => {
      gameboard.receiveAttack({ x: 0, y: 0 });
      const repeatAttack = gameboard.receiveAttack({ x: 0, y: 0 });

      expect(repeatAttack.status).toBe("invalid");
    });

    test("should reject attacks outside board boundaries", () => {
      expect(gameboard.receiveAttack({ x: -1, y: 0 }).status).toBe("invalid");
      expect(gameboard.receiveAttack({ x: 11, y: 0 }).status).toBe("invalid");
      expect(gameboard.receiveAttack({ x: 0, y: -11 }).status).toBe("invalid");
      expect(gameboard.receiveAttack({ x: 0, y: 11 }).status).toBe("invalid");
    });
  });

  describe("game sunk status", () => {
    beforeEach(() => {
      gameboard.placeShip(ship3, { x: 0, y: 0 }, "horizontal");
      gameboard.placeShip(ship2, { x: 0, y: 2 }, "vertical");
    });

    test("should report false when ships are not all sunk", () => {
      const attacks = [
        { x: 0, y: 0 },
        { x: 0, y: 2 },
        { x: 0, y: 3 },
      ];

      attacks.forEach((coord) => {
        gameboard.receiveAttack(coord);
      });

      expect(gameboard.allShipsSunk()).toBe(false);
    });

    test("should report true when all ships are sunk", () => {
      const attacks = [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 0, y: 2 },
        { x: 0, y: 3 },
      ];

      attacks.forEach((coord) => {
        gameboard.receiveAttack(coord);
      });

      expect(gameboard.allShipsSunk()).toBe(true);
    });
  });

  describe("board initialization", () => {
    test("should initialize as 10x10 array", () => {
      expect(Array.isArray(gameboard.board)).toBe(true);
      expect(gameboard.board.length).toBe(10);
      gameboard.board.forEach((row) => {
        expect(Array.isArray(row)).toBe(true);
        expect(row.length).toBe(10);
      });
    });
  });

  describe("board reset and population", () => {
    test("should reset board to empty state", () => {
      gameboard.placeShip(ship3, { x: 0, y: 0 }, "horizontal");
      gameboard.resetBoard();

      const board = gameboard.board;
      board.forEach((row) => {
        row.forEach((cell) => {
          expect(cell).toBeNull;
        });
      });
    });

    test("should populate board randomly", () => {
      const populated = gameboard.populateRandomly();
      expect(populated).toBe(true);
      const board = gameboard.board;
      let shipCount = 0;

      board.forEach((row) => {
        row.forEach((cell) => {
          if (cell !== null && cell !== 0) {
            shipCount++;
          }
        });
      });

      expect(shipCount).toBeGreaterThan(0);
    });
  });

  describe("reset gameboard", () => {
    test("should reset board and clear missed attacks", () => {
      gameboard.placeShip(ship3, { x: 0, y: 0 }, "horizontal");
      gameboard.receiveAttack({ x: 0, y: 1 });
      gameboard.receiveAttack({ x: 0, y: 2 });

      gameboard.resetGameboard();

      const board = gameboard.board;
      board.forEach((row) => {
        row.forEach((cell) => {
          expect(cell).toBeNull();
        });
      });

      expect(gameboard.missedAttacks.length).toBe(0);
    });
  });

  describe("placed ships status", () => {
    test("should return placed ships", () => {
      gameboard.placeShip(ship3, { x: 0, y: 0 }, "horizontal");
      gameboard.placeShip(ship2, { x: 0, y: 2 }, "vertical");

      const placedShips = gameboard.placedShips;
      expect(placedShips.size).toBe(2);
      expect(Array.from(placedShips.keys())).toContain(ship3);
      expect(Array.from(placedShips.keys())).toContain(ship2);
    });
  });

  describe("ship surrounding lock", () => {
    let lockedPositions;
    beforeEach(() => {
      gameboard.placeShip(ship2, { x: 0, y: 0 }, "horizontal");
      lockedPositions = [
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 2, y: 0 },
      ];
    });

    test("should lock surrounding empty positions when a ship is sunk", () => {
      gameboard.receiveAttack({ x: 0, y: 0 });
      gameboard.receiveAttack({ x: 1, y: 1 });
      gameboard.receiveAttack({ x: 1, y: 0 });

      expect(ship2.isSunk()).toBe(true);

      lockedPositions.forEach((pos) => {
        if (pos.x === 1 && pos.y === 1) {
          expect(gameboard.getShipAt(pos)).toBe(-1);
        } else {
          expect(gameboard.getShipAt(pos)).toBe(0);
        }
      });
    });

    test("should not lock surrounding positions if the ship is not sunk", () => {
      gameboard.receiveAttack({ x: 0, y: 0 });

      expect(ship3.isSunk()).toBe(false);

      lockedPositions.forEach((pos) => {
        expect(gameboard.getShipAt(pos)).toBeNull();
      });
    });
  });

  describe("successful attacks tracking", () => {
    beforeEach(() => {
      gameboard.resetGameboard();
      gameboard.placeShip(ship3, { x: 0, y: 0 }, "horizontal");
    });

    test("should record successful attacks", () => {
      gameboard.receiveAttack({ x: 0, y: 0 });
      gameboard.receiveAttack({ x: 1, y: 0 });

      const successfulAttacks = gameboard.successfulAttacks;
      expect(successfulAttacks).toHaveLength(2);
      expect(successfulAttacks).toContainEqual({ x: 0, y: 0 });
      expect(successfulAttacks).toContainEqual({ x: 1, y: 0 });
    });

    test("should not include missed attacks in successful attacks list", () => {
      gameboard.receiveAttack({ x: 0, y: 0 });
      gameboard.receiveAttack({ x: 5, y: 5 });

      const successfulAttacks = gameboard.successfulAttacks;
      expect(successfulAttacks).toHaveLength(1);
      expect(successfulAttacks).toContainEqual({ x: 0, y: 0 });
      expect(successfulAttacks).not.toContainEqual({ x: 5, y: 5 });
    });

    test("should return a copy of successful attacks array", () => {
      gameboard.receiveAttack({ x: 0, y: 0 });
      const successfulAttacks1 = gameboard.successfulAttacks;
      const successfulAttacks2 = gameboard.successfulAttacks;

      expect(successfulAttacks1).not.toBe(successfulAttacks2);
      expect(successfulAttacks1).toEqual(successfulAttacks2);
    });

    test("should clear successful attacks when board is reset", () => {
      gameboard.receiveAttack({ x: 0, y: 0 });
      gameboard.resetGameboard();

      expect(gameboard.successfulAttacks).toHaveLength(0);
    });
  });

  describe("ship orientation retrieval", () => {
    beforeEach(() => {
      gameboard.resetGameboard();
    });

    test("should return horizontal orientation for horizontally placed ship", () => {
      gameboard.placeShip(ship3, { x: 0, y: 0 }, "horizontal");
      expect(gameboard.getShipOrientation(ship3)).toBe("horizontal");
    });

    test("should return vertical orientation for vertically placed ship", () => {
      gameboard.placeShip(ship3, { x: 0, y: 0 }, "vertical");
      expect(gameboard.getShipOrientation(ship3)).toBe("vertical");
    });

    test("should return null for ship that hasn't been placed", () => {
      const unplacedShip = createShip(2);
      expect(gameboard.getShipOrientation(unplacedShip)).toBeNull();
    });
  });
});
