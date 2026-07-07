# Client Data Reverse Sync (Bubble → Airtable)
**[Bubble] Bubble to AT Sync [Clients]**

> Changes made in the internal portal flow back to internal records automatically.

**Status:** Inactive | **Systems:** Airtable

*Currently paused/retired.*

---

## Before (Manual Process)

1. When a client's information is updated in the Bubble portal, the internal Airtable records become stale.
1. Someone has to manually check for portal changes and copy them back into Airtable.
1. This step is often forgotten, leading to mismatched records.

---

## After (Automated)

When client data changes in the Bubble portal, the update is automatically synced back to Airtable.

**Step 1: A client record changes in the Bubble portal**
A client or internal user updates information through the portal.

**Step 2: The system finds the matching Airtable record**
It searches for the corresponding record in Airtable.

**Step 3: Data is transformed and mapped**
Field names and formats are aligned between the two systems.

**Step 4: Airtable is updated**
The internal record is updated to match the portal.

---

## Impact

- **Bi-directional sync** — changes flow both ways, not just from Airtable to Bubble.
- **Always current** — internal records reflect what clients see and update.
- **No forgotten updates** — the sync is automatic, not dependent on someone remembering.
