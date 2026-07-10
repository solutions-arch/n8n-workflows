import { createMap } from "./map-engine.js";
import { setScenarioSilently } from "./router.js";
import { mediaPlaceholder, metaRow, joinMetaParts, systemHoursSaved30d, hoursSavedLabel } from "./ui.js";
import { narrationSrc, createNarrationControl } from "./narration.js";
import { wireMedia, mediaSrc } from "./media.js";
import { initInlineSystemCalculator } from "./calculator.js";
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

// Real hours saved beats a node/workflow count — that's an implementation
// detail, not a business result. Scenarios without a reliable hoursSaved30d
// (currently just the two Error Monitors) fall back to their qualitative
// descriptor instead of a time figure.
function scenarioStatLine(scenario) {
  const runs = `${scenario.executions30d.toLocaleString()} runs`;
  if (typeof scenario.hoursSaved30d === "number") {
    return `${runs} · ~${scenario.hoursSaved30d.toFixed(1)} hrs saved / 30 days`;
  }
  const qualitative = scenario.stat.split("·").slice(1).join("·").trim();
  return qualitative ? `${runs} / 30 days · ${qualitative}` : `${runs} / 30 days`;
}

function useCasesHtml(useCases) {
  if (!useCases) return "";
  const cards = useCases.items
    .map(
      (uc) => `
        <div class="usecase-card">
          <h3>${uc.title}</h3>
          <ul>${uc.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>
        </div>`
    )
    .join("");
  const alt = useCases.alternatives;
  const altRows = alt.items
    .map(
      (a) => `
        <div class="alt-row">
          <div class="alt-row-head"><span class="alt-name">${a.name}</span><span class="alt-price">${a.price}</span></div>
          <p class="alt-note">${a.note}</p>
        </div>`
    )
    .join("");
  return `
    <section class="wrap use-cases">
      <h2>Use Cases</h2>
      <p class="use-cases-intro">Same automation pattern, mapped onto a different industry: each one runs the identical shape of steps as one of the scenarios above.</p>
      <div class="usecase-grid">${cards}</div>
      <div class="alternatives">
        <h3>What teams are using:</h3>
        <div class="alt-grid">${altRows}</div>
        <p class="alt-closing">${alt.closing}</p>
      </div>
    </section>`;
}

// A clickable callout for a system's real, live client-facing product (not a
// mockup) — sits above Use Cases. Deliberately does NOT use wireMedia's
// click-to-zoom behavior: the whole card is a single <a> that should navigate
// out to the dashboard, not open a lightbox.
function dashboardCtaHtml(cta) {
  if (!cta) return "";
  return `
    <section class="wrap dashboard-cta">
      <a class="dashboard-cta-link" href="${cta.href}" target="_blank" rel="noopener noreferrer">
        ${mediaPlaceholder(cta.mediaId, "A screenshot of the live client dashboard this system feeds", `Screenshot: ${cta.heading}`)}
        <div class="dashboard-cta-body">
          <h2>${cta.heading}</h2>
          <p>${cta.desc}</p>
        </div>
      </a>
    </section>`;
}

// Always-visible, single-category savings section embedded at the bottom of
// a system's own detail page — as opposed to the floating multi-system tool,
// which stays untouched and shows all 3 systems together elsewhere.
function systemCalculatorHtml(system) {
  if (!system.inlineCalculator) return "";
  return `
    <section class="wrap system-calc">
      <h2>Savings calculator</h2>
      <p class="system-calc-intro">${system.inlineCalculator.intro}</p>
      <div class="system-calc-mount"></div>
    </section>`;
}

// Static, non-interactive image swap (no click-to-zoom) — used for the
// dashboard screenshot(s), which should navigate via their wrapping <a>
// rather than open a lightbox.
function wireStaticImage(containerEl, mediaId, alt) {
  if (!containerEl) return;
  const src = mediaSrc(mediaId);
  const probe = new Image();
  probe.onload = () => {
    containerEl.innerHTML = `<img src="${src}" alt="${alt || ""}" />`;
    containerEl.classList.add("has-media");
  };
  probe.src = src;
}

