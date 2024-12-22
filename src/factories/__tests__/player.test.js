const { createPlayer } = require("../player.js");

describe("Player", () => {
  let realPlayer;
  let computerPlayer;

  beforeEach(() => {
    realPlayer = createPlayer("real");
    computerPlayer = createPlayer("computer");
  });

  describe("player type initialization", () => {
    test("should create a real player type", () => {
      expect(realPlayer.type).toBe("real");
      expect(realPlayer.isComputer()).toBe(false);
    });

    test("should create a computer player type", () => {
      expect(computerPlayer.type).toBe("computer");
      expect(computerPlayer.isComputer()).toBe(true);
    });

    test("should throw error if type is not 'real' or 'computer'", () => {
      expect(() => createPlayer("invalidComputer")).toThrow();
    });
  });

  describe("gameboard interaction", () => {
    test("should have a gameboard property", () => {
      expect(realPlayer.gameboard).toBeDefined();
      expect(computerPlayer.gameboard).toBeDefined();
    });

    test("real player gameboard should be accessible", () => {
      expect(realPlayer.gameboard).toBeTruthy();
    });

    test("computer player gameboard should be accessible", () => {
      expect(computerPlayer.gameboard).toBeTruthy();
    });
  });

  describe("player immutability", () => {
    test("type property should be real-only", () => {
      const originalType = realPlayer.type;

      expect(() => {
        realPlayer.type = "computer";
      }).toThrow();

      expect(realPlayer.type).toBe(originalType);
    });
  });

  describe("reset ship configuration", () => {
    test("should successfully reset ship configuration", () => {
      const result = realPlayer.resetShipConfig();
      expect(result).toBe(true);
    });

    test("should provide a way to reset configuration for real player", () => {
      expect(typeof realPlayer.resetShipConfig).toBe("function");
    });
  });
});
