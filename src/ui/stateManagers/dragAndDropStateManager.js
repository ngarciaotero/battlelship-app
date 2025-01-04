import { createShip } from "../../factories/ship.js";
import { getPlayer } from "../../utils/playerUtils.js";
import { updatePassButtonUI } from "../updatePassBtnUI.js";
import { updateStartButtonUI } from "../updateStartBtnUI.js";
import { cellUIHandler } from "./cellStateManager.js";

const DRAG_DATA_TYPE = "application/json";
const SHIP_STATES = {
  DRAGGING: "dragging",
  PLACED: "ship-placed",
  SEGMENT_PLACED: "segment-placed",
};
const CSS_CLASSES = {
  HIGHLIGHT: "highlight",
  SHIP: "ship",
};
const ORIENTATIONS = {
  HORIZONTAL: "horizontal",
  VERTICAL: "vertical",
};

export const dragDropUIHandler = {
  initializeDragAndDrop(suffix) {
    this.setupDraggableShips(suffix);
    cellUIHandler.setupCellDropZone(suffix);
  },

  setupDraggableShips(suffix) {
    const ships = domUtils.getShipElements(suffix);

    ships.forEach((ship) => {
      domUtils.setShipState(ship, true, false);
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
    const orientation =
      shipContainer.dataset.orientation || ORIENTATIONS.HORIZONTAL;
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
    this.clearHighlights();
  },

  updateDropZoneHighlight(e, cell, suffix, isEntering) {
    e.preventDefault();

    const draggedShip = domUtils.getDraggingShip();
    if (!draggedShip) return;

    this.clearHighlights();
    if (!isEntering) return;

    const startPos = positionUtils.extractPositionFromCell(cell);
    const positions = positionUtils.getAffectedPositions(
      startPos,
      parseInt(draggedShip.dataset.dragShipLength),
      draggedShip.dataset.dragOrientation
    );

    this.highlightCells(positions, suffix);
  },

  async handleShipDrop(e, cell, suffix) {
    const dropData = JSON.parse(e.dataTransfer.getData(DRAG_DATA_TYPE));
    const startPos = positionUtils.extractPositionFromCell(cell);
    const player = getPlayer(suffix);

    if (!player) return;

    const ship = createShip(dropData.shipLength);
    const placementSuccessful = player.gameboard.placeShip(
      ship,
      startPos,
      dropData.orientation
    );

    if (placementSuccessful) {
      this.handleSuccessfulPlacement(startPos, dropData, suffix);
      updatePassButtonUI(player);
      updateStartButtonUI();
    }

    this.clearHighlights();
  },

  handleSuccessfulPlacement(startPos, dropData, suffix) {
    const draggedShip = domUtils.getDraggingShip();
    if (draggedShip) {
      domUtils.setShipState(draggedShip, false, true);
    }

    const positions = positionUtils.getAffectedPositions(
      startPos,
      dropData.shipLength,
      dropData.orientation
    );

    positions.forEach((pos) => {
      const cell = domUtils.getCellByPosition(suffix, pos);
      if (cell) cell.classList.add(CSS_CLASSES.SHIP);
    });
  },

  clearHighlights() {
    domUtils.removeClassFromAll(CSS_CLASSES.HIGHLIGHT);
  },

  highlightCells(positions, suffix) {
    positions.forEach((pos) => {
      const targetCell = domUtils.getCellByPosition(suffix, pos);
      if (targetCell) targetCell.classList.add(CSS_CLASSES.HIGHLIGHT);
    });
  },
};

// helper functions for DOM operations
const domUtils = {
  getShipElements: (suffix) =>
    document.querySelectorAll(`.dock-ship-${suffix} .ship-body`),

  getDraggingShip: () => document.querySelector(`.${SHIP_STATES.DRAGGING}`),

  setShipState: (shipBody, isDraggable, isPlaced) => {
    shipBody.setAttribute("draggable", isDraggable);
    if (isPlaced) {
      shipBody.classList.add(SHIP_STATES.PLACED);
      shipBody
        .querySelectorAll(".ship-segment")
        .forEach((segment) =>
          segment.classList.add(SHIP_STATES.SEGMENT_PLACED)
        );
    }
  },

  getCellByPosition: (suffix, pos) =>
    document.querySelector(
      `.cell-${suffix}[data-x="${pos.x}"][data-y="${pos.y}"]`
    ),

  removeClassFromAll: (className) => {
    document
      .querySelectorAll(`.${className}`)
      .forEach((element) => element.classList.remove(className));
  },
};

// helper functions for position calculation
const positionUtils = {
  getAffectedPositions: (startPos, length, orientation) => {
    return Array.from({ length }, (_, i) => ({
      x: orientation === ORIENTATIONS.HORIZONTAL ? startPos.x + i : startPos.x,
      y: orientation === ORIENTATIONS.VERTICAL ? startPos.y + i : startPos.y,
    }));
  },

  extractPositionFromCell: (cell) => ({
    x: parseInt(cell.dataset.x),
    y: parseInt(cell.dataset.y),
  }),
};
