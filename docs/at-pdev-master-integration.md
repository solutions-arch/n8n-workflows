# Master Integration — Three Systems in Sync
**[AT] PDEV Master Integration**

> Airtable, Bubble, and ClickUp stay perfectly aligned without anyone touching them.

**Status:** Active | **Systems:** ClickUp, Bubble, Airtable, Slack

---

## Before (Manual Process)

1. PDEV requirement data lives in Airtable, the internal portal runs on Bubble, and project management is in ClickUp.
1. When a requirement changes in Airtable, someone manually updates Bubble and ClickUp.
1. Creating a new project means logging into three separate systems and entering the same data.
1. Linking clients, POCs, and requirements across systems is tedious and error-prone.
1. Data drifts apart over time — what's in Airtable doesn't match what clients see in the portal.

---

## After (Automated)

When a PDEV record is updated in Airtable, all three systems sync automatically — projects, clients, POCs, and requirements are created and linked across Airtable, Bubble, and ClickUp.

**Step 1: A PDEV record is updated in Airtable**
Any change to a requirement triggers the sync process.

**Step 2: The system checks all three platforms**
It looks up existing clients, projects, and POCs across Airtable, Bubble, and ClickUp.

**Step 3: Missing records are created automatically**
If a client, project, or POC doesn't exist in Bubble or ClickUp, it's created.

**Step 4: Everything is linked together**
Client requirements are connected to the correct project, client, and POC in all systems.

**Step 5: IDs are synced back**
New record IDs are written back to Airtable so everything stays connected.

**Step 6: The team is notified**
A Slack message confirms the sync is complete.

---

## Impact

- **Single source of truth** — update Airtable once, all systems follow.
- **No manual data entry** across multiple platforms.
- **No data drift** — the portal always matches the internal records.
- **~15-20 minutes saved per update** — eliminates triple-entry across three systems.
