const { createPlayer } = require("../player.js");

describe("Player", () => {
  let realPlayer;
  let computerPlayer;

  beforeEach(() => {
    realPlayer = createPlayer("real");
    computerPlayer = createPlayer("computer");
  });

  describe("Initialize Player", () => {
    test("should create a real player", () => {
      expect(realPlayer.type).toBe("real");
    });

    test("should create a computer player", () => {
      expect(computerPlayer.type).toBe("computer");
    });
  });

  describe("Player Gameboard", () => {
    test("each player has its own gameboard", () => {
      expect(realPlayer.gameboard).toBeDefined();
    });

    test("each player has a unique gameboard instance", () => {
      expect(realPlayer.gameboard).not.toBe(computerPlayer.gameboard);
    });
  });
});
