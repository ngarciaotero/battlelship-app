const { createRandomShipConfig } = require("../boardGenerator.js");
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
    jest.spyOn(console, "error").mockImplementation(() => {});

    mockPlaceShip = jest.fn().mockReturnValue(true);

    mockBoard = {
      placeShip: mockPlaceShip,
    };

    createGameboard.mockReturnValue(mockBoard);

    createShip.mockImplementation((length) => ({
      length,
    }));
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test("should return a gameboard with correct number of ships", () => {
    const ships = createRandomShipConfig();

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

    const ships = createRandomShipConfig();

    expect(board).toBeDefined();
    expect(board.placeShip).toBeDefined();
  });

  test("should return preset board when error occurs during generation", () => {
    createGameboard.mockImplementationOnce(() => {
      throw new Error();
    });

    const ships = createRandomShipConfig();

    expect(board).toBeDefined();
    expect(board.placeShip).toBeDefined();
  });

  test("should place ships in order of descending length", () => {
    const ships = createRandomShipConfig();

    expect(shipLengthCalls).toEqual(SHIP_LENGTHS);
  });
});
