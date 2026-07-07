# PDEV Workflow Demos

Documentation for demo videos — each workflow's manual step being replaced and the automated flow.

---

## 1. PDev Error Trigger

**Status:** Inactive | **Nodes:** 6

### Manual Step Being Replaced

Manually monitoring workflow failures, creating bug tickets in ClickUp, logging error details in Supabase, and notifying the team on Slack.

### Flow

```
⚡ Error Trigger (n8n catches a workflow failure)
  → [Code] Normalize Bug Metadata
  → [Supabase] Log error record
  → [ClickUp] Create bug ticket (per folder)
  → [Supabase] Update row with ticket reference
  → [Slack] Notify team
```

### Systems

Supabase, ClickUp, Slack

---

## 2. [AT] Create PDEV Requirement

**Status:** Active | **Nodes:** 5

### Manual Step Being Replaced

Manually looking up project and client IDs in Airtable, then creating the corresponding client requirement record in Bubble.

### Flow

```
⚡ Webhook (triggered from Airtable automation)
  → [Airtable] Get Bubble Client ID
  → [Airtable] Get Bubble Project ID
  → [Bubble] Create Client Requirement
  → [Airtable] Write back Client Requirement ID
```

### Systems

Airtable, Bubble

---

## 3. [AT] Create POC

**Status:** Active | **Nodes:** 6

### Manual Step Being Replaced

Manually checking if a POC (point of contact) already exists in Bubble, creating the record if not, and linking it to the correct client requirement.

### Flow

```
⚡ Webhook (triggered from Airtable)
  → [Bubble] Fetch existing POC
  → [Logic] POC already exists?
    ├─ Yes → skip creation
    └─ No  → [Bubble] Create POC record
             → [Airtable] Update POC Unique ID
             → [Bubble] Link POC to Client Requirement
```

### Systems

Airtable, Bubble

---

## 4. [AT] New RFP Form Submission

**Status:** Active | **Nodes:** 95

### Manual Step Being Replaced

Manually receiving RFP emails, copying client/company/POC details into Airtable, deduplicating records, creating requirements in Bubble, forwarding attachments — all done by hand per submission.

### Flow

```
⚡ Webhook (RFP form submitted)
  → [Logic] Company & Client already exist?
  │
  ├─ [Code] Build Company Object
  ├─ [Code] Build Client Object
  ├─ [Code] Build POC Object
  ├─ [Code] Build PDEV Object
  ├─ [Code] Build Email Object
  │
  → [Airtable] Dedupe Check — Company
    ├─ Exists → link to project
    └─ New    → [Airtable] Create Company
  → [Airtable] Dedupe Check — Client
    ├─ Exists → link to project
    └─ New    → [Airtable] Create Client Record
  → [Airtable] Dedupe Check — POC
    ├─ Exists → link to project
    └─ New    → [Airtable] Create POC Record
  → [Airtable] Dedupe Check — PDEV Requirement
    ├─ Exists → update existing
    └─ New    → [Airtable] Create PDEV Record
  │
  → [Code] Split into Roles (if multiple positions)
    → For each role:
      → [Airtable] Create PDEV record
      → [Airtable] Get Bubble Project/Client IDs
      → [Bubble] Create Client Requirement
      → [Airtable] Write back Requirement ID
  │
  → [HTTP] Fetch RFP Attachments (PDF links)
  → [Airtable] Save RFP Attachments
  → [Gmail] Send confirmation/notification emails
```

### Systems

Airtable (42 nodes), Bubble, Gmail, HTTP

---

## 5. [AT] PDEV Master Integration

**Status:** Active | **Nodes:** 42

### Manual Step Being Replaced

Manually syncing PDEV requirement data between Airtable, Bubble, and ClickUp — creating projects, linking clients/POCs, and ensuring all systems reflect the same state.

### Flow

