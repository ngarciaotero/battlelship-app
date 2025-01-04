import { cellUIHandler } from "./cellStateManager.js";

const DRAG_DATA_TYPE = "application/json";
const SHIP_STATES = {
  DRAGGING: "dragging",
};

export const dragDropUIHandler = {
  initializeDragAndDrop(suffix) {
    this.setupDraggableShips(suffix);
    cellUIHandler.setupCellDropZone(suffix);
  },

  setupDraggableShips(suffix) {
    const ships = domUtils.getShipElements(suffix);

    ships.forEach((ship) => {
      domUtils.setShipState(ship, true);
      this.attachDragListeners(ship, suffix);
    });
  },

  attachDragListeners(ship, suffix) {
    ship.addEventListener("dragstart", (e) =>
      this.handleDragStart(e, ship, suffix)
    );
    ship.addEventListener("dragend", () => this.handleDragEnd());
  },

  handleDragStart(e, ship, suffix) {
    const shipContainer = ship.closest(`.dock-ship-${suffix}`);
    const orientation = shipContainer.dataset.orientation;
    const shipLength = ship.querySelectorAll(".ship-segment").length;

    ship.classList.add(SHIP_STATES.DRAGGING);
    ship.dataset.dragShipLength = shipLength;
    ship.dataset.dragOrientation = orientation;

    e.dataTransfer.setData(
      DRAG_DATA_TYPE,
      JSON.stringify({
        orientation,
        shipLength,
      })
    );
  },

  handleDragEnd() {
    const ship = domUtils.getDraggingShip();
    if (ship) ship.classList.remove(SHIP_STATES.DRAGGING);
  },
};

// helper functions for DOM operations
const domUtils = {
  getShipElements: (suffix) =>
    document.querySelectorAll(`.dock-ship-${suffix} .ship-body`),

  getDraggingShip: () => document.querySelector(`.${SHIP_STATES.DRAGGING}`),

  setShipState: (shipBody, isDraggable) => {
    shipBody.setAttribute("draggable", isDraggable);
  },
};
