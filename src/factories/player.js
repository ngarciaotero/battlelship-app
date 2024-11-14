export function createPlayer(playerType) {
  const type = playerType;

  function getType() {
    return type;
  }

  return {
    get type() {
      return getType();
    },
  };
}
