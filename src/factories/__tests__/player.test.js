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
    });

    test("should create a computer player type", () => {
      expect(computerPlayer.type).toBe("computer");
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
});
