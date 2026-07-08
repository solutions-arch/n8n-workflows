import { navigate } from "./router.js";
import { mediaPlaceholder, metaRow } from "./ui.js";
import * as pdev from "./systems/pdev.js";
import * as placements from "./systems/placements.js";
import * as linkedin from "./systems/linkedin.js";

const SYSTEMS = [pdev, placements, linkedin];

// Aggregate stats derived from the three system data modules (see each
// system's meta + scenarios for the source numbers). "AI-powered processes"
// counts scenarios flagged isAI across all three systems.
// Open item (per combined-demo-spec.md): a rigorous "hours saved / month"
// aggregate needs real usage volume and isn't computed here — the daily-
// cadence figures on the system cards below are sourced directly from
// each system's own station content instead of being extrapolated.
function aggregateStats() {
  const workflowCount = SYSTEMS.reduce((sum, s) => sum + s.meta.workflowCount, 0);
  const stationCount = SYSTEMS.reduce((sum, s) => sum + s.meta.stationCount, 0);
  const aiProcessCount = SYSTEMS.reduce((sum, s) => sum + s.scenarios.filter((sc) => sc.isAI).length, 0);
  return { workflowCount, stationCount, aiProcessCount };
}

function card(system) {
  const { meta } = system;
  return `
    <a class="sys-card" href="#${meta.key}" data-nav-card="${meta.key}" data-system="${meta.key}">
      ${mediaPlaceholder(
        `${meta.key}-overview-thumbnail`,
        `A representative screenshot or short clip of the ${meta.name} in action`,
        `Screenshot: ${meta.name} overview`
      )}
      <div class="sys-card-body">
        <h2>${meta.name}</h2>
        ${metaRow(meta)}
        <p class="sys-card-desc">${meta.cardLine}</p>
      </div>
    </a>`;
}

export function renderOverview(container) {
  const { workflowCount, stationCount, aiProcessCount } = aggregateStats();

  container.innerHTML = `
    <div class="route-view route-overview">
      <section class="wrap hero">
        <p class="hero-name">Scale Virtually</p>
        <h1>Automated Operations Platform</h1>
        <p class="hero-desc">Three internal systems, running end-to-end without manual busywork — from client intake and VA placements to multi-client outreach campaigns.</p>
        <div class="hero-stats">
          <span class="stat-pill">3 systems</span>
          <span class="stat-pill">${workflowCount} workflows</span>
          <span class="stat-pill">${stationCount} automated stations</span>
          <span class="stat-pill ai">${aiProcessCount} AI-powered processes</span>
        </div>
      </section>
      <section class="wrap card-grid">
        ${SYSTEMS.map(card).join("")}
      </section>
    </div>`;

  container.querySelectorAll("[data-nav-card]").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      navigate(a.dataset.navCard, null);
    });
  });
}
