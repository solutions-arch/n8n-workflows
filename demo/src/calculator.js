// Floating savings calculator — mounted once in main.js, independent of
// routing, so it stays available as an overlay on every page.
import { systemHoursSaved30d } from "./ui.js";
import * as pdev from "./systems/pdev.js";
import * as placements from "./systems/placements.js";
import * as linkedin from "./systems/linkedin.js";

// Baseline headcount is Scale Virtually's current team, as of 2026-07.
// Hours saved is NOT independently editable — it's always today's real
// hours-saved total (systemHoursSaved30d, from Supabase execution volume)
// scaled proportionally by team size ÷ today's real headcount. The only
// two editable inputs per category are team size and the hourly $ rate,
// which multiply against those hours to produce a dollar estimate.
const DEFAULT_HOURLY_RATE = 20;

const CATEGORIES = [
  { system: pdev, roleLabel: "Process Engineers", baselineTeam: 5 },
  { system: placements, roleLabel: "Placements Specialists", baselineTeam: 3 },
  { system: linkedin, roleLabel: "Marketing Specialists", baselineTeam: 3 },
].map((c) => {
  const baselineHours = systemHoursSaved30d(c.system);
  return {
    ...c,
    baselineHours,
    teamMax: Math.max(10, c.baselineTeam * 4),
  };
});

