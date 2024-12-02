const { createGameController } = require("../gameController.js");
const { createPlayer } = require("../../factories/player.js");

jest.mock("../../factories/player.js", () => ({
  createPlayer: jest.fn().mockImplementation((type) => ({
    type,
    isPlayerObject: true,
    placedShipCount: jest.fn().mockReturnValue(5),
    isDefeated: jest.fn().mockReturnValue(false),
    resetGameboard: jest.fn(),
  })),
}));

describe("Game Controller", () => {
  let gameController;
  let player1;
  let player2;

  beforeEach(() => {
    jest.clearAllMocks();
    player1 = createPlayer("real");
    player2 = createPlayer("computer");
    gameController = createGameController();
  });

  describe("Add Players", () => {
    test("should successfully add two valid player objects", () => {
      expect(gameController.addPlayers([player1, player2]).success).toBe(true);
    });

    test("should fail if two new players are added to an in progress game", () => {
      gameController.addPlayers([player1, player2]);
      gameController.initializeGame();

      const secondPlayerAdd = gameController.addPlayers([
        createPlayer("real"),
        createPlayer("real"),
      ]);

      expect(secondPlayerAdd.success).toBe(false);
    });

    test("should fail if not exactly two players are added", () => {
      expect(gameController.addPlayers([player1]).success).toBe(false);
    });

    test("should fail if invalid player objects are provided", () => {
      const invalidPlayer = { type: false };
      expect(gameController.addPlayers([player1, invalidPlayer]).success).toBe(
        false
      );
    });
  });

  describe("Game initialization", () => {
    test("should successfully initialize game with two players", () => {
      gameController.addPlayers([player1, player2]);

      const gameInitialization = gameController.initializeGame();
      expect(gameInitialization.success).toBe(true);
    });

    test("should fail to initialize game if not enough players", () => {
      const gameInitialization = gameController.initializeGame();
      expect(gameInitialization.success).toBe(false);
    });

    test("should fail to initialize game if player boards are not fully populated", () => {
      player1.placedShipCount.mockReturnValue(0);

      gameController.addPlayers([player1, player2]);
      const gameInitialization = gameController.initializeGame();
      expect(gameInitialization.success).toBe(false);
    });

    test("should fail to initialize a in progress game", () => {
      gameController.addPlayers([player1, player2]);
      gameController.initializeGame();

      const secondInitialization = gameController.initializeGame();
      expect(secondInitialization.success).toBe(false);
    });
  });

  describe("Get current player", () => {
    test("should return current player when game is active", () => {
      gameController.addPlayers([player1, player2]);
      gameController.initializeGame();

      expect(gameController.currentPlayer).toBe(player1);
    });

    test("should return null when game is not active", () => {
      expect(gameController.currentPlayer).toBeNull();
    });
  });

  describe("End game", () => {
    beforeEach(() => {
      gameController.addPlayers([player1, player2]);
      gameController.initializeGame();
    });

    test("should successfully end an in progress game", () => {
      const endGameResult = gameController.endGame();
      expect(endGameResult.success).toBe(true);
      expect(gameController.gameStatus).toBe("inactive");
    });

    test("should fail to end a game not in progress", () => {
      gameController.endGame();
      const endGameAgain = gameController.endGame();
      expect(endGameAgain.success).toBe(false);
    });
  });
});
