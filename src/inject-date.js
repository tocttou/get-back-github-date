import "whatwg-fetch";

if (window.location.pathname.split("/").length === 2) {
  const apparentUsername = window.location.pathname.split("/").pop();
  injectCreationDate(apparentUsername);

  window.onpopstate = event => injectCreationDate(apparentUsername);
  detectURLChangeAndInjectDate(apparentUsername);
}

// history API cannot be used directly in content-scripts
function detectURLChangeAndInjectDate(apparentUsername) {
  setInterval(() => {
    const leftPane = getLeftPane();
    const lastElementInPane = getLastInPane(leftPane);

    if (
      typeof lastElementInPane === "undefined" ||
      lastElementInPane.getAttribute("aria-label") !== "createdAt"
    ) {
      injectCreationDate(apparentUsername);
    }
  }, 1000);
}

async function injectCreationDate(apparentUsername) {
  const response = await fetch(
    `https://api.github.com/users/${apparentUsername}`
  );
  if (response.status === 200) {
    const data = await response.json();
    const creationDate = new Date(data.created_at)
      .toDateString()
      .split(" ")
      .slice(1, 4)
      .join(" ");

    const leftPane = getLeftPane();
    const lastElementInPane = getLastInPane(leftPane);

    if (
      typeof lastElementInPane === "undefined" ||
      lastElementInPane.getAttribute("aria-label") !== "createdAt"
    ) {
      const dateElement = document.createElement("li");
      dateElement.innerText = creationDate;
      dateElement.setAttribute(
        "class",
        "vcard-detail pt-1 css-truncate css-truncate-target"
      );
      dateElement.setAttribute("aria-label", "createdAt");
      dateElement.setAttribute("title", "Account Creation Date");
      leftPane.appendChild(dateElement);
    }
  }
}

function getLeftPane() {
  return document.querySelector(
    "#js-pjax-container > div > div.col-3.float-left.pr-3 > ul"
  );
}

function getLastInPane(leftPane) {
  return Array.from(leftPane.getElementsByTagName("li")).pop();
}
