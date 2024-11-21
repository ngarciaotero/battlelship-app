const { createGameboard } = require("../gameboard.js");
const { createPlayer } = require("../player.js");

jest.mock("../gameboard.js", () => ({
  createGameboard: jest.fn(() => ({
    board: Array(10).fill(null),
  })),
}));

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

  describe("gameboard initialization", () => {
    let emptyGameboard;

    beforeEach(() => {
      emptyGameboard = createGameboard();
      jest.clearAllMocks();
    });

    describe("real player", () => {
      test("should have an empty gameboard on initialization", () => {
        expect(realPlayer.gameboard.board).toEqual(emptyGameboard.board);
        expect(createGameboard).toHaveBeenCalledTimes(1);
      });
    });

    describe("computer player", () => {
      test("should have pre-populated gameboard on initialization", () => {
        const computerBoard = computerPlayer.gameboard.board;
        expect(computerBoard).not.toEqual(emptyGameboard.board);
      });
    });
  });
});
