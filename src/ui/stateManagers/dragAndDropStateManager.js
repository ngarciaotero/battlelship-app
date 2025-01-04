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

  resetDockShips(suffix) {
    domUtils.getShipElements(suffix).forEach((shipBody) => {
      shipBody.classList.remove(SHIP_STATES.PLACED);
      domUtils.setShipState(shipBody, true, false);

      shipBody.querySelectorAll(".ship-segment").forEach((segment) => {
        segment.classList.remove(SHIP_STATES.SEGMENT_PLACED);
      });
    });

    // reset all orientations to horizontal
    const currentOrientation =
      document.querySelector(`.dock-ship-${suffix}`)?.dataset.orientation ||
      ORIENTATIONS.HORIZONTAL;
    if (currentOrientation !== ORIENTATIONS.HORIZONTAL) {
      domUtils.updateOrientation(
        suffix,
        currentOrientation,
        ORIENTATIONS.HORIZONTAL
      );
    }
  },

  handleRotateShips(suffix) {
    const shipElements = document.querySelectorAll(`.dock-ship-${suffix}`);
    if (!shipElements.length) return;

    const currentOrientation =
      shipElements[0].dataset.orientation || ORIENTATIONS.HORIZONTAL;
    const newOrientation =
      currentOrientation === ORIENTATIONS.HORIZONTAL
        ? ORIENTATIONS.VERTICAL
        : ORIENTATIONS.HORIZONTAL;

    domUtils.updateOrientation(suffix, currentOrientation, newOrientation);
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

  updateOrientation: (suffix, currentOrientation, newOrientation) => {
    const updates = getOrientationUpdates(
      suffix,
      currentOrientation,
      newOrientation
    );

    updates.forEach(({ selector, oldClass, newClass }) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        if (selector.includes("dock-ship")) {
          element.dataset.orientation = newOrientation;
        }
        element.classList.remove(oldClass);
        element.classList.add(newClass);
      });
    });

    // update drag-orientation for any ships that have it
    const shipBodies = document.querySelectorAll(
      `.dock-ship-${suffix} .ship-body`
    );
    shipBodies.forEach((ship) => {
      if (ship.dataset.dragOrientation) {
        ship.dataset.dragOrientation = newOrientation;
      }
    });
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

const getOrientationUpdates = (suffix, currentOrientation, newOrientation) => [
  {
    selector: `.ship-dock-${suffix}`,
    oldClass: `ship-dock-${currentOrientation}`,
    newClass: `ship-dock-${newOrientation}`,
  },
  {
    selector: `.dock-ship-${suffix}`,
    oldClass: `dock-ship-${currentOrientation}`,
    newClass: `dock-ship-${newOrientation}`,
  },
  {
    selector: `.dock-ship-${suffix} .ship-label`,
    oldClass: `ship-label-${currentOrientation}`,
    newClass: `ship-label-${newOrientation}`,
  },
  {
    selector: `.dock-ship-${suffix} .ship-body`,
    oldClass: `ship-${currentOrientation}`,
    newClass: `ship-${newOrientation}`,
  },
];
