# AI-Powered Client Insight Extraction
**[Gmail] Insights Fetcher**

> Every client email is scanned for project insights and logged automatically — nothing falls through the cracks.

**Status:** Active | **Systems:** Gmail, AI Agent, AI/LLM, Airtable

---

## Before (Manual Process)

1. Client emails contain valuable project updates, feedback, and signals.
1. Someone has to read each email and decide if it contains useful insights.
1. They figure out which requirement it relates to.
1. They manually create an insight record in Airtable.
1. Important updates are often buried in email threads and never logged.

---

## After (Automated)

When a client email arrives, an AI agent scans it for project insights, matches it to the right requirement, and creates an insight record in Airtable.

**Step 1: A client email arrives in Gmail**
The system monitors incoming emails for project-related content.

**Step 2: The email is filtered and cleaned**
Irrelevant emails are filtered out; qualifying ones are cleaned for analysis.

**Step 3: AI extracts insights from the email**
An AI agent reads the email and identifies: key updates, sentiment, decisions, and project-relevant signals.

**Step 4: The insight is matched to a requirement**
The system searches ongoing, outlier, parked, and completed requirements to find the right match.

**Step 5: An insight record is created**
A structured record is saved in Airtable with the extracted data, linked to the correct requirement.

*Uses OpenAI GPT to extract insights, sentiment, and key updates from client emails.*

---

## Impact

- **No lost insights** — every client email is analyzed, not just the ones someone remembers to check.
- **AI-powered extraction** — pulls out key information that a busy person might skim over.
- **Automatic routing** — insights are filed under the correct requirement without manual effort.
- **Richer project context** — the team has a running log of client signals for every requirement.
