const { generateRandomGameboard } = require("../boardGenerator.js");
const { createGameboard } = require("../gameboard.js");
const { createShip } = require("../ship.js");

jest.mock("../gameboard.js", () => ({
  createGameboard: jest.fn(),
}));

jest.mock("../ship.js", () => ({
  createShip: jest.fn(),
}));

describe("Random Board Generator", () => {
  const SHIP_LENGTHS = [5, 4, 3, 3, 2];
  let mockPlaceShip;
  let mockBoard;

  beforeEach(() => {
    jest.clearAllMocks();

    mockPlaceShip = jest.fn().mockReturnValue(true);

    mockBoard = {
      placeShip: mockPlaceShip,
    };

    createGameboard.mockReturnValue(mockBoard);

    createShip.mockImplementation((length) => ({
      length,
    }));
  });

  test("should return a gameboard with correct number of ships", () => {
    generateRandomGameboard();

    expect(createGameboard).toHaveBeenCalledTimes(1);

    SHIP_LENGTHS.forEach((length) => {
      expect(createShip).toHaveBeenCalledWith(length);
    });

    expect(mockPlaceShip.mock.calls.length).toBe(SHIP_LENGTHS.length);
  });

  test("should fall back to preset board when placement fails", () => {
    mockPlaceShip
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);

    const board = generateRandomGameboard();

    expect(board).toBeDefined();
    expect(board.placeShip).toBeDefined();
  });

  test("should return preset board when error occurs during generation", () => {
    createGameboard.mockImplementationOnce(() => {
      throw new Error();
    });

    const board = generateRandomGameboard();

    expect(board).toBeDefined();
    expect(board.placeShip).toBeDefined();
  });

  test("should place ships in order of descending length", () => {
    generateRandomGameboard();

    const shipLengthCalls = mockPlaceShip.mock.calls.map(
      (call) => call[0].length
    );

    expect(shipLengthCalls).toEqual(SHIP_LENGTHS);
  });
});
