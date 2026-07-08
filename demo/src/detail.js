import { createMap } from "./map-engine.js";
import { setScenarioSilently } from "./router.js";
import { mediaPlaceholder, metaRow } from "./ui.js";
import * as pdev from "./systems/pdev.js";
import * as placements from "./systems/placements.js";
import * as linkedin from "./systems/linkedin.js";

const REGISTRY = { pdev, placements, linkedin };

function aiStackHtml(stack) {
  return `
    <div class="ai-stack">
      <span class="ai-stack-title">${stack.title}</span>
      <span class="ai-stack-desc">${stack.desc}</span>
      <span class="ai-stack-note">${stack.note}</span>
      <div class="ai-stack-row">
        ${stack.vendors
          .map((v) => `<span class="vendor-pill"><span class="vp-dot" style="background:var(${v.colorVar})">${v.letter}</span> ${v.label}</span>`)
          .join("")}
      </div>
    </div>`;
}

function scenarioPanelHtml(system, scenario) {
  if (!scenario) {
    return `<div class="scenario-panel"><p class="scenario-empty">Select a scenario above, or Play All to see every workflow in sequence.</p></div>`;
  }
  const before = scenario.before.map((li) => `<li>${li}</li>`).join("");
  const after = scenario.after.map((li) => `<li>${li}</li>`).join("");
  const impact = scenario.impact.map((li) => `<li>${li}</li>`).join("");
  return `
    <div class="scenario-panel ${scenario.isAI ? "is-ai" : ""}">
      <span class="scenario-route">${scenario.route}</span>
      <p class="scenario-desc">${scenario.desc}</p>
      ${mediaPlaceholder(
        `${system.meta.key}-${scenario.key}-output`,
        `The output this workflow produces — e.g. the Slack message, email, or record it creates`,
        `Screenshot: output of "${scenario.route}"`
      )}
      <span class="scenario-stat">${scenario.stat}</span>
      <div class="accordion">
        <button class="accordion-toggle" type="button" aria-expanded="false">
          <svg class="chev" width="10" height="10" viewBox="0 0 10 10"><path d="M2 1l5 4-5 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          See full breakdown
        </button>
        <div class="accordion-body">
          <div class="ba-grid">
            <div class="ba-col before"><h3>Before</h3><ul>${before}</ul></div>
            <div class="ba-col after"><h3>After</h3><ul>${after}</ul></div>
          </div>
          <div class="impact">
            <p class="impact-head">Impact</p>
            <ul>${impact}</ul>
          </div>
          ${scenario.isAI && system.aiStack ? aiStackHtml(system.aiStack) : ""}
        </div>
      </div>
    </div>`;
}

export function renderDetail(container, systemKey, scenarioKey) {
  const system = REGISTRY[systemKey];
  const { meta, scenarios } = system;

  container.innerHTML = `
    <div class="route-view route-detail" data-system="${meta.key}">
      <div class="detail-wrap wrap">
        <a class="detail-back" href="#overview">&larr; Overview</a>
        <div class="detail-head">
          <p class="eyebrow">${meta.eyebrow}</p>
          <h1>${meta.name}</h1>
          ${metaRow(meta)}
        </div>
        <div class="detail-split">
          <div class="map-col">
            <div class="map-panel" id="map-panel">
              <div class="board">
                <button class="board-expand" id="board-expand" type="button" aria-label="Expand map">
                  <svg viewBox="0 0 24 24" width="16" height="16"><use href="#icon-expand"></use></svg>
                </button>
                <svg id="flow" role="img" aria-label="Flow diagram of the ${meta.name} automation system"></svg>
              </div>
              <div class="qbar" id="qbar">
                <button class="qbtn playall" id="play-all" type="button">Play All</button>
              </div>
            </div>
          </div>
          <div class="panel-col">
            <div id="scenario-panel-slot">${scenarioPanelHtml(system, null)}</div>
          </div>
        </div>
      </div>
      <div class="map-modal" id="map-modal" hidden>
        <div class="map-modal-backdrop" data-close></div>
        <div class="map-modal-dialog">
          <button class="map-modal-close" type="button" data-close aria-label="Close expanded map">&times;</button>
          <div class="map-modal-slot" id="map-modal-slot"></div>
        </div>
      </div>
    </div>`;

  const svgEl = container.querySelector("#flow");
  const engine = createMap(svgEl, {
    nodes: system.nodes,
    edges: system.edges,
    viewBox: system.viewBox,
    columnLabels: system.columnLabels,
  });

  const qbar = container.querySelector("#qbar");
  const panelSlot = container.querySelector("#scenario-panel-slot");
  const playAllBtn = container.querySelector("#play-all");

  // ---- expand-to-modal: move the live map-panel node (board + toolbar) into
  // the modal and back, so there's exactly one engine/toolbar instance ----
  const mapPanel = container.querySelector("#map-panel");
  const mapPanelHome = mapPanel.parentElement;
  const modal = container.querySelector("#map-modal");
  const modalSlot = container.querySelector("#map-modal-slot");

  function onModalKeydown(e) {
    if (e.key === "Escape") closeModal();
  }
  function openModal() {
    modalSlot.appendChild(mapPanel);
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onModalKeydown);
  }
  function closeModal() {
    mapPanelHome.appendChild(mapPanel);
    modal.hidden = true;
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onModalKeydown);
  }
  container.querySelector("#board-expand").addEventListener("click", openModal);
  modal.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", closeModal));

  scenarios.forEach((sc) => {
    const btn = document.createElement("button");
    btn.className = "qbtn" + (sc.isAI ? " ai-q" : "");
    btn.textContent = sc.label;
    btn.dataset.key = sc.key;
    btn.addEventListener("click", () => {
      selectScenario(sc);
      engine.play(sc);
      setScenarioSilently(meta.key, sc.key);
    });
    qbar.appendChild(btn);
  });

  function setActiveButton(key) {
    qbar.querySelectorAll(".qbtn[data-key]").forEach((b) => {
      b.classList.toggle("active", b.dataset.key === key);
    });
  }

  function selectScenario(sc) {
    setActiveButton(sc ? sc.key : null);
    panelSlot.innerHTML = scenarioPanelHtml(system, sc);
    wireAccordion();
  }

  function wireAccordion() {
    const toggle = panelSlot.querySelector(".accordion-toggle");
    if (!toggle) return;
    toggle.addEventListener("click", () => {
      const body = toggle.nextElementSibling;
      const open = body.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  playAllBtn.addEventListener("click", () => {
    engine.playAll(scenarios, (sc) => {
      selectScenario(sc);
      setScenarioSilently(meta.key, sc.key);
    });
  });

  wireAccordion();

  const initial = scenarioKey ? scenarios.find((s) => s.key === scenarioKey) : null;
  if (initial) {
    selectScenario(initial);
    engine.play(initial);
  }

  // Called by the router before the next view renders, so a modal left open
  // mid-navigation doesn't leave its keydown listener / body scroll-lock behind.
  return function cleanup() {
    document.removeEventListener("keydown", onModalKeydown);
    document.body.style.overflow = "";
  };
}
