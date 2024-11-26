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
      expect(attack).toBe(true);
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

      expect(repeatAttack).toBe(false);
    });

    test("should reject attacks outside board boundaries", () => {
      expect(gameboard.receiveAttack({ x: -1, y: 0 })).toBe(false);
      expect(gameboard.receiveAttack({ x: 11, y: 0 })).toBe(false);
      expect(gameboard.receiveAttack({ x: 0, y: -11 })).toBe(false);
      expect(gameboard.receiveAttack({ x: 0, y: 11 })).toBe(false);
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
});
