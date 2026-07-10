// PDEV — Process Engineering Interface
// Migrated from n8n-workflows/docs/pdev-workflows-v2.html
import { edgeD } from "../map-engine.js";

export const meta = {
  key: "pdev",
  name: "Process Engineering Interface",
  shortName: "PDEV",
  eyebrow: "scale virtually · process engineering interface",
  cardLine: "Meeting documentation, client intake, and daily reporting, automated end to end.",
  lead: "Six stations, spanning 12 automated workflows (two powered by AI), handle meeting documentation, client intake, cross-system syncing, and daily reporting automatically, without manual data entry.",
  stationCount: 6,
  workflowCount: 12,
  aiPowered: true,
  keyMetric: "~45-60 min saved daily",
};

export const viewBox = "0 0 1340 620";

export const columnLabels = [
  { x: 115, y: 32, text: "TRIGGERS" },
  { x: 560, y: 50, text: "PROCESSING · BUILT BY SV" },
  { x: 1015, y: 26, text: "DESTINATIONS" },
];

export const nodes = {
  form: { x: 30, y: 52, w: 170, h: 50, title: "Intake Form", sub: "RFP form submitted", cls: "trigger", icon: "form" },
  record: { x: 30, y: 138, w: 170, h: 50, title: "Record Change", sub: "record updated", cls: "trigger", icon: "sync" },
  notetaker: { x: 30, y: 224, w: 170, h: 50, title: "AI Notetaker", sub: "meeting recording", cls: "trigger", icon: "mic" },
  email_in: { x: 30, y: 310, w: 170, h: 50, title: "Email Inbox", sub: "email trigger", cls: "trigger", icon: "envelope" },
  sched: { x: 30, y: 396, w: 170, h: 50, title: "Scheduler", sub: "daily cron", cls: "trigger", icon: "clock" },
  err: { x: 30, y: 482, w: 170, h: 50, title: "Error Trigger", sub: "workflow failure", cls: "trigger", icon: "warning" },
  dedup: { x: 460, y: 70, w: 200, h: 54, title: "Dedup & Build", sub: "company · client · POC", cls: "proc", icon: "gear" },
  sync_eng: { x: 460, y: 175, w: 200, h: 54, title: "Reconciler", sub: "detect · merge · resolve", cls: "proc", icon: "sync" },
  ai: { x: 460, y: 285, w: 200, h: 54, title: "Reasoning Engine", sub: "parse · synthesize", cls: "ai-node", icon: "brain" },
  compute: { x: 460, y: 400, w: 200, h: 54, title: "Trend Analyzer", sub: "score · snapshot · trend", cls: "proc", icon: "chart" },
  database: { x: 930, y: 42, w: 170, h: 50, title: "Database", sub: "create / update", cls: "dest", icon: "database" },
  portal: { x: 930, y: 128, w: 170, h: 50, title: "Portal", sub: "internal portal", cls: "dest", icon: "window" },
  task: { x: 930, y: 214, w: 170, h: 50, title: "Task Manager", sub: "project management", cls: "dest", icon: "checklist" },
  email_out: { x: 930, y: 300, w: 170, h: 50, title: "Email", sub: "send email", cls: "dest", icon: "envelope" },
  chat: { x: 930, y: 386, w: 170, h: 50, title: "Slack Notification", sub: "team notifications", cls: "dest", icon: "slack" },
  errorlog: { x: 930, y: 472, w: 170, h: 50, title: "Error Log", sub: "database storage", cls: "dest", icon: "document" },
};

