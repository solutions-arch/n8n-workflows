// Shared SVG rendering + scenario animation engine.
// Ported from the original per-system HTML demos; parametrized so each
// system module just supplies its own nodes/edges/columnLabels/scenarios.

const NS = "http://www.w3.org/2000/svg";
const XLINK = "http://www.w3.org/1999/xlink";

// Scenario-animation pacing — tune here rather than scattering magic numbers.
const EDGE_TRAVEL_MS = 1400; // time for the pulse to travel along one edge
const STEP_GAP_MS = 150; // pause after a step's edges finish, before the next step
const NODE_PAUSE_MS = 550; // pause on a node-only step (no edges to travel)
const EMPTY_PAUSE_MS = 350; // pause on a step with nothing to highlight
const LOOP_RESTART_GAP_MS = 900; // pause before a standalone play loops back to the start
const DETAIL_ITEM_MS = 480; // stagger between each revealed sub-step of a processing node
const DETAIL_HOLD_MS = 550; // hold once fully revealed, before continuing

// Every icon is a monochrome line-stroke symbol tinted via currentColor
// (see index.html's sprite) — except real brand marks, which have their own
// fixed colors and render as a raster <image> instead of a tinted <use>.
const RASTER_ICONS = { slack: "/icons/slack-mark.png" };

function addIcon(parent, key, x, y, w, h, cls) {
  if (RASTER_ICONS[key]) {
    const img = document.createElementNS(NS, "image");
    img.setAttributeNS(XLINK, "href", RASTER_ICONS[key]);
    img.setAttribute("href", RASTER_ICONS[key]);
    img.setAttribute("x", x);
    img.setAttribute("y", y);
    img.setAttribute("width", w);
    img.setAttribute("height", h);
    img.setAttribute("preserveAspectRatio", "xMidYMid meet");
    parent.appendChild(img);
    return img;
  }
  const u = document.createElementNS(NS, "use");
  u.setAttributeNS(XLINK, "href", "#icon-" + key);
  u.setAttribute("href", "#icon-" + key);
  u.setAttribute("x", x);
  u.setAttribute("y", y);
  u.setAttribute("width", w);
  u.setAttribute("height", h);
  if (cls) u.setAttribute("class", cls);
  parent.appendChild(u);
  return u;
}

/** Anchor point on a node's edge, for drawing connector paths. */
export function anchor(nodes, id, side, off = 0) {
  const n = nodes[id];
  if (side === "r") return { x: n.x + n.w, y: n.y + n.h / 2 + off };
  if (side === "l") return { x: n.x, y: n.y + n.h / 2 + off };
  if (side === "t") return { x: n.x + n.w / 2 + off, y: n.y };
  return { x: n.x + n.w / 2 + off, y: n.y + n.h };
}

/** Cubic-bezier path string between two node anchors. */
export function edgeD(nodes, from, fs, to, ts, fo, to2, k1, k2) {
  const K = 90;
  const a = anchor(nodes, from, fs, fo);
  const b = anchor(nodes, to, ts, to2);
  const c1 = k1 || K, c2 = k2 || K;
  const dx = fs === "r" ? 1 : fs === "l" ? -1 : 0;
  const dy = fs === "t" ? -1 : fs === "b" ? 1 : 0;
  const dx2 = ts === "r" ? 1 : ts === "l" ? -1 : 0;
  const dy2 = ts === "t" ? -1 : ts === "b" ? 1 : 0;
  return `M ${a.x} ${a.y} C ${a.x + dx * c1} ${a.y + dy * c1}, ${b.x + dx2 * c2} ${b.y + dy2 * c2}, ${b.x} ${b.y}`;
}

/**
 * Build the animated SVG map inside `svgEl` and return a controller with
 * play(scenario, cb) / stop().
 */