function scenarioPanelHtml(system, scenario) {
  if (!scenario) {
    return `<div class="scenario-panel"><p class="scenario-empty">Select a scenario above to see how it works.</p></div>`;
  }
  const before = scenario.before.map((li) => `<li>${li}</li>`).join("");
  const after = scenario.after.map((li) => `<li>${li}</li>`).join("");
  const impact = scenario.impact.map((li) => `<li>${li}</li>`).join("");
  return `
    <div class="scenario-panel ${scenario.isAI ? "is-ai" : ""}">
      <span class="scenario-route">${scenario.route}</span>
      <p class="scenario-desc">${scenario.desc}</p>
      <div class="media-ba">
        <figure class="media-ba-item media-ba-before" hidden>
          <figcaption>Before</figcaption>
          ${mediaPlaceholder(
            `${system.meta.key}-${scenario.key}-before`,
            `The manual / old way this was handled before automation`,
            `Screenshot: BEFORE "${scenario.route}"`
          )}
        </figure>
        <figure class="media-ba-item media-ba-after">
          <figcaption>After</figcaption>
          ${mediaPlaceholder(
            `${system.meta.key}-${scenario.key}-output`,
            `The output this workflow produces: e.g. the Slack message, email, or record it creates`,
            `Screenshot: output of "${scenario.route}"`
          )}
        </figure>
      </div>
      <span class="scenario-stat">${scenarioStatLine(scenario)}</span>
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
          ${metaRow(meta, hoursSavedLabel(systemHoursSaved30d(system)))}
        </div>
        <div class="detail-split">
          <div class="map-col">
            <div class="map-panel" id="map-panel">
              <div class="board">
                <button class="board-expand" id="board-expand" type="button" aria-label="Expand map">
                  <svg viewBox="0 0 24 24" width="16" height="16"><use href="#icon-expand"></use></svg>
                </button>
                <div class="narration-btn" id="narration-btn">
                  <button class="narration-toggle" type="button" aria-label="Play narration">
                    <svg width="12" height="12" viewBox="0 0 24 24"><use href="#icon-play"></use></svg>
                  </button>
                  <div class="narration-track" tabindex="0" role="slider" aria-label="Seek narration" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
                    <div class="narration-fill"></div>
                  </div>
                  <span class="narration-time">0:00 / 0:00</span>
                </div>
                <svg id="flow" role="img" aria-label="Flow diagram of the ${meta.name} automation system"></svg>
              </div>
              <div class="map-legend">
                <span class="map-legend-item"><span class="map-legend-dot dot-trigger"></span>External trigger</span>
                <span class="map-legend-item"><span class="map-legend-dot dot-proc"></span>Built by SV</span>
                <span class="map-legend-item"><span class="map-legend-dot dot-ai"></span>AI-powered</span>
                <span class="map-legend-item"><span class="map-legend-dot dot-dest"></span>Existing tool</span>
              </div>
              <div class="qbar" id="qbar"></div>
            </div>
          </div>
          <div class="panel-col">
            <div id="scenario-panel-slot">${scenarioPanelHtml(system, null)}</div>
          </div>
        </div>
      </div>
      <div id="dashboard-cta-slot"></div>
      ${useCasesHtml(system.useCases)}
      ${systemCalculatorHtml(system)}
    </div>`;

  // The expand modal is fixed-positioned and must live outside the animated
  // route wrapper: `.route-view`'s enter animation keeps `transform` engaged
  // (animation-fill-mode: both never releases it, even once visually
  // settled at the identity matrix), which silently hijacks position:fixed's
  // containing block away from the viewport onto `.route-view` itself —
  // the modal ends up sized/positioned to the route's content box instead
  // of the screen. Portaling to document.body sidesteps that entirely.
  // data-system is repeated here since each system's accent color is scoped
  // via [data-system="..."] custom properties that otherwise wouldn't reach
  // a node living outside `.route-view[data-system]`'s subtree.
  const modalHost = document.createElement("div");
  modalHost.innerHTML = `
    <div class="map-modal" id="map-modal" hidden data-system="${meta.key}">
      <div class="map-modal-backdrop" data-close></div>
      <div class="map-modal-dialog">
        <button class="map-modal-close" type="button" data-close aria-label="Close expanded map">&times;</button>
        <div class="map-modal-slot" id="map-modal-slot"></div>
      </div>
    </div>`;
  const modal = modalHost.firstElementChild;
  document.body.appendChild(modal);

  const svgEl = container.querySelector("#flow");
  const engine = createMap(svgEl, {
    nodes: system.nodes,
    edges: system.edges,
    viewBox: system.viewBox,
    columnLabels: system.columnLabels,
  });

  const qbar = container.querySelector("#qbar");
  const panelSlot = container.querySelector("#scenario-panel-slot");
  const dashboardCtaSlot = container.querySelector("#dashboard-cta-slot");

  function updateDashboardCta(sc) {
    if (sc && sc.dashboardShot && system.dashboardCTA) {
      dashboardCtaSlot.innerHTML = dashboardCtaHtml(system.dashboardCTA);
      wireStaticImage(
        dashboardCtaSlot.querySelector(`[data-media-id="${system.dashboardCTA.mediaId}"]`),
        system.dashboardCTA.mediaId,
        system.dashboardCTA.heading
      );
    } else {
      dashboardCtaSlot.innerHTML = "";
    }
  }

  if (system.inlineCalculator) {
    initInlineSystemCalculator(container.querySelector(".system-calc-mount"), {
      system,
      roleLabel: system.inlineCalculator.roleLabel,
      baselineTeam: system.inlineCalculator.baselineTeam,
    });
  }

  // ---- expand-to-modal: move the live map-panel node (board + toolbar) into
  // the modal and back, so there's exactly one engine/toolbar instance ----
  const mapPanel = container.querySelector("#map-panel");
  const mapPanelHome = mapPanel.parentElement;
  const modalSlot = modal.querySelector("#map-modal-slot");

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

  const narrationBtn = container.querySelector("#narration-btn");
  const narration = createNarrationControl(narrationBtn);
  const metaRowEl = container.querySelector(".detail-head .meta-row");
  const totalHoursLabel = hoursSavedLabel(systemHoursSaved30d(system));

  // Nothing selected: full structural stats + the system's rolled-up total.
  // A scenario selected: just its own AI badge (if it's AI) + its own hours —
  // station/workflow counts are implementation detail once you're looking at
  // one specific process.
  function updateMetaRow(sc) {
    metaRowEl.innerHTML = sc
      ? joinMetaParts([
          sc.isAI ? `<span class="meta-ai">AI-powered</span>` : null,
          `<span class="meta-hours">${scenarioStatLine(sc)}</span>`,
        ])
      : joinMetaParts([
          `${meta.stationCount} stations`,
          `${meta.workflowCount} workflows`,
          meta.aiPowered ? `<span class="meta-ai">AI-powered</span>` : null,
          `<span class="meta-hours">${totalHoursLabel}</span>`,
        ]);
  }

  scenarios.forEach((sc) => {
    const btn = document.createElement("button");
    btn.className = "qbtn" + (sc.isAI ? " ai-q" : "");
    btn.textContent = sc.label;
    btn.dataset.key = sc.key;
    btn.addEventListener("click", () => {
      if (btn.classList.contains("active")) {
        // Toggling the active scenario off returns to the "nothing selected" state.
        selectScenario(null);
        engine.stop();
        setScenarioSilently(meta.key, null);
      } else {
        selectScenario(sc);
        engine.play(sc);
        setScenarioSilently(meta.key, sc.key);
      }
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
    narrationBtn.classList.toggle("is-ai", !!(sc && sc.isAI));
    updateMetaRow(sc);
    updateDashboardCta(sc);
    if (sc) {
      narration.load(narrationSrc(meta.key, sc.key));
      const mediaId = `${meta.key}-${sc.key}-output`;
      wireMedia(panelSlot.querySelector(`[data-media-id="${mediaId}"]`), mediaId, `Output of "${sc.route}"`);
      const beforeId = `${meta.key}-${sc.key}-before`;
      const baWrap = panelSlot.querySelector(".media-ba");
      const beforeFig = panelSlot.querySelector(".media-ba-before");
      if (beforeFig) {
        wireMedia(beforeFig.querySelector(`[data-media-id="${beforeId}"]`), beforeId, `Before "${sc.route}"`, {
          onFound: () => { beforeFig.hidden = false; if (baWrap) baWrap.classList.add("has-before"); },
          onMissing: () => { beforeFig.remove(); },
        });
      }
    } else {
      narration.reset();
    }
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

  wireAccordion();

  const initial = scenarioKey ? scenarios.find((s) => s.key === scenarioKey) : null;
  if (initial) {
    selectScenario(initial);
    engine.play(initial);
  }

  // Called by the router before the next view renders, so a modal left open
  // mid-navigation doesn't leave its keydown listener / body scroll-lock
  // behind — and since the modal now lives on document.body rather than
  // inside `container`, it won't be cleared away by the next route's
  // `container.innerHTML` assignment, so it must be removed explicitly here.
  return function cleanup() {
    document.removeEventListener("keydown", onModalKeydown);
    document.body.style.overflow = "";
    narration.stop();
    modal.remove();
  };
}