export const edges = {
  e_form_dedup: { d: edgeD(nodes, "form", "r", "dedup", "l") },
  e_record_sync: { d: edgeD(nodes, "record", "r", "sync_eng", "l") },
  e_record_dedup: { d: edgeD(nodes, "record", "r", "dedup", "l", 0, 0, 100, 80) },
  e_notetaker_ai: { d: edgeD(nodes, "notetaker", "r", "ai", "l") },
  e_email_ai: { d: edgeD(nodes, "email_in", "r", "ai", "l") },
  e_sched_compute: { d: edgeD(nodes, "sched", "r", "compute", "l") },
  e_sched_ai: { d: edgeD(nodes, "sched", "r", "ai", "l", 0, 0, 140, 120) },
  e_err_compute: { d: edgeD(nodes, "err", "r", "compute", "l", 0, 0, 120, 100) },
  e_dedup_database: { d: edgeD(nodes, "dedup", "r", "database", "l") },
  e_dedup_portal: { d: edgeD(nodes, "dedup", "r", "portal", "l", 0, 0, 80, 60) },
  e_dedup_email_out: { d: edgeD(nodes, "dedup", "r", "email_out", "l", 0, 0, 110, 130) },
  e_sync_database: { d: edgeD(nodes, "sync_eng", "r", "database", "l", 0, 0, 110, 130) },
  e_sync_portal: { d: edgeD(nodes, "sync_eng", "r", "portal", "l") },
  e_sync_task: { d: edgeD(nodes, "sync_eng", "r", "task", "l", 0, 0, 80, 60) },
  e_sync_chat: { d: edgeD(nodes, "sync_eng", "r", "chat", "l", 0, 0, 110, 130) },
  e_ai_database: { d: edgeD(nodes, "ai", "r", "database", "l", 0, 0, 140, 170) },
  e_ai_email_out: { d: edgeD(nodes, "ai", "r", "email_out", "l") },
  e_ai_chat: { d: edgeD(nodes, "ai", "r", "chat", "l", 0, 0, 80, 60) },
  e_ai_errorlog: { d: edgeD(nodes, "ai", "r", "errorlog", "l", 0, 0, 100, 130) },
  e_ai_compute: { d: edgeD(nodes, "ai", "b", "compute", "t", 0, 0, 50, 50) },
  e_compute_database: { d: edgeD(nodes, "compute", "r", "database", "l", 0, 0, 150, 200) },
  e_compute_chat: { d: edgeD(nodes, "compute", "r", "chat", "l") },
  e_compute_task: { d: edgeD(nodes, "compute", "r", "task", "l", 0, 0, 130, 160) },
  e_compute_errorlog: { d: edgeD(nodes, "compute", "r", "errorlog", "l", 0, 0, 80, 60) },
  e_err_task: { d: edgeD(nodes, "err", "r", "task", "l", 0, 0, 160, 180) },
  e_err_errorlog: { d: edgeD(nodes, "err", "r", "errorlog", "l", 0, 0, 140, 140) },
  e_err_chat: { d: edgeD(nodes, "err", "r", "chat", "l", 0, 0, 180, 160) },
};

export const aiStack = {
  title: "AI models powering the intelligence layer",
  desc: "These stations call AI inference APIs to read, analyze, and generate structured output; they are not fixed, rule-based automations.",
  note: "These are the AI models powering the intelligence layer today. The solution works with any compatible AI provider.",
  vendors: [
    { label: "Mistral AI", letter: "M", colorVar: "--mistral" },
    { label: "OpenAI", letter: "O", colorVar: "--openai" },
    { label: "Anthropic Claude", letter: "C", colorVar: "--anthropic" },
  ],
};

export const useCases = {
  items: [
    {
      title: "Real estate brokerage: buyer lead intake",
      bullets: [
        "Buyer submits a \"request a showing\" form on the brokerage website",
        "System checks the CRM for an existing buyer record by email/phone",
        "If new: creates buyer record, links to the listing, assigns the agent covering that zip code",
        "Sends the buyer a confirmation text + the assigned agent an internal notification with the buyer's details",
        "Same mechanic as PDEV's \"form &rarr; dedup &rarr; create &rarr; notify,\" just against a different CRM and a different match key (zip code instead of PE assignment)",
      ],
    },
    {
      title: "Law firm: new matter intake",
      bullets: [
        "Prospective client fills an intake form",
        "System checks the case management tool for a conflict-of-interest match against existing clients/opposing parties",
        "If clear: creates the matter, assigns it to the right practice group attorney, auto-generates the engagement letter for e-signature",
        "Notifies the practice group channel that a new matter is open",
        "Same \"check before create, then fan out to the right destinations\" logic as PDEV's dedup engine, just with a conflict search instead of a company/client match",
      ],
    },
    {
      title: "Marketing agencies handling new client delivery",
      bullets: [
        "New client fills the agency's intake form: it automatically creates the client record, project, and folder across every tool the agency uses, then sends a branded welcome email",
        "Every kickoff/status call gets automatic meeting minutes posted straight to the client's channel, with action items already laid out",
        "The same AI pass reads client email threads to flag upsell opportunities or scope creep",
        "Campaign data from the client's ad platforms syncs into one place daily, feeding an automatic performance report",
        "If anything breaks in the pipeline, a ticket is created and the team is alerted before the client notices",
      ],
    },
  ],
  alternatives: {
    items: [
      {
        name: "Zapier",
        price: "$19.99-103.50/mo depending on tier/task volume.",
        note: "No native dedup primitive: the intake&rarr;dedup&rarr;multi-tool-record logic would still have to be hand-built with Filter/Paths steps, same lift as building it in n8n.",
      },
      {
        name: "Make.com",
        price: "$9-38/mo, credit-based.",
        note: "More flexible branching than Zapier via Data Stores, but still no turnkey dedup feature, custom scenario work either way.",
      },
      {
        name: "Fireflies.ai",
        price: "$10-39/seat/mo.",
        note: "AI meeting minutes + CRM push are built in from the $19/seat tier up, the closest off-the-shelf match for the meeting-minutes half. But it only processes call recordings; email-thread scanning for upsell/scope-creep signals isn't covered by any tier.",
      },
    ],
    closing: "The intake-dedup-and-sync half has no true off-the-shelf equivalent. The AI-meeting-minutes half is the closest thing to commoditized, but the upsell/scope-creep detection and full ad-performance rollup stay differentiated.",
  },
};

