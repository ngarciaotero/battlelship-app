export const createElement = (tag, className, textContent = null) => {
  const element = document.createElement(tag);

  if (Array.isArray(className)) {
    className.forEach((cls) => element.classList.add(cls));
  } else if (className) {
    element.className = className;
  }

  if (textContent) {
    element.textContent = textContent;
  }

  return element;
};
