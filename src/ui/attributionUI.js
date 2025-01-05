import { createElement } from "./helpers/createElement.js";

export const createAttributionsUI = () => {
  const footer = createElement("footer", "attribution");

  // human icon attribution
  const humanIconDiv = createElement("div", "attribution-item");
  const humanIconLink = createLink(
    "https://www.flaticon.com/free-icons/user",
    "attribution-link",
    "User icons created by Freepik - Flaticon",
    "user icons"
  );
  humanIconDiv.appendChild(humanIconLink);

  // robot icon attribution
  const robotIconDiv = createElement("div", "attribution-item");
  const robotIconLink = createLink(
    "https://www.flaticon.com/free-icons/robot",
    "attribution-link",
    "Robot icons created by edt.im - Flaticon",
    "robot icons"
  );
  robotIconDiv.appendChild(robotIconLink);

  //   background image attribution
  const bgDiv = createElement("div", "attribution-item");
  const bgText = createElement("span", "attribution-text", "Photo by ");

  // create photographer link
  const photographerLink = createLink(
    "https://unsplash.com/@asaelamaury",
    "photographer-link",
    "Asael Peña"
  );

  const onText = createElement("span", "attribution-text", " on ");
  const unsplashLink = createLink(
    "https://unsplash.com",
    "attribution-link",
    "Unsplash"
  );

  bgDiv.appendChild(bgText);
  bgDiv.appendChild(photographerLink);
  bgDiv.appendChild(onText);
  bgDiv.appendChild(unsplashLink);

  footer.appendChild(humanIconDiv);
  footer.appendChild(robotIconDiv);
  footer.appendChild(bgDiv);

  return footer;
};

function createLink(href, classes, text, title = "") {
  const link = createElement("a", classes, text);
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  if (title) {
    link.title = title;
  }
  return link;
}