export const scenarios = [
  {
    key: "onboarding",
    label: "Client Onboarding",
    route: "Client Onboarding Pipeline",
    desc: "A single intake form submission checks for existing records to avoid duplicates, creates everything needed across systems, updates the internal portal, and sends a confirmation, automatically, in seconds.",
    stat: "106 nodes (3 workflows) · 30-60 min → seconds",
    executions30d: 17, // RFP Form Submission (8) + Create PDEV Requirement (3) + Create POC (6), Supabase workflow_executions
    hoursSaved30d: 39.07, // (8×284m + 3×16m + 6×4m) / 60
    chips: [{ type: "live", label: "Active" }, { type: "time", label: "106 nodes (3 workflows)" }],
    steps: [["n:form"], ["e:e_form_dedup"], ["n:dedup"], ["e:e_dedup_database", "e:e_dedup_portal", "e:e_dedup_email_out"], ["n:database", "n:portal", "n:email_out"]],
    before: [
      "Someone manually extracts company, client, and contact details",
      "Checks for duplicates one by one",
      "Creates records by hand",
      "Multi-role requests multiply the work",
      "30–60 minutes per request",
    ],
    after: [
      "Form submitted once",
      "All records created and deduplicated automatically",
      "Portal updated instantly, confirmation sent",
      "<strong>Seconds, zero manual intervention</strong>",
    ],
    impact: [
      "<strong>Time saved:</strong> 30–60 min → seconds per intake",
      "<strong>Cognitive load:</strong> No repetitive data entry, no risk of duplicates or missed records",
    ],
  },
  {
    key: "sync",
    label: "Cross-System Sync",
    route: "Cross-System Sync & Portal Integration",
    desc: "When a record changes anywhere (including team assignments), every connected system updates automatically to match, with a notification sent once it's done.",
    stat: "48 nodes (2 workflows) · ~15-20 min saved per update",
    executions30d: 20, // PDEV Master Integration (12) + Bubble→AT Sync Projects (8), Supabase workflow_executions
    hoursSaved30d: 19.4, // 12×97m / 60 — Bubble→AT Sync has no reliable per-run rate yet, excluded from hours (still counted in executions30d above)
    chips: [{ type: "live", label: "Active" }, { type: "time", label: "48 nodes (2 workflows)" }],
    steps: [["n:record"], ["e:e_record_sync"], ["n:sync_eng"], ["e:e_sync_database", "e:e_sync_portal", "e:e_sync_chat"], ["n:database", "n:portal", "n:chat"]],
    before: [
      "Changes require updating multiple systems manually",
      "Data drifts apart over time",
      "Assignments tracked inconsistently",
    ],
    after: [
      "Update once, all systems follow",
      "Team assignments synced automatically",
      "<strong>Notification sent on completion</strong>",
    ],
    impact: [
      "<strong>Time saved:</strong> 15–20 min per update",
      "<strong>Cognitive load:</strong> No dual-entry, no worry about systems being out of sync",
    ],
  },
  {
    key: "mom",
    label: "AI Meeting Minutes",
    route: "AI Meeting Minutes & Email Processing",
    isAI: true,
    desc: "Meetings are recorded and transcribed automatically, then the AI generates structured minutes with action items and distributes them by email, chat, and database record. The same AI also reads incoming meeting-related emails and matches them to the right project.",
    stat: "71 nodes (2 workflows) · AI-powered · 15-30 min + 10 min saved",
    executions30d: 137, // Gmail MoM Fetcher (90, Supabase) + PEC meetings (47, manually counted off the calendar Jun 9–Jul 8 — Supabase's 148 includes partial/non-end-to-end executions)
    hoursSaved30d: 129.77, // (90×51m + 47×68m) / 60
    chips: [{ type: "live", label: "Active" }, { type: "ai", label: "AI Agent" }, { type: "time", label: "71 nodes (2 workflows)" }],
    steps: [["n:notetaker", "n:email_in"], ["e:e_notetaker_ai", "e:e_email_ai"], ["n:ai"], ["e:e_ai_email_out", "e:e_ai_chat", "e:e_ai_database"], ["n:email_out", "n:chat", "n:database"]],
    before: [
      "Someone takes notes during meetings, splitting attention",
      "15–30 min writing minutes afterward",
      "MoM emails not tracked",
      "Insights buried in inboxes",
    ],
    after: [
      "AI generates structured minutes from every recorded meeting",
      "MoM emails automatically matched to the right project",
      "<strong>Everything stored and searchable</strong>",
    ],
    impact: [
      "<strong>Time saved:</strong> 15–30 min per meeting + 10 min per MoM email",
      "<strong>Cognitive load:</strong> No split attention during meetings, no manual email triage, no forgotten follow-ups",
    ],
  },
  {
    key: "insights",
    label: "AI Insights & Daily Report",
    route: "AI Insight Extraction & Daily Report",
    isAI: true,
    desc: "The AI scans every incoming client email and carefully reads it to understand key updates, red flags, and project signals. Each insight is matched to the correct client project and saved as a structured record. Every day, the AI then reviews all captured insights, identifies patterns and trends, and writes a narrative summary highlighting wins, risks, and items that need attention. A visual report card is generated and posted to the team automatically.",
    stat: "37 nodes (2 workflows) · AI-powered · ~10 min/email + 45-60 min daily",
    executions30d: 604, // Gmail Insights Fetcher (579) + Scheduled PDEV Insights (25), Supabase workflow_executions
    hoursSaved30d: 506.32, // (579×51m + 25×34m) / 60
    chips: [{ type: "live", label: "Active" }, { type: "ai", label: "AI Agent" }, { type: "time", label: "37 nodes (2 workflows)" }],
    steps: [["n:email_in"], ["e:e_email_ai"], ["n:ai"], ["e:e_ai_database", "e:e_ai_chat"], ["n:database", "n:chat"]],
    before: [
      "Client email insights not captured; signals buried in inboxes",
      "No structured record of client sentiment or updates",
      "Daily insight review done by hand, rarely consistent",
      "Synthesizing patterns is time-consuming; summary shared ad-hoc",
    ],
    after: [
      "AI scans every qualifying email, extracts updates, sentiment, project signals",
      "Matched to correct project and saved automatically",
      "Daily narrative summary written by AI with wins, risks, trends",
      "<strong>Visual report card posted to the team, every day</strong>",
    ],
    impact: [
      "<strong>Time saved:</strong> ~10 min per email + 45–60 min daily on reporting",
      "<strong>Cognitive load:</strong> No risk of missing important client signals; no one needs to drive the daily review; consistent reporting without effort",
    ],
  },
  {
    key: "health",
    label: "Health Digest & Metrics",
    route: "Daily Health Digest & Metrics",
    desc: "Every day, health metrics are computed for every active client project: urgency, recency, and overall health scored objectively. A prioritized digest is posted to the team, surfacing the projects that need attention first. Historical snapshots enable trend analysis over time.",
    stat: "24 nodes (2 workflows) · ~20-30 min saved daily",
    executions30d: 44, // Daily Scrubbing PDEV & Projects (22) + its Notifier (22), Supabase workflow_executions
    hoursSaved30d: 32.63, // (22×66m + 22×23m) / 60
    chips: [{ type: "live", label: "Active" }, { type: "time", label: "24 nodes (2 workflows)" }],
    steps: [["n:sched"], ["e:e_sched_compute"], ["n:compute"], ["e:e_compute_database", "e:e_compute_chat"], ["n:database", "n:chat"]],
    before: [
      "Someone manually reviews all active projects each morning",
      "Urgency assessed subjectively",
      "Some days it doesn't happen",
    ],
    after: [
      "Health metrics computed daily for every project",
      "Objective scoring, not guessing",
      "<strong>Ranked digest posted automatically, every day</strong>",
    ],
    impact: [
      "<strong>Time saved:</strong> 20–30 min daily",
      "<strong>Cognitive load:</strong> Consistent daily visibility without effort; objective scoring removes guesswork",
    ],
  },
  {
    key: "error",
    label: "Error Monitor",
    route: "Error Monitoring",
    desc: "When any workflow hits an issue, it's caught instantly: a ticket is filed, the error is logged, and the team is notified, all within seconds.",
    stat: "6 nodes · zero-delay detection",
    executions30d: 4, // PDev Error Trigger, Supabase workflow_executions
    chips: [{ type: "off", label: "Inactive" }, { type: "time", label: "6 nodes" }],
    steps: [["n:err"], ["e:e_err_task", "e:e_err_errorlog", "e:e_err_chat"], ["n:task", "n:errorlog", "n:chat"]],
    before: [
      "Failures noticed hours or days later",
      "Manual investigation",
    ],
    after: [
      "Instant detection",
      "Automatic ticket creation",
      "<strong>Team notification</strong>",
    ],
    impact: [
      "<strong>Zero-delay detection</strong>",
      "<strong>Full audit trail</strong> for pattern analysis",
    ],
  },
];
