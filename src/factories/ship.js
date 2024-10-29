export function createShip(len) {
  const length = len;
  let hits = 0;

  function hit() {
    hits++;
  }

  function isSunk() {
    return hits === length;
  }

  return {
    hit,
    isSunk,
    get hits() {
      return hits;
    },
    get length() {
      return length;
    },
  };
}
