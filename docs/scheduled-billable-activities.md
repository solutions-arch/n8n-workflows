# Billable Activities Tracker
**[Scheduled] Billable Activities**

> Time logs are fetched, cross-referenced with clients, contractors, and requirements, and turned into billable activity records — automatically.

**Status:** Active | **Systems:** Bubble (API), Airtable

---

## Before (Manual Process)

1. Time logs pulled from the Bubble portal manually.
1. Each log cross-referenced with the correct client, contractor, and PDEV requirement — by hand.
1. Entries deduplicated manually to avoid double-counting.
1. Billable activity records created one at a time in Airtable.

---

## After (Automated)

A scheduled workflow fetches time logs from the Bubble portal API, cross-references them with Airtable data, deduplicates, and creates billable activity records.

**Step 1: Schedule triggers automatically**
Runs on a set schedule — can also be triggered manually.

**Step 2: Time logs fetched from Bubble portal API**
Support activity and time log data pulled via HTTP requests.

**Step 3: Clients, contractors, and requirements looked up**
Each entity type is searched in Airtable and deduplicated (unique clients, unique contractors, unique requirements).

**Step 4: Data merged and cross-referenced**
Time logs are matched to the correct client, contractor, and requirement through a multi-stage merge pipeline.

**Step 5: Billable activity records created**
Final merged records are written to the Billable Activities table in Airtable.

---

## Impact

- **Automated billing reconciliation** — no manual cross-referencing.
- **No double-counting** — deduplication built in.
- **Complete billable activity tracking** from real time-log data.
