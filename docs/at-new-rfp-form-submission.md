# Automated RFP Processing Pipeline
**[AT] New RFP Form submission**

> A single form submission triggers the creation of up to 20+ records across three systems — in seconds.

**Status:** Active | **Systems:** Airtable, Gmail, Bubble

---

## Before (Manual Process)

1. A Request for Proposal (RFP) arrives via email or form.
1. Someone manually reads through it and extracts the company name, client contact, POC, and role requirements.
1. They check Airtable to see if the company/client/POC already exists — one by one.
1. If new, they create records for each. If existing, they link to the right ones.
1. For RFPs with multiple roles, they repeat this entire process per role.
1. They download attachments and upload them to the correct records.
1. They send confirmation emails manually.
1. The internal portal needs to be updated separately.
1. This entire process takes 30-60 minutes per RFP and is highly error-prone.

---

## After (Automated)

When an RFP form is submitted, the entire intake process happens automatically — from company creation to email confirmation to portal updates.

**Step 1: An RFP form is submitted**
The form captures company, client, POC, and role details in one submission.

**Step 2: Company is checked and created**
The system searches for the company. If it's new, a record is created. If it exists, it's linked — no duplicates.

**Step 3: Client contact is checked and created**
Same deduplication logic for the client contact — create or link.

**Step 4: Point of contact is checked and created**
The POC is matched or created and linked to the company and client.

**Step 5: Staffing requirements are created per role**
If the RFP has multiple positions, each role gets its own PDEV requirement — automatically split and created.

**Step 6: Attachments are downloaded and stored**
RFP documents (PDFs, etc.) are fetched from the form and attached to the correct records.

**Step 7: The internal portal is updated**
Each requirement is created in the Bubble portal with the right project and client links.

**Step 8: Confirmation emails are sent**
The submitter and relevant internal stakeholders receive automated emails.

---

## Impact

- **30-60 minutes → seconds** — the entire RFP intake process runs automatically.
- **Zero duplication** — every company, client, and POC is deduplicated before creation.
- **Multi-role handling** — RFPs with multiple positions are split and processed individually.
- **Attachments preserved** — documents are automatically stored against the right records.
- **Portal stays current** — the Bubble internal portal is updated instantly.
- **Consistent data** — no more mismatched records between Airtable and Bubble.