```
⚡ Webhook (triggered on PDEV record update)
  → [Wait] Delay (let dependent data settle)
  → [ClickUp] Get folders (project structure)
  → [Code] Parse folder metadata
  │
  → [Bubble] Get Clients
    ├─ Exists → use existing
    └─ Empty  → [Bubble] Create Client
               → [Airtable] Write back Client ID
  │
  → [Bubble] Get PDev Project
    ├─ Exists → use existing
    └─ Empty  → [Bubble] Create Project
               → [Airtable] Write back Project ID
  │
  → [Bubble] Get POC
    ├─ Exists → use existing
    └─ Empty  → [Bubble] Create POC
               → [Airtable] Write back POC ID
  │
  → [Code] Split PDEV Requirements
  → [Loop] For each requirement:
    → [Airtable] Fetch Requirement
    → [Bubble] Fetch/Create Client Requirement
    → [Bubble] Link Client, POC, and Project to Requirement
    → [Bubble] Link Requirement to Project
  │
  → [Slack] Notify completion
```

### Systems

Airtable, Bubble, ClickUp, Slack

---

## 6. [Bubble] Bubble to AT Sync [Clients]

**Status:** Inactive (Paused/Retired) | **Nodes:** 5

### Manual Step Being Replaced

Manually syncing client records from the Bubble app back to Airtable to keep both systems in sync.

### Flow

```
⚡ Webhook (Bubble client record changes)
  → [Airtable] Search for matching record
  → [Merge] Combine Bubble + Airtable data
  → [Code] Transform/map fields
  → [HTTP] Push update to Airtable
```

### Systems

Bubble, Airtable

---

## 7. Daily Scrubbing Notifier (PDEV)

**Status:** Active | **Nodes:** 9

### Manual Step Being Replaced

Manually reviewing all active PDEV requirements daily, scoring them by urgency/health, and writing a daily digest message for the Slack channel.

### Flow

```
⚡ Schedule Trigger (daily)
  → [Set] Load config/environment vars
  → [Airtable] Fetch PDEV records
  → [Airtable] Fetch Project records
  → [Merge] Combine PDEV + Project data
  → [Code] Parse & Normalize fields
  → [Code] Score & Rank by urgency
  → [Code] Build Slack Block Kit message
  → [Slack] Send daily digest
```

### Systems

Airtable, Slack

### Output Example

Daily Slack message with scored/ranked PDEV requirements showing health status.

---

## 8. Daily Scrubbing (PDEV & Projects)

**Status:** Active | **Nodes:** 15

### Manual Step Being Replaced

Manually computing daily metrics (status changes, updates) for every PDEV requirement and project, then logging those snapshots in Airtable for historical tracking.

### Flow

```
⚡ Schedule Trigger (daily)
  → [Airtable] Fetch ongoing PDEV requirements
  → [Airtable] Fetch Projects
  │
  ├─ PDEV Branch:
  │  → [Loop] For each PDEV record
  │    → [Code] Compute daily keys/metrics
  │    → [Code] Aggregate PDEV metrics
  │    → [Airtable] Update PDEV record
  │    → [Airtable] Create daily PDEV snapshot
  │
  └─ Projects Branch:
     → [Loop] For each Project
       → [Code] Compute project keys/metrics
       → [Code] Aggregate project metrics
       → [Airtable] Update Project record
       → [Airtable] Create daily Projects snapshot
```

### Systems

Airtable

---

## 9. [Fathom] PEC MoM Generator

**Status:** Active | **Nodes:** 48

### Manual Step Being Replaced

Manually watching Fathom call recordings, writing up minutes of the meeting (MoM), identifying action items, and emailing them to clients and internal teams.

### Flow

