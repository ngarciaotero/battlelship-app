export const handleRotateButton = (suffix) => {
  const shipElements = document.querySelectorAll(`.dock-ship-${suffix}`);
  if (!shipElements.length) return;

  const currentOrientation =
    shipElements[0].dataset.orientation || "horizontal";
  const newOrientation =
    currentOrientation === "horizontal" ? "vertical" : "horizontal";

  // update all elements that need orientation changes
  const updates = [
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

  // apply each update to all matching elements
  updates.forEach(({ selector, oldClass, newClass }) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      // update orientation data attribute for ship containers
      if (selector.includes("dock-ship")) {
        element.dataset.orientation = newOrientation;
      }
      // replace old orientation class with new one
      element.classList.remove(oldClass);
      element.classList.add(newClass);
    });
  });
};
