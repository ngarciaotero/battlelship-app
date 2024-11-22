const { createRandomShipConfig } = require("../randomShipConfig.js");
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

  test("should return correct number of ships with valid positions and orientations", () => {
    const ships = createRandomShipConfig();

    expect(createGameboard).toHaveBeenCalledTimes(1);

    SHIP_LENGTHS.forEach((length) => {
      expect(createShip).toHaveBeenCalledWith(length);
    });

    expect(ships).toHaveLength(SHIP_LENGTHS.length);

    ships.forEach((ship) => {
      expect(ship).toHaveProperty("length");
      expect(ship).toHaveProperty("position");
      expect(ship).toHaveProperty("orientation");
    });
  });

  test("should fall back to preset configuration when placement fails", () => {
    mockPlaceShip
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);

    const ships = createRandomShipConfig();

    expect(ships).toBeDefined();
    expect(ships).toHaveLength(5);
    ships.forEach((ship) => {
      expect(ship).toHaveProperty("length");
      expect(ship).toHaveProperty("position");
      expect(ship).toHaveProperty("orientation");
    });
  });

  test("should return preset configuration when error occurs during generation", () => {
    createGameboard.mockImplementationOnce(() => {
      throw new Error();
    });

    const ships = createRandomShipConfig();

    expect(ships).toBeDefined();
    expect(ships).toHaveLength(5);
    ships.forEach((ship) => {
      expect(ship).toHaveProperty("length");
      expect(ship).toHaveProperty("position");
      expect(ship).toHaveProperty("orientation");
    });
  });

  test("should place ships in order of descending length", () => {
    const ships = createRandomShipConfig();

    const shipLengths = ships.map((ship) => ship.length);
    expect(shipLengths).toEqual(SHIP_LENGTHS);
  });
});
