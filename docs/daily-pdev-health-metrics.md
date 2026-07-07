# Daily PDEV Health Digest & Metrics
**Daily Scrubbing (PDEV & Projects) + Daily Scrubbing Notifier (PDEV)**

> Every requirement and project gets a daily health snapshot, trend history, and a prioritized Slack digest — automatically.

**Status:** Active | **Systems:** Airtable, Slack

---

## Before (Manual Process)

1. Someone manually reviews all active PDEV requirements every day.
1. They mentally assess which ones are urgent, stale, or at risk.
1. They write up a summary and post it to Slack.
1. Some days it doesn't happen — and issues slip through the cracks.
1. Different people assess urgency differently — no consistent scoring.
1. There's no systematic way to track how requirements and projects change day to day.
1. Trend analysis is impossible without historical data points.

---

## After (Automated)

Two coordinated workflows run daily. One computes and stores health metrics; the other scores, ranks, and posts a digest to Slack.

### Workflow A — Metrics & Snapshots (15 nodes)

Computes health metrics for every active requirement and project, updates each record, and saves a dated snapshot for trend tracking.

**Step 1: The schedule triggers daily**
Runs automatically at a set time — no manual action needed.

**Step 2: All ongoing PDEV requirements are pulled**
Every active requirement is fetched from Airtable.

**Step 3: Metrics are computed per requirement**
Key indicators (days since update, status, completion %) are calculated and formatted for Airtable.

**Step 4: Each requirement record is updated**
The current health metrics are written back to the requirement in Airtable.

**Step 5: Metrics are aggregated and a daily snapshot is saved**
A summary is computed and a dated record is created — building up a history of daily data points.

**Step 6: Same process runs for projects**
Projects get the same treatment — metrics computed, records updated, and daily snapshot saved.

### Workflow B — Digest & Notification (9 nodes)

Fetches both PDEV and project records, scores and ranks them, then sends a formatted digest to Slack.

**Step 1: The schedule triggers daily**
Runs automatically — timed after the metrics workflow completes.

**Step 2: All active PDEV and project records are pulled**
Requirements and their associated projects are fetched from Airtable in parallel, then merged.

**Step 3: Records are parsed, normalized, scored, and ranked**
Each requirement is scored based on urgency, health, last update, and other factors. Results are sorted by priority.

**Step 4: A formatted digest is built**
The ranked results are turned into clean, readable Slack Block Kit messages with rankings and highlights.

**Step 5: The digest is posted to Slack**
The team sees a prioritized daily summary in their channel — before their first meeting.

---

## Impact

- **Consistent daily visibility** — the digest happens every day, no exceptions.
- **Objective scoring** — urgency is calculated, not guessed.
- **Faster prioritization** — the team knows where to focus before their first meeting.
- **Historical trend data** — see exactly when a requirement stalled or accelerated.
- **Early warning signals** — spot requirements going stale before they become problems.
- **Automated record-keeping** — no one has to remember to log daily status.
- **Enables weekly/monthly reporting** — the data is there when you need to report.
- **~20-30 minutes saved daily** — eliminates manual review, write-up, and record-keeping.
