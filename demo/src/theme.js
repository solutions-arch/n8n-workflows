const STORAGE_KEY = "sv-demo-theme";

function apply(theme) {
  if (theme === "light" || theme === "dark") {
    document.documentElement.setAttribute("data-theme", theme);
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

function current() {
  return document.documentElement.getAttribute("data-theme");
}

function systemPrefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  apply(saved);

  const toggle = document.getElementById("theme-toggle");
  toggle.addEventListener("click", () => {
    const active = current() || (systemPrefersDark() ? "dark" : "light");
    const next = active === "dark" ? "light" : "dark";
    apply(next);
    localStorage.setItem(STORAGE_KEY, next);
  });
}
