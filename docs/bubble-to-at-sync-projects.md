# Project PE Assignment Sync
**[Bubble] Bubble to AT Sync [Projects]**

> When a PE is assigned in the Bubble portal, the assignment syncs to Airtable automatically — project and requirement records updated in one pass.

**Status:** Active | **Systems:** Bubble, Airtable

---

## Before (Manual Process)

1. PE assigned to a project in the Bubble portal.
1. Someone must manually update the same assignment in Airtable.
1. The requirement record also needs the PE linked — a second manual step.
1. Assignments drift between systems when someone forgets.

---

## After (Automated)

When a PE is assigned in Bubble, a webhook fires and syncs the assignment to both the project and requirement records in Airtable.

**Step 1: PE assigned in Bubble triggers webhook**
The portal fires a webhook the moment a PE is assigned to a project.

**Step 2: Matching project and PE looked up in Airtable**
The workflow searches Airtable's Projects and SV Support tables to find the corresponding records.

**Step 3: Records merged and matched**
The webhook data is merged with the Airtable lookup results.

**Step 4: Both project and requirement updated**
The PE is assigned to the project record and its parent requirement in Airtable — one pass, both records.

---

## Impact

- **No dual-entry** — assign once in Bubble, both systems follow.
- **PE assignments always consistent** across Bubble and Airtable.
- **Zero manual Airtable updates** for PE assignments.
