const GAME_STATUS = Object.freeze({ ACTIVE: "active", INACTIVE: "inactive" });
const MAX_PLAYERS = 2;

export function createGameController() {
  let activePlayers = [];
  let gameStatus = GAME_STATUS.INACTIVE;
  let currentPlayerIndex = -1;

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

    gameStatus = GAME_STATUS.ACTIVE;
    currentPlayerIndex = 0;
    return { success: true };
  }

  function validatePlayerBoards(requiredShipCount = 5) {
    return activePlayers.every(
      (player) => player.placedShipCount() === requiredShipCount
    );
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

    activePlayers = [];
    gameStatus = GAME_STATUS.INACTIVE;
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

  function determineCurrentWinner() {

    const opponentPlayer = getOpponentPlayer();
    if (!opponentPlayer) return null;

    return opponentPlayer.isDefeated()
      ? { winner: getCurrentPlayer(), loser: opponentPlayer }
      : null;
  }

  return {
    addPlayers,
    initializeGame,
    endGame,
    resetGame,
    switchTurn,
    determineCurrentWinner,
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
