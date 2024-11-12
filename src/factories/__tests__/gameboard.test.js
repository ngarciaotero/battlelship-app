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

    test("should not place ships adjacent", () => {
      gameboard.placeShip(ship3, { x: 0, y: 0 }, "horizontal");

      const surroundingCoords = [
        { x: 3, y: 0 },
        { x: 3, y: 1 },
        { x: 2, y: 1 },
        { x: 1, y: 1 },
        { x: 0, y: 1 },
      ];

      surroundingCoords.forEach((coord) => {
        const placement = gameboard.placeShip(ship2, coord, "horizontal");
        expect(placement).toBe(false);
      });
    });

    test("should lock surrounding positions for a horizontal ship", () => {
      gameboard.placeShip(ship2, { x: 0, y: 0 }, "horizontal");

      const surroundingCoords = [
        { x: 2, y: 0 },
        { x: 2, y: 1 },
        { x: 1, y: 1 },
        { x: 0, y: 1 },
      ];

      surroundingCoords.forEach((coord) => {
        expect(gameboard.getShipAt(coord)).toBe(0);
      });
    });

    test("should lock surrounding positions for a vertical ship", () => {
      gameboard.placeShip(ship2, { x: 0, y: 0 }, "vertical");

      const surroundingCoords = [
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 0, y: 2 },
      ];

      surroundingCoords.forEach((coord) => {
        expect(gameboard.getShipAt(coord)).toBe(0);
      });
    });
  });

  describe("board state validation", () => {
    test("should initialize with empty 10x10 grid", () => {
      for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 10; y++) {
          expect(gameboard.getShipAt({ x, y })).toBeNull();
        }
      }
    });
  });
});
