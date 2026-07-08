const VALID_SYSTEMS = new Set(["overview", "pdev", "placements", "linkedin"]);

export function parseHash() {
  const raw = location.hash.replace(/^#\/?/, "");
  if (!raw) return { system: "overview", scenario: null };
  const [system, scenario] = raw.split("/");
  if (!VALID_SYSTEMS.has(system)) return { system: "overview", scenario: null };
  return { system, scenario: scenario || null };
}

export function initRouter(onChange) {
  const handle = () => onChange(parseHash());
  window.addEventListener("hashchange", handle);
  handle();
}

export function navigate(system, scenario) {
  const hash = scenario ? `#${system}/${scenario}` : `#${system}`;
  if (location.hash === hash) return;
  location.hash = hash;
}

/** Update the URL to reflect the active scenario without firing a hashchange
 *  re-render (used while a scenario is already open in the detail view). */
export function setScenarioSilently(system, scenario) {
  const hash = scenario ? `#${system}/${scenario}` : `#${system}`;
  history.replaceState(null, "", hash);
}
