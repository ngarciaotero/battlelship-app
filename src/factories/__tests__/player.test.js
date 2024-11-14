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

    test("should create unique player instances", () => {
      const realPlayer2 = createPlayer("real");
      expect(realPlayer).not.toBe(realPlayer2);
    });
  });
});
