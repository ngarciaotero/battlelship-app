export const toggleVisibility = (...selectors) => {
  for (let i = 0; i < selectors.length; i += 2) {
    const selector = selectors[i];
    const visible = selectors[i + 1];
    const element = document.querySelector(selector);
    if (element) element.classList.toggle("hidden", !visible);
  }
};
