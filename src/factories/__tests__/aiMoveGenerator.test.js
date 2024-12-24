const { createMoveGenerator } = require("../aiMoveGenerator.js");

describe("Move Generator", () => {
  let moveGenerator;
  let gameboard;
  let ship;

  beforeEach(() => {
    ship = {
      isSunk: jest.fn().mockReturnValue(false),
      length: 3,
    };

    gameboard = {
      getShipAt: jest.fn().mockReturnValue(ship),
      getShipOrientation: jest.fn().mockReturnValue("horizontal"),
      getAllAvailablePositions: jest.fn().mockReturnValue([
        { x: 4, y: 5 },
        { x: 6, y: 5 },
        { x: 5, y: 4 },
        { x: 5, y: 6 },
      ]),
      missedAttacks: [],
      successfulAttacks: [],
    };

    moveGenerator = createMoveGenerator(gameboard);
  });

  test("should return a random move on first turn", () => {
    const move = moveGenerator.generateMove();
    expect(move).toBeDefined();
    expect(move).toHaveProperty("x");
    expect(move).toHaveProperty("y");
  });

  test("should target adjacent positions after a successful hit", () => {
    moveGenerator.generateMove();
    gameboard.successfulAttacks.push({ x: 5, y: 5 });

    const targetingMove = moveGenerator.generateMove();

    const validMoves = [
      { x: 4, y: 5 },
      { x: 6, y: 5 },
      { x: 5, y: 4 },
      { x: 5, y: 6 },
    ];

    expect(validMoves).toContainEqual(targetingMove);
  });

  test("should switch targeting direction when hitting an edge or invalid move", () => {
    gameboard.successfulAttacks.push({ x: 0, y: 5 });
    gameboard.getAllAvailablePositions.mockReturnValue([{ x: 1, y: 5 }]);

    const move = moveGenerator.generateMove();

    expect(move).toEqual({ x: 1, y: 5 });
  });

  test("should handle sunk ships properly", () => {
    moveGenerator.generateMove();
    gameboard.successfulAttacks.push({ x: 5, y: 5 });

    ship.isSunk.mockReturnValue(true);

    const move = moveGenerator.generateMove();

    expect(move).toBeDefined();
    expect(gameboard.getAllAvailablePositions()).toContainEqual(move);
  });

  test("should use checkerboard pattern for random moves", () => {
    gameboard.getAllAvailablePositions.mockReturnValue([
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
    ]);

    const move = moveGenerator.generateMove();

    expect((move.x + move.y) % 2).toBe(0);
  });

  test("should handle multiple partially damaged ships", () => {
    const ship2 = {
      isSunk: jest.fn().mockReturnValue(false),
      length: 3,
    };

    const mockShip1 = { ...ship };
    const mockShip2 = { ...ship2 };

    gameboard.getAllAvailablePositions.mockReturnValue([
      { x: 1, y: 2 },
      { x: 3, y: 2 },
      { x: 4, y: 5 },
      { x: 6, y: 5 },
    ]);

    gameboard.getShipAt.mockReturnValueOnce(mockShip1);
    gameboard.successfulAttacks.push({ x: 2, y: 2 });
    moveGenerator.generateMove();

    gameboard.getShipAt.mockReturnValueOnce(mockShip2);
    gameboard.successfulAttacks.push({ x: 5, y: 5 });

    const move = moveGenerator.generateMove();

    expect(gameboard.getAllAvailablePositions()).toContainEqual(move);
  });

  test("should fall back to random moves when no valid targets exist", () => {
    gameboard.successfulAttacks.push({ x: 5, y: 5 });
    ship.isSunk.mockReturnValue(true);

    const move = moveGenerator.generateMove();

    expect(move).toBeDefined();
    expect(gameboard.getAllAvailablePositions()).toContainEqual(move);
  });
});
