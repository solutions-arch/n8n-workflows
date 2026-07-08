import { initTheme } from "./theme.js";
import { initRouter } from "./router.js";
import { renderOverview } from "./overview.js";
import { renderDetail } from "./detail.js";

initTheme();

const app = document.getElementById("app");
const navLinks = document.querySelectorAll(".topbar-nav a[data-nav]");

function setActiveNav(system) {
  navLinks.forEach((a) => a.classList.toggle("active", a.dataset.nav === system));
}

function setPageSystem(system) {
  if (system === "overview") {
    document.documentElement.removeAttribute("data-system");
  } else {
    document.documentElement.setAttribute("data-system", system);
  }
}

let cleanupView = null;

initRouter((route) => {
  if (cleanupView) {
    cleanupView();
    cleanupView = null;
  }

  setPageSystem(route.system);
  setActiveNav(route.system);

  if (route.system === "overview") {
    renderOverview(app);
  } else {
    cleanupView = renderDetail(app, route.system, route.scenario);
  }

  window.scrollTo(0, 0);
});
