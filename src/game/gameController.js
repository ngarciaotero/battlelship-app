import { createMoveGenerator } from "../factories/aiMoveGenerator.js";

const GAME_STATUS = Object.freeze({ ACTIVE: "active", INACTIVE: "inactive" });
const MAX_PLAYERS = 2;

export function createGameController() {
  let activePlayers = [];
  let gameStatus = GAME_STATUS.INACTIVE;
  let currentPlayerIndex = -1;
  let moveGenerator;

  function addPlayers(players) {
    if (gameStatus === GAME_STATUS.ACTIVE)
      return { success: false, error: "Cannot add players to active game." };

    if (players.length !== MAX_PLAYERS)
      return { success: false, error: "Must add exactly 2 players." };

    if (!players.every((player) => player.isPlayerObject))
      return { success: false, error: "Invalid player objects." };

    activePlayers = [...players];
    return { success: true };
  }

  function initializeGame() {
    if (gameStatus === GAME_STATUS.ACTIVE)
      return { success: false, error: "Game already in progress." };

    if (activePlayers.length < MAX_PLAYERS)
      return { success: false, error: "Not enough players to start game." };

    if (!validatePlayerBoards())
      return {
        success: false,
        error: "Players' boards not completely populated.",
      };

    for (const player of activePlayers) {
      if (player.isComputer()) {
        const opponentGameboard = activePlayers[0].gameboard;
        moveGenerator = createMoveGenerator(opponentGameboard);
      }
    }

    gameStatus = GAME_STATUS.ACTIVE;
    currentPlayerIndex = 0;
    return { success: true };
  }

  function validatePlayerBoards(requiredShipCount = 5) {
    if (!activePlayers || activePlayers.length === 0) return false;

    return activePlayers.every(
      (player) => player.placedShipCount() === requiredShipCount
    );
  }

  function getAllPlayers() {
    return activePlayers;
  }

  function getCurrentPlayer() {
    if (isValidGameState()) {
      return activePlayers[currentPlayerIndex];
    }
    return null;
  }

  function getOpponentPlayer() {
    if (isValidGameState()) {
      const opponentIndex = currentPlayerIndex === 0 ? 1 : 0;
      return activePlayers[opponentIndex];
    }
    return null;
  }

  function isValidGameState() {
    return (
      activePlayers.length === MAX_PLAYERS && gameStatus === GAME_STATUS.ACTIVE
    );
  }

  function endGame() {
    if (gameStatus === GAME_STATUS.INACTIVE) return { success: false };

    for (const player of activePlayers) {
      if (player.isComputer()) {
        moveGenerator = null;
        break;
      }
    }

    activePlayers = [];
    gameStatus = GAME_STATUS.INACTIVE;
    currentPlayerIndex = -1;

    return { success: true };
  }

  function endPreGame() {
    for (const player of activePlayers) {
      if (player.isComputer()) {
        moveGenerator = null;
        break;
      }
    }
    activePlayers = [];
    currentPlayerIndex = -1;
    return { success: true };
  }

  function resetGame() {
    if (gameStatus === GAME_STATUS.INACTIVE) return { success: false };

    activePlayers.forEach((player) => player.resetGameboard());

    gameStatus = GAME_STATUS.INACTIVE;
    currentPlayerIndex = -1;

    return { success: true };
  }

  function switchTurn() {
    if (gameStatus === GAME_STATUS.INACTIVE)
      return { success: false, error: "No game in progress." };

    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    return { success: true };
  }

  function determineWinner() {
    const currentPlayer = getCurrentPlayer();
    const opponentPlayer = getOpponentPlayer();

    if (!currentPlayer || !opponentPlayer) return null;

    if (currentPlayer.isDefeated()) {
      return { winner: opponentPlayer, loser: currentPlayer };
    } else if (opponentPlayer.isDefeated()) {
      return { winner: currentPlayer, loser: opponentPlayer };
    }

    return null;
  }

  function makeMove(move = null) {
    if (!isValidGameState()) return { success: false, type: "error" };

    const currentPlayer = getCurrentPlayer();
    if (currentPlayer.isComputer() && !move) {
      move = moveGenerator.generateMove();
    }

    const attackOutcome = performAttack(move);

    return handleMoveOutcome(attackOutcome, move);
  }

  function performAttack(move) {
    const opponentPlayer = getOpponentPlayer();

    if (!opponentPlayer) {
      throw new Error("No opponent player available");
    }

    const attackResult = opponentPlayer.gameboard.receiveAttack(move);

    return { attackResult, winnerResult: determineWinner() };
  }

  function handleMoveOutcome({ attackResult, winnerResult }, moveMade) {
    if (attackResult.status === "miss") {
      switchTurn();
      return {
        success: true,
        type: attackResult.status,
        move: moveMade,
      };
    }

    if (attackResult.status === "hit") {
      if (winnerResult) {
        return {
          success: true,
          type: "win",
          winner: winnerResult.winner,
          loser: winnerResult.loser,
          lockedPositions: attackResult.lockedPositions,
          move: moveMade,
        };
      }
      return {
        success: true,
        type: attackResult.status,
        lockedPositions: attackResult.lockedPositions,
        move: moveMade,
      };
    }
    return { success: false, type: "invalid" };
  }

  return {
    addPlayers,
    initializeGame,
    endPreGame,
    endGame,
    resetGame,
    switchTurn,
    determineWinner,
    makeMove,
    validatePlayerBoards,
    get allPlayers() {
      return getAllPlayers();
    },
    get currentPlayer() {
      return getCurrentPlayer();
    },
    get opponentPlayer() {
      return getOpponentPlayer();
    },
    get gameStatus() {
      return gameStatus;
    },
  };
}
