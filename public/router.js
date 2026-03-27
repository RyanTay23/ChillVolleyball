// Map routes to section files
const routes = {
  "/rsvp": "sections/rsvp.html",
  "/timer": "sections/timer.html",
  "/rank": "sections/rank.html"
};

// Function to load a section
function loadSection(path) {
  const sectionPath = routes[path];
  const app = document.getElementById("app");

  if (!sectionPath) {
    app.innerHTML = "<h1>404 Not Found</h1>";
    console.log(`No route found for ${path}`);
    return;
  }

  fetch(sectionPath)
    .then(res => res.text())
    .then(html => {
      app.innerHTML = html;
    })
    .catch(() => {
      app.innerHTML = "<h1>404 Not Found</h1>";
      console.log(`No route found for ${path}`);
    });
}

// Intercept link clicks
document.addEventListener("click", e => {
  if (e.target.tagName === "A") {
    e.preventDefault();
    const path = e.target.getAttribute("href");
    history.pushState({}, "", path);
    loadSection(path);
  }
});

// Handle back/forward
window.addEventListener("popstate", () => loadSection(location.pathname));

// Initial load
loadSection(location.pathname);