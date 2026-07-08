# Combined Demo App — Design & Build Specification

## Overview

Combine the three existing workflow demo pages (PDEV, Placements, LinkedIn Outreach) into a single unified app deployed to Vercel. The app serves as both an internal ROI showcase for executives (CEO Sean, Amanda) and an external product demo for prospective clients. Design leans toward product demo energy — if it looks sellable, it automatically proves ROI internally.

The audience includes screen-share presentations and self-guided link sharing. The page must be self-explanatory enough to explore solo, but clean enough to narrate over live.

---

## Framework & Tooling

- **Vite + vanilla JS** — no framework (React, Vue, etc.), no TypeScript
- **Static output** — deployed to Vercel as a static site
- **Single `index.html`** entry point, ES modules for code organization
- The existing animated map engine, SVG rendering, and scenario player port directly into ES modules

---

## File Structure

```
sv-apps/n8n-workflows/demo/
├── index.html
├── vite.config.js
├── package.json
├── src/
│   ├── main.js              — entry point, init router + theme
│   ├── router.js             — hash routing, transitions
│   ├── theme.js              — light/dark toggle, system accent swap
│   ├── overview.js           — landing page render (hero + cards)
│   ├── detail.js             — split layout shell (map left, panel right)
│   ├── map-engine.js         — shared SVG rendering, animation, scenario player
│   ├── systems/
│   │   ├── pdev.js           — PDEV nodes, edges, scenarios, deep-dive content
│   │   ├── placements.js     — Placements nodes, edges, scenarios, deep-dive content
│   │   └── linkedin.js       — LinkedIn nodes, edges, scenarios, deep-dive content
│   └── style.css             — all styles, single file
```

Each system file exports a data object (nodes, edges, scenarios, station content). The shared `map-engine.js` and `detail.js` consume it. Jia (the team member adding visual assets later) only needs to touch the system files to add media.

---

## Routing

- **Hash-based routing** with deep link support
- Default: `#` or `#overview` loads the landing/overview page
- System detail: `#pdev`, `#placements`, `#linkedin`
- Specific scenario: `#linkedin/ai_classify` drops directly into that system with the scenario playing
- Transitions are route-style (overview fades out, detail slides in, back button to return)

---

## Persistent Top Bar

A slim, persistent navigation bar across all views:

| Left | Center | Right |
|------|--------|-------|
| "Scale Virtually" (logo/name) | Three system links: PDEV / Placements / LinkedIn Outreach | Light/dark theme toggle |

- The active system gets an underline or accent highlight matching that system's color
- Clicking a system link navigates directly to it (no need to go back to overview first)
- Includes an "Overview" or home link to return to the landing page
- Minimal — no aggregate stats or extra elements in the bar

---

## Accent Color System

Each system has its own accent color. When switching systems, the page's color identity shifts:

| System | Accent (light) | Accent (dark) |
|--------|-----------------|---------------|
| PDEV | `#1a6b5a` (teal) | `#5cc4a8` |
| Placements | `#1a5a8a` (blue) | `#6aafe0` |
| LinkedIn Outreach | `#a05a1a` (amber) | `#d4944a` |

The shift applies to: buttons, highlights, active states, top bar underline, map node strokes, expandable sections. Implemented via CSS custom property swap with a smooth transition.

Shared semantic colors remain constant across all systems:
- `--warn` (trigger nodes)
- `--ai` (AI-powered elements)
- `--live` / `--off` (status chips)

---

## Theme Support (Light/Dark)

- Both themes get equal design care
- `prefers-color-scheme` media query for OS default
- `data-theme="dark"` / `data-theme="light"` on root element overrides the media query in both directions
- Theme toggle in the top bar persists preference (localStorage)
- All color tokens defined as CSS custom properties on `:root`

---

## Overview / Landing Page

### Hero Section

- **Style:** Branded but restrained — not a giant splashy marketing hero
- **Content:**
  - Company name: "Scale Virtually"
  - One-line descriptor (e.g., "Automated Operations Platform")
  - 3-4 aggregate stat pills (e.g., "22 workflows", "3 systems", "X hours saved monthly", "Y AI-powered processes")

### System Cards (3 cards)

Each card displays:

1. **16:9 media placeholder** at the top (screenshot/video thumbnail area — see Media Placeholders section)
2. **System name** (e.g., "Process Engineering Interface")
3. **One-liner description**
4. **Stat pills row:**
   - Station count (e.g., "7 stations")
   - Workflow count (e.g., "22 workflows")
   - AI badge (if that system uses AI) — e.g., "AI-powered" chip
   - Key time-saved metric (e.g., "~4 hrs saved daily")
5. No active/inactive status — that's an internal detail, not product-facing

Clicking a card triggers a route-style transition to that system's detail view.

All three systems are always visible — no filtering by client. The breadth is the point.

---

## System Detail View

### Layout: Split View

- **Left side (dominant, ~60-65% width):** Animated SVG map
- **Right side (~35-40% width):** Info/control panel

The animated map is the hero element of each system page.

### Right Panel Structure

**Top — Static header:**
- System name
- Stat pills (stations, workflows, AI badge, time saved)

**Middle — Scenario buttons:**
- Vertical stack of scenario buttons
- "Play All" button at the top as the primary action
- Active scenario highlighted
- AI scenarios get the AI styling (purple accent)