```
⚡ Webhook (one per PEC member: Jesy, Fiona, Alex, JK, Ken, Aja, Chi, Ella, Marc)
  → [Set] Attach member metadata (name, role, email)
  → [Logic] Internal or External transcriber?
  │
  ├─ Internal PEC (IPEC):
  │  → [Code] Clean transcript
  │  → [Supabase] Check for existing transcript
  │  → [AI Agent — Gemini/Mistral] Generate MoM
  │    - Extracts: attendees, agenda, discussion points, action items, decisions
  │  → [Code] Parse agent output (IPEC format)
  │
  └─ External/Full PEC (FPEC):
     → [Code] Clean transcript
     → [AI Agent — Gemini/Mistral] Generate MoM
     → [Code] Parse agent output (FPEC format)
  │
  → [Merge] Combine results
  → [Code] Fetch email list from client records
  → [Airtable] Look up client contacts
  → [Supabase] Store MoM record
  → [Gmail] Email MoM to clients + internal team
  → [Slack] Post MoM summary to channel
```

### Systems

Fathom (webhooks), Supabase, Airtable, Gmail, Slack

### AI Models Used

Google Gemini, Mistral Cloud

---

## 10. [Gmail] MoM Fetcher

**Status:** Active | **Nodes:** 23

### Manual Step Being Replaced

Manually reading MoM emails from PEC members, identifying which PDEV requirement they relate to, and logging them in Airtable under the correct project.

### Flow

```
⚡ Gmail Trigger (new MoM email received)
  → [Code] Clean email content
  → [Airtable] Fetch ongoing PEC records
  → [AI Agent — OpenAI] Analyze email
    - Extracts: requirement match, status, key info
  → [Airtable] Search for matching PE (Process Engineer)
  │
  → [Logic] Route by requirement status:
    ├─ Ongoing   → [Set] Set Requirement ID → [Airtable] Log MoM
    ├─ Outlier   → [Set] Set Requirement ID → [Airtable] Log MoM
    ├─ Parked    → [Set] Set Requirement ID → [Airtable] Log MoM
    └─ Completed → [Set] Set Requirement ID → [Airtable] Log MoM
  │
  → [Logic] Sender not in system?
    → [Airtable] Search alternate PE records
  → [Merge] Consolidate
  → [Airtable] Create MoM record
```

### Systems

Gmail, Airtable

### AI Models Used

OpenAI (GPT)

---

## 11. [Gmail] Insights Fetcher

**Status:** Active | **Nodes:** 24

### Manual Step Being Replaced

Manually reading client emails for project insights/updates, figuring out which requirement they belong to, and logging them as insight records in Airtable.

### Flow

```
⚡ Gmail Trigger (new insight email received)
  → [Logic] Filter qualifying emails
  → [Code] Clean + filter email content
  → [AI Agent — OpenAI] Extract insights
    - Identifies: requirement context, sentiment, key updates
  → [Code] Parse LLM output
  → [Airtable] Search ongoing PEC records
  → [Airtable] Match to Process Engineer
  │
  → [Logic] Route by requirement status:
    ├─ Ongoing   → [Set] Set Requirement ID
    ├─ Outlier   → [Set] Set Requirement ID
    ├─ Parked    → [Set] Set Requirement ID
    └─ Completed → [Set] Set Requirement ID
  │
  → [Merge] Consolidate matched requirement
  → [Airtable] Create Insights Record
```

### Systems

Gmail, Airtable

### AI Models Used

OpenAI (GPT)

---

## 12. [Scheduled] PDEV Insights

**Status:** Active | **Nodes:** 13

### Manual Step Being Replaced

Manually aggregating weekly PDEV insights across all requirements, writing a summary report, and posting it to Slack for the team.

### Flow

```
⚡ Schedule Trigger (weekly)
  → [Airtable] Fetch all insight records
  → [Merge] Combine with requirement data
  → [Code] Compute per-requirement summaries
  → [Airtable] Update aggregated fields
  → [Aggregate] Consolidate all insights
  → [Code] Clean aggregated data
  → [LLM — Anthropic Claude] Generate narrative summary
  → [Code] Clean LLM output
  → [Image Render] Generate visual report card (HTML/CSS → Image)
  → [HTTP → Slack] Post image + summary to Slack channel
```

### Systems

Airtable, Slack

### AI Models Used

Mistral Cloud (embedding/pre-processing), Anthropic Claude (narrative summary)

### Output

Visual report card image posted to Slack with AI-generated narrative of the week's PDEV insights.