export function createMap(svgEl, { nodes, edges, viewBox, columnLabels = [] }) {
  svgEl.innerHTML = "";
  svgEl.setAttribute("viewBox", viewBox);

  function el(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    (parent || svgEl).appendChild(e);
    return e;
  }

  columnLabels.forEach((c) => {
    el("text", { x: c.x, y: c.y, class: "t-col", "text-anchor": "middle" }).textContent = c.text;
  });

  const defs = el("defs", {});
  const filt = el("filter", { id: "glow", x: "-50%", y: "-50%", width: "200%", height: "200%" }, defs);
  el("feGaussianBlur", { stdDeviation: "4", result: "blur" }, filt);
  const merge = el("feMerge", {}, filt);
  el("feMergeNode", { in: "blur" }, merge);
  el("feMergeNode", { in: "SourceGraphic" }, merge);

  const marker = el("marker", { id: "arrow", viewBox: "0 0 10 8", refX: "9", refY: "4", markerWidth: "8", markerHeight: "6", orient: "auto-start-reverse" }, defs);
  el("path", { d: "M 0 0 L 10 4 L 0 8 z", fill: "var(--rule)", class: "arrow-fill" }, marker);

  Object.keys(edges).forEach((id) => {
    el("path", { id, d: edges[id].d, class: "edge", "marker-end": "url(#arrow)" });
  });

  Object.keys(nodes).forEach((id) => {
    const n = nodes[id];
    const g = el("g", { id: "n_" + id, class: "node " + n.cls });
    el("rect", { x: n.x, y: n.y, width: n.w, height: n.h, rx: 8, class: "body" }, g);
    const iconSize = 20;
    addIcon(g, n.icon, n.x + 12, n.y + n.h / 2 - iconSize / 2, iconSize, iconSize, "node-icon");
    const textX = n.x + 40 + (n.w - 40) / 2;
    const t = el("text", { x: textX, y: n.y + n.h / 2 - 5, "text-anchor": "middle", class: "t-title" }, g);
    t.textContent = n.title;
    const s = el("text", { x: textX, y: n.y + n.h / 2 + 11, "text-anchor": "middle", class: "t-sub" }, g);
    s.textContent = n.sub;
  });

  let animId = 0;

  // Each concurrently-animating edge or node-pause gets its own pulse dot —
  // a step that fans out to multiple destinations needs one dot per branch,
  // not one dot that can only be in one place at a time.
  function spawnPulse(isAI) {
    return el("circle", { class: "pulse visible" + (isAI ? " ai-pulse" : ""), r: 6 });
  }

  function clearAnim() {
    animId++;
    svgEl.classList.remove("running");
    svgEl.querySelectorAll(".on").forEach((e) => e.classList.remove("on"));
    svgEl.querySelectorAll(".ai-edge").forEach((e) => e.classList.remove("ai-edge"));
    svgEl.querySelectorAll(".pulse").forEach((e) => e.remove());
    // A processing node mid-reveal (see revealSubSteps) may have its subtitle
    // text partially built up — always restore the authored text so nothing
    // is ever left showing a truncated mid-reveal state.
    Object.keys(nodes).forEach((id) => {
      const subEl = svgEl.querySelector(`#n_${id} .t-sub`);
      if (subEl) subEl.textContent = nodes[id].sub;
    });
  }

  // Re-triggers the subtitle's pop animation (forces a reflow so repeat
  // ticks on the same element restart the CSS animation instead of no-op'ing).
  function popText(subEl) {
    subEl.classList.remove("pop");
    subEl.getBoundingClientRect();
    subEl.classList.add("pop");
  }

  // Reveals a node's authored sub-steps one at a time (its subtitle is
  // already written as e.g. "company · client · POC" — this just builds
  // that string up piece by piece, popping on each addition) instead of a
  // flat pause, so arriving at any node — trigger, processing, or
  // destination — gives a small visible acknowledgment rather than just
  // flashing through. Single-phrase subtitles (nothing to break up) still
  // get one pop so every node type reads consistently.
  function revealSubSteps(id, myId, cb) {
    const subEl = svgEl.querySelector(`#n_${id} .t-sub`);
    const items = nodes[id].sub.split(" · ");
    let shown = 0;
    subEl.textContent = "";
    function revealNext() {
      if (myId !== animId) return;
      shown++;
      subEl.textContent = items.slice(0, shown).join(" · ");
      popText(subEl);
      if (shown < items.length) setTimeout(revealNext, DETAIL_ITEM_MS);
      else setTimeout(cb, DETAIL_HOLD_MS);
    }
    setTimeout(revealNext, DETAIL_ITEM_MS);
  }

  function animateAlongPath(pathElem, dur, myId, pulseEl, cb) {
    const len = pathElem.getTotalLength();
    let t0 = null;
    function frame(ts) {
      if (myId !== animId) return;
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      const pt = pathElem.getPointAtLength(p * len);
      pulseEl.setAttribute("cx", pt.x);
      pulseEl.setAttribute("cy", pt.y);
      if (p < 1) requestAnimationFrame(frame);
      else {
        pulseEl.remove();
        if (cb) cb();
      }
    }
    requestAnimationFrame(frame);
  }

  function runSteps(steps, isAI, myId, done) {
    let i = 0;
    function next() {
      if (myId !== animId) return;
      if (i >= steps.length) {
        if (done) {
          done();
          return;
        }
        // No completion callback — loop it continuously so the flow keeps
        // animating for as long as someone's narrating or just watching.
        i = 0;
        svgEl.querySelectorAll(".on").forEach((e) => e.classList.remove("on"));
        svgEl.querySelectorAll(".ai-edge").forEach((e) => e.classList.remove("ai-edge"));
        setTimeout(next, LOOP_RESTART_GAP_MS);
        return;
      }
      const ids = steps[i];
      i++;
      const stepNodes = [], stepEdges = [];
      ids.forEach((id) => {
        const pre = id.substring(0, 2), eid = id.substring(2);
        let elem;
        if (pre === "n:") {
          elem = document.getElementById("n_" + eid);
          if (elem) { elem.classList.add("on"); stepNodes.push(eid); }
        } else {
          elem = document.getElementById(eid);
          if (elem) { elem.classList.add("on"); if (isAI) elem.classList.add("ai-edge"); stepEdges.push(elem); }
        }
      });
      if (stepEdges.length > 0) {
        let done0 = 0;
        const total = stepEdges.length;
        stepEdges.forEach((pathEl) => {
          const pulseEl = spawnPulse(isAI);
          animateAlongPath(pathEl, EDGE_TRAVEL_MS, myId, pulseEl, () => {
            done0++;
            if (done0 >= total && myId === animId) setTimeout(next, STEP_GAP_MS);
          });
        });
      } else if (stepNodes.length > 0) {
        stepNodes.forEach((id) => {
          const nd = nodes[id];
          if (!nd) return;
          const pulseEl = spawnPulse(isAI);
          pulseEl.setAttribute("cx", nd.x + nd.w / 2);
          pulseEl.setAttribute("cy", nd.y + nd.h / 2);
        });
        const revealIds = stepNodes.filter((id) => nodes[id]);
        if (revealIds.length > 0) {
          let doneCount = 0;
          revealIds.forEach((id) => {
            revealSubSteps(id, myId, () => {
              doneCount++;
              if (doneCount >= revealIds.length && myId === animId) {
                svgEl.querySelectorAll(".pulse").forEach((e) => e.remove());
                next();
              }
            });
          });
        } else {
          setTimeout(() => {
            svgEl.querySelectorAll(".pulse").forEach((e) => e.remove());
            next();
          }, NODE_PAUSE_MS);
        }
      } else {
        setTimeout(next, EMPTY_PAUSE_MS);
      }
    }
    next();
  }

  function play(scenario, cb) {
    clearAnim();
    svgEl.classList.add("running");
    const myId = animId;
    runSteps(scenario.steps, scenario.isAI, myId, cb);
  }

  return { play, stop: clearAnim };
}
