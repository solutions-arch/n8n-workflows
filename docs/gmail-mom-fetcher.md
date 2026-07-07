# Automated MoM Email Processing
**[Gmail] MoM Fetcher**

> Incoming MoM emails are read by AI, matched to the right project, and logged automatically.

**Status:** Active | **Systems:** Gmail, AI Agent, AI/LLM, Airtable

---

## Before (Manual Process)

1. MoM emails arrive from PEC members or clients.
1. Someone has to read each email and figure out which PDEV requirement it relates to.
1. They manually create a record in Airtable, linking it to the correct project.
1. If the requirement has moved (ongoing → parked → completed), they need to check the current status.
1. Emails sometimes get missed or filed incorrectly.

---

## After (Automated)

When a MoM email arrives in Gmail, an AI agent reads it, identifies the related requirement, and creates a record in Airtable — automatically routed to the correct status category.

**Step 1: A MoM email arrives in Gmail**
The system watches for incoming meeting minutes emails.

**Step 2: The email content is cleaned**
Signatures, formatting, and noise are stripped out to get clean text.

**Step 3: AI reads and analyzes the email**
An AI agent identifies: which requirement this relates to, key content, and relevant metadata.

**Step 4: The system matches it to a requirement**
It searches across ongoing, parked, outlier, and completed requirements to find the right match.

**Step 5: The MoM is logged in Airtable**
A record is created and linked to the correct requirement under its current status.

*Uses OpenAI GPT to analyze email content and match it to the correct PDEV requirement.*

---

## Impact

- **No manual email triage** — the AI handles reading and routing.
- **Accurate matching** — the AI cross-references against all requirement statuses.
- **No missed emails** — every qualifying MoM email is processed automatically.
- **~10 minutes saved per email** — eliminates read, search, and log cycle.