function fmt(n, decimals = 1) {
  return n.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function fmtMoney(n) {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function categoryCard(cat, i) {
  const { system, roleLabel, baselineTeam, baselineHours, teamMax } = cat;
  return `
    <div class="calc-card" data-cat="${i}">
      <div class="calc-card-head">
        <h3>${system.meta.name}</h3>
        <button type="button" class="calc-reset" data-role="reset">Reset</button>
      </div>
      <p class="calc-baseline">Today: ${baselineTeam} ${roleLabel.toLowerCase()} &rarr; ${fmt(baselineHours)} hrs / 30d</p>

      <div class="calc-field">
        <div class="calc-field-label-row">
          <label for="team-${i}"># of ${roleLabel}</label>
          <span class="calc-field-value" data-role="team-val">${baselineTeam}</span>
        </div>
        <input type="range" id="team-${i}" min="0" max="${teamMax}" step="1" value="${baselineTeam}" data-role="team" />
      </div>
      <p class="calc-derived" data-role="hours-derived">&rarr; ${fmt(baselineHours)} hrs saved / 30d</p>

      <div class="calc-field">
        <div class="calc-field-label-row">
          <label for="rate-${i}">Hourly rate ($) &mdash; ${roleLabel}</label>
          <span class="calc-field-value" data-role="rate-val">$${DEFAULT_HOURLY_RATE}</span>
        </div>
        <input type="range" id="rate-${i}" min="0" max="100" step="1" value="${DEFAULT_HOURLY_RATE}" data-role="rate" />
      </div>

      <p class="calc-result" data-role="result">= ${fmtMoney(baselineHours * DEFAULT_HOURLY_RATE)} saved / 30 days</p>
    </div>`;
}

function panelMarkup() {
  return `
    <div class="calc-panel-head">
      <h2>Savings calculator</h2>
      <div class="calc-panel-head-actions">
        <button type="button" class="calc-panel-maximize" data-role="maximize" data-tooltip="Maximize" data-tooltip-pos="below" aria-pressed="false" aria-label="Maximize calculator">
          <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><use href="#icon-expand"></use></svg>
        </button>
        <button type="button" class="calc-panel-close" data-close data-tooltip="Close" data-tooltip-pos="below" aria-label="Close calculator">&times;</button>
      </div>
    </div>
    <p class="calc-panel-intro">Hours saved scale proportionally with team size, anchored to Scale Virtually's real, current numbers. Set each role's hourly rate to see the dollar value.</p>
    <div class="calc-grid">
      ${CATEGORIES.map(categoryCard).join("")}
    </div>
    <div class="calc-summary">
      <p class="calc-summary-head">Combined estimate</p>
      <div class="calc-summary-rows">
        <div class="calc-summary-row"><span class="n" data-role="total-hours">0</span><span class="l">hrs saved / 30d</span></div>
        <div class="calc-summary-row"><span class="n" data-role="total-30d">0</span><span class="l">saved / 30d</span></div>
        <div class="calc-summary-row"><span class="n" data-role="total-year">0</span><span class="l">saved / year</span></div>
      </div>
    </div>`;
}

export function initCalculatorTool() {
  const root = document.createElement("div");
  root.className = "calc-tool";
  root.innerHTML = `
    <button type="button" class="calc-fab" data-tooltip="Savings calculator" aria-expanded="false" aria-label="Open savings calculator">
      <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <rect x="5" y="2.5" width="14" height="19" rx="2.4"/>
        <line x1="8" y1="6.5" x2="16" y2="6.5"/>
        <circle cx="8.3" cy="12" r="0.9" fill="currentColor" stroke="none"/>
        <circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none"/>
        <circle cx="15.7" cy="12" r="0.9" fill="currentColor" stroke="none"/>
        <circle cx="8.3" cy="16" r="0.9" fill="currentColor" stroke="none"/>
        <circle cx="12" cy="16" r="0.9" fill="currentColor" stroke="none"/>
        <circle cx="15.7" cy="16" r="0.9" fill="currentColor" stroke="none"/>
      </svg>
    </button>
    <div class="calc-backdrop" hidden></div>
    <div class="calc-panel" hidden>${panelMarkup()}</div>`;
  document.body.appendChild(root);

  const fab = root.querySelector(".calc-fab");
  const panel = root.querySelector(".calc-panel");
  const backdrop = root.querySelector(".calc-backdrop");
  const maximizeBtn = panel.querySelector('[data-role="maximize"]');
  const cards = [...panel.querySelectorAll(".calc-card")];
  let isMaximized = false;

  function setMaximized(val) {
    isMaximized = val;
    panel.classList.toggle("is-maximized", val);
    backdrop.hidden = !val;
    maximizeBtn.setAttribute("aria-pressed", String(val));
    maximizeBtn.setAttribute("aria-label", val ? "Restore calculator size" : "Maximize calculator");
    maximizeBtn.setAttribute("data-tooltip", val ? "Restore" : "Maximize");
  }

  function categoryHours(card, cat) {
    const team = parseFloat(card.querySelector('[data-role="team"]').value) || 0;
    return cat.baselineHours * (team / cat.baselineTeam);
  }

  function recompute() {
    let totalHours = 0;
    let totalDollars = 0;
    cards.forEach((card, i) => {
      const cat = CATEGORIES[i];
      const team = card.querySelector('[data-role="team"]').value;
      const rate = parseFloat(card.querySelector('[data-role="rate"]').value) || 0;
      card.querySelector('[data-role="team-val"]').textContent = team;
      card.querySelector('[data-role="rate-val"]').textContent = `$${rate}`;

      const hours = categoryHours(card, cat);
      const dollars = hours * rate;
      totalHours += hours;
      totalDollars += dollars;

      card.querySelector('[data-role="hours-derived"]').textContent = `→ ${fmt(hours)} hrs saved / 30d`;
      card.querySelector('[data-role="result"]').textContent = `= ${fmtMoney(dollars)} saved / 30 days`;
    });

    panel.querySelector('[data-role="total-hours"]').textContent = fmt(totalHours);
    panel.querySelector('[data-role="total-30d"]').textContent = fmtMoney(totalDollars);
    panel.querySelector('[data-role="total-year"]').textContent = fmtMoney(totalDollars * 12);
  }

  cards.forEach((card, i) => {
    card.querySelector('[data-role="team"]').addEventListener("input", recompute);
    card.querySelector('[data-role="rate"]').addEventListener("input", recompute);
    card.querySelector('[data-role="reset"]').addEventListener("click", () => {
      const cat = CATEGORIES[i];
      card.querySelector('[data-role="team"]').value = cat.baselineTeam;
      card.querySelector('[data-role="rate"]').value = DEFAULT_HOURLY_RATE;
      recompute();
    });
  });
  recompute();

  function onKeydown(e) {
    if (e.key !== "Escape") return;
    if (isMaximized) setMaximized(false);
    else close();
  }

  function onOutsideClick(e) {
    if (!root.contains(e.target)) close();
  }

  function open() {
    panel.hidden = false;
    fab.setAttribute("aria-expanded", "true");
    root.classList.add("is-open");
    document.addEventListener("keydown", onKeydown);
    document.addEventListener("click", onOutsideClick, true);
  }

  function close() {
    panel.hidden = true;
    fab.setAttribute("aria-expanded", "false");
    root.classList.remove("is-open");
    setMaximized(false);
    document.removeEventListener("keydown", onKeydown);
    document.removeEventListener("click", onOutsideClick, true);
  }

  fab.addEventListener("click", () => (panel.hidden ? open() : close()));
  panel.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", close));
  maximizeBtn.addEventListener("click", () => setMaximized(!isMaximized));
  backdrop.addEventListener("click", () => setMaximized(false));
}
