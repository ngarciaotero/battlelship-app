const { createShip } = require("../ship.js");

describe("Ship", () => {
  let testShip;

  beforeEach(() => {
    testShip = createShip(4);
  });

  describe("ship creation", () => {
    test("should create a ship with the specified length", () => {
      expect(testShip.length).toBe(4);
    });

    test("should initialize with 0 hits", () => {
      expect(testShip.hits).toBe(0);
    });

    test("should not be sunk when created", () => {
      expect(testShip.isSunk()).toBe(false);
    });
  });

  describe("hit()", () => {
    test("should increment hit count by 1 when hit() is called", () => {
      testShip.hit();
      expect(testShip.hits).toBe(1);

      testShip.hit();
      expect(testShip.hits).toBe(2);
    });
  });

  describe("isSunk()", () => {
    test("should return false when hits are less than length", () => {
      testShip.hit();
      testShip.hit();
      expect(testShip.isSunk()).toBe(false);
    });
    test("should return true when hits equal length", () => {
      testShip.hit();
      testShip.hit();
      testShip.hit();
      testShip.hit();
      expect(testShip.isSunk()).toBe(true);
    });
  });
});
