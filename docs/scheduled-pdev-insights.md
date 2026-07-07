# Daily AI Insights Report
**[Scheduled] PDEV Insights**

> An AI reads all the day's insights, writes a narrative summary, and posts a visual report card to Slack.

**Status:** Active | **Systems:** AI/LLM, Airtable

---

## Before (Manual Process)

1. Each day, someone reviews all the insights logged across requirements.
1. They try to synthesize patterns — which clients are happy, which projects are at risk.
1. They write up a summary and share it with the team.
1. This rarely happens consistently because it's time-consuming.
1. There's no visual snapshot — just text that's hard to scan quickly.

---

## After (Automated)

Every day, the system aggregates all captured insights, has an AI write a narrative summary, renders it as a visual report card, and posts it to Slack.

**Step 1: The daily schedule triggers**
Runs automatically at the same time each day.

**Step 2: All insight records are gathered**
Every insight logged during the day is pulled from Airtable.

**Step 3: Data is aggregated per requirement**
Insights are grouped and summarized by requirement, project, and status.

**Step 4: Aggregated data is cleaned**
Metrics are computed and formatted for the AI to analyze.

**Step 5: AI generates a narrative summary**
An AI model reads all the aggregated data and writes a human-readable summary — highlighting wins, risks, and trends.

**Step 6: A visual report card is rendered**
The summary is turned into a designed image (HTML/CSS → PNG) for easy scanning.

**Step 7: The report is posted to Slack**
The team receives the visual report card and summary in their channel.

*Uses Mistral AI for data processing and Anthropic Claude for generating the narrative summary.*

---

## Impact

- **Consistent daily reporting** — happens every day without anyone driving it.
- **AI-synthesized narrative** — not just data, but an interpretation of what it means.
- **Visual report card** — easy to scan at a glance, shareable with leadership.
- **Pattern detection** — the AI can spot trends that manual review might miss.
- **~45-60 minutes saved daily** — eliminates the manual review-and-write cycle.
