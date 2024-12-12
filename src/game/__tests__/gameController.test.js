const { createGameController } = require("../gameController.js");
const { createPlayer } = require("../../factories/player.js");

jest.mock("../../factories/player.js", () => ({
  createPlayer: jest.fn().mockImplementation((type) => ({
    type,
    isPlayerObject: true,
    placedShipCount: jest.fn().mockReturnValue(5),
    isDefeated: jest.fn().mockReturnValue(false),
    resetGameboard: jest.fn(),
    gameboard: { receiveAttack: jest.fn() },
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

  describe("Get current and opponent player", () => {
    test("should return current player when game is active", () => {
      gameController.addPlayers([player1, player2]);
      gameController.initializeGame();

      expect(gameController.currentPlayer).toBe(player1);
    });

    test("should return null if no current player exists", () => {
      expect(gameController.currentPlayer).toBeNull();
    });

    test("should return opponent player when game is active", () => {
      gameController.addPlayers([player1, player2]);
      gameController.initializeGame();

      expect(gameController.opponentPlayer).toBe(player2);
    });

    test("should return null if no opponent player exists", () => {
      expect(gameController.opponentPlayer).toBeNull();
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

  describe("Reset Game", () => {
    beforeEach(() => {
      gameController.addPlayers([player1, player2]);
      gameController.initializeGame();
    });

    test("should successfully reset an in progress game", () => {
      const resetGameResult = gameController.resetGame();
      expect(resetGameResult.success).toBe(true);
      expect(gameController.gameStatus).toBe("inactive");
    });

    test("should fail to reset an already inactive game", () => {
      gameController.endGame();
      const resetGameResult = gameController.resetGame();
      expect(resetGameResult.success).toBe(false);
    });

    test("should call resetGameboard on both players", () => {
      gameController.resetGame();
      expect(player1.resetGameboard).toHaveBeenCalledTimes(1);
      expect(player2.resetGameboard).toHaveBeenCalledTimes(1);
    });
  });

  describe("Turn management", () => {
    beforeEach(() => {
      gameController.addPlayers([player1, player2]);
      gameController.initializeGame();
    });

    test("should switch turn between players", () => {
      const initialPlayer = gameController.currentPlayer;
      const switchResult = gameController.switchTurn();

      expect(switchResult.success).toBe(true);
      expect(gameController.currentPlayer).not.toBe(initialPlayer);
    });

    test("should fail to switch turn if game is not in progress", () => {
      gameController.endGame();
      expect(gameController.switchTurn().success).toBe(false);
    });
  });

  describe("Winning conditions", () => {
    beforeEach(() => {
      gameController.addPlayers([player1, player2]);
      gameController.initializeGame();
    });

    test("should return winner and loser when a player is defeated", () => {
      player1.isDefeated.mockReturnValue(true);

      const winner = gameController.determineWinner();
      expect(winner).toEqual({ winner: player2, loser: player1 });
    });

    test("should return null when no player is defeated", () => {
      const winner = gameController.determineWinner();
      expect(winner).toBeNull();
    });

    test("should return null when game is invalid", () => {
      gameController.endGame();
      const winner = gameController.determineWinner();
      expect(winner).toBeNull();
    });
  });

  describe("Move management", () => {
    let mockMove;
    let moveResult;
    beforeEach(() => {
      mockMove = { x: 1, y: 1 };
      gameController.addPlayers([player1, player2]);
      gameController.initializeGame();
    });

    test("should successfully make a hit move", () => {
      player2.gameboard.receiveAttack.mockReturnValue({ status: "hit" });
      moveResult = gameController.makeMove(mockMove);

      expect(moveResult).toEqual({ success: true, type: "hit" });
    });

    test("should successfully make a miss move", () => {
      player2.gameboard.receiveAttack.mockReturnValue({ status: "miss" });
      moveResult = gameController.makeMove(mockMove);

      expect(moveResult).toEqual({ success: true, type: "miss" });
    });

    test("should prevent moves when game is not active", () => {
      gameController.endGame();
      moveResult = gameController.makeMove(mockMove);

      expect(moveResult).toEqual({ success: false, type: "error" });
    });

    test("should prevent invalid moves", () => {
      player2.gameboard.receiveAttack.mockReturnValue({ status: "invalid" });
      moveResult = gameController.makeMove(mockMove);

      expect(moveResult).toEqual({ success: false, type: "invalid" });
    });

    test("should detect and return win condition", () => {
      player2.gameboard.receiveAttack.mockReturnValue({ status: "hit" });
      player2.isDefeated.mockReturnValue(true);

      moveResult = gameController.makeMove(mockMove);

      expect(moveResult).toEqual({
        success: true,
        type: "win",
        winner: player1,
        loser: player2,
      });
    });

    test("should prevent move on already attacked coordinate", () => {
      player2.gameboard.receiveAttack.mockReturnValue({ status: "invalid" });
      moveResult = gameController.makeMove(mockMove);

      expect(moveResult).toEqual({ success: false, type: "invalid" });
    });
  });
});