**Bottom — Dynamic content area (updates per selected scenario):**
1. **Scenario description** — plain-language explanation of what this workflow does
2. **16:9 media placeholder** — with helper text specific to this scenario (e.g., "Screenshot: Slack notification showing booking alert")
3. **Expandable "See full breakdown" accordion:**
   - Before/after grid (manual process vs. automated)
   - Impact section (time saved, cognitive load reduced)
   - No mini-flow diagrams — the animated map on the left handles flow visualization
   - No description repeat — it's already in the panel above

---

## Media Placeholders

Placeholders serve two audiences: the viewer (visible helper text) and Jia/her coding assistant (code comments).

### Visual Design
- Dashed-border box
- Icon inside (image icon or video icon as appropriate)
- Descriptive helper text (e.g., "Screenshot: Slack notification showing the daily health digest")
- Uniform **16:9 aspect ratio** — fills panel width, consistent height
- Styled to look intentional, not broken

### Code Format
Each placeholder includes an HTML comment above it for Jia:

```html
<!-- MEDIA: pdev-health-digest-screenshot
     Capture: The Slack #pdev-alerts channel showing the daily health digest message with the scoring table
     Recommended size: 800x450
     Type: screenshot -->
<div class="media-placeholder" data-media-id="pdev-health-digest">
  <svg><!-- image icon --></svg>
  <span>Screenshot: Slack notification showing daily health digest with scoring table</span>
</div>
```

Jia replaces the entire `<div class="media-placeholder">` with an `<img>` or `<video>` tag.

### Placement Locations
- **Overview cards:** 1 per card (3 total) — system thumbnail
- **Detail view right panel:** 1 per scenario in the dynamic area — scenario-specific output screenshot or video

---

## Content Migration

### From existing HTML pages

The following content carries over from the three existing pages (`pdev-workflows-v2.html`, `placements-workflows-v2.html`, `linkedin-outreach-workflows.html`):

| Content | Where it goes |
|---------|---------------|
| NODES, EDGES, SCENARIOS objects | `src/systems/{system}.js` — exported as data |
| SVG icon `<symbol>` definitions | Shared in `index.html` or a shared icons module |
| CSS custom properties (per-system accents) | `src/style.css` with system-scoped selectors |
| Station descriptions (paragraphs) | Scenario description in the right panel dynamic area |
| Before/after grids | Inside the expandable accordion per scenario |
| Impact sections | Inside the expandable accordion per scenario |
| Mini-flow SVG diagrams | **Dropped** — the persistent animated map replaces them |
| AI stack vendor pills | Moves into the static header area or the AI scenario's expandable section |
| Scenario `desc` and `stat` strings | Right panel dynamic area |

### Station-to-scenario mapping

Each existing "station" in the deep dive becomes a "scenario" in the new layout. The station's description becomes the scenario description. The station's before/after and impact become the expandable content.

Current station counts:
- **PDEV:** 7 stations (3 AI-powered)
- **Placements:** 6 stations
- **LinkedIn Outreach:** 4 stations (1 AI-powered)

---

## Existing Source Files

| File | Role |
|------|------|
| `n8n-workflows/docs/pdev-workflows-v2.html` | PDEV — finalized, 7 stations, teal accent |
| `n8n-workflows/docs/placements-workflows-v2.html` | Placements — finalized, 6 stations, blue accent |
| `n8n-workflows/docs/linkedin-outreach-workflows.html` | LinkedIn — finalized, 4 stations, amber accent |

These files remain as reference. The combined app is a new build in `n8n-workflows/demo/`.

---

## Design Decisions Log

These decisions were made during the grill-me session on 2026-07-09:

1. **Navigation structure:** Landing page with summary cards → drill-in detail view (option D)
2. **Drill-in style:** Route-style transition with back button (option A)
3. **Overview hero:** Company-branded with aggregate stats, restrained (option A)
4. **System cards:** All stats except active/inactive status
5. **Media placeholders:** Flexible type (screenshot or video), decided later (option D)
6. **Right panel layout:** Hybrid — static header + dynamic scenario content (option C)
7. **Deep dive integration:** Expandable accordion within right panel, no tab switch (option C)
8. **Deep dive content:** Before/after + impact only, no mini-flows (option B)
9. **Scenario buttons:** In the right panel, vertical stack (option B)
10. **System switching:** Direct from top bar, no need to go back to overview (option B)
11. **Accent colors:** Full theme shift per system (option A)
12. **Top bar contents:** Navigation + theme toggle only (option B)
13. **Initial load:** Overview by default, hash-aware for deep links (option B)
14. **Client filtering:** Show all three systems always (option C — defer filtering)
15. **Placeholder format:** Visual + HTML comments for Jia (option B)
16. **Placeholder aspect ratio:** Uniform 16:9 (option A)
17. **Framework:** Vite + vanilla JS (option A under Vite)
18. **Can pivot:** The landing → drill-in structure (decision #1) can be changed if needed

---

## Open Items

- [ ] Aggregate stats for the hero — need to calculate total workflows, total time saved across all systems
- [ ] Exact copy for the hero one-liner descriptor
- [ ] Specific media placeholder descriptions per scenario (what exactly to screenshot/record)
- [ ] Whether the overview cards need a hover/interaction state preview
- [ ] Vercel deployment configuration (custom domain, etc.)
- [ ] Scale Virtually logo/wordmark asset (if one exists beyond text)
