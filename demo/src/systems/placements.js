// Placements — Automated VA Lifecycle Management
// Migrated from n8n-workflows/docs/placements-workflows-v2.html
import { edgeD } from "../map-engine.js";

export const meta = {
  key: "placements",
  name: "Placements Interface",
  shortName: "Placements",
  eyebrow: "scale virtually · placements interface",
  cardLine: "The full VA lifecycle — endorsement through onboarding, status tracking, and reporting.",
  lead: "Six stations — spanning 20 automated workflows, one powered by AI — handle the full VA lifecycle from endorsement through onboarding, status tracking, and daily reporting. No manual busywork, no missed steps, no forgotten follow-ups.",
  stationCount: 6,
  workflowCount: 20,
  aiPowered: true,
  keyMetric: "~35 min saved per VA event",
};

export const viewBox = "0 0 1340 560";

export const columnLabels = [
  { x: 115, y: 32, text: "TRIGGERS" },
  { x: 560, y: 32, text: "PROCESSING" },
  { x: 1015, y: 26, text: "DESTINATIONS" },
];

export const nodes = {
  wh_at: { x: 30, y: 52, w: 170, h: 50, title: "Record Change", sub: "status change", cls: "trigger", icon: "sync" },
  gmail_in: { x: 30, y: 138, w: 170, h: 50, title: "Email Inbox", sub: "new message", cls: "trigger", icon: "envelope" },
  sched: { x: 30, y: 224, w: 170, h: 50, title: "Scheduler", sub: "daily / weekly", cls: "trigger", icon: "clock" },
  wh_stp: { x: 30, y: 310, w: 170, h: 50, title: "Status Change", sub: "VA status change", cls: "trigger", icon: "sync" },
  err: { x: 30, y: 396, w: 170, h: 50, title: "Error Trigger", sub: "process failure", cls: "trigger", icon: "warning" },
  email_eng: { x: 460, y: 52, w: 200, h: 54, title: "Email Engine", sub: "build · send · follow-up", cls: "proc", icon: "envelope" },
  ai: { x: 460, y: 148, w: 200, h: 54, title: "AI Engine", sub: "read · understand · decide", cls: "ai-node", icon: "brain" },
  stp_mgr: { x: 460, y: 244, w: 200, h: 54, title: "Lifecycle Engine", sub: "route · notify · track", cls: "proc", icon: "gear" },
  metrics: { x: 460, y: 340, w: 200, h: 54, title: "Metrics Engine", sub: "score · rank · sync", cls: "proc", icon: "chart" },
  report: { x: 460, y: 436, w: 200, h: 54, title: "Report Builder", sub: "visual report cards", cls: "proc", icon: "document" },
  airtable: { x: 930, y: 42, w: 170, h: 50, title: "Database", sub: "create / update", cls: "dest", icon: "database" },
  gmail_out: { x: 930, y: 128, w: 170, h: 50, title: "Email", sub: "send message", cls: "dest", icon: "envelope" },
  slack: { x: 930, y: 214, w: 170, h: 50, title: "Team Chat", sub: "team notifications", cls: "dest", icon: "chat" },
  gcal: { x: 930, y: 300, w: 170, h: 50, title: "Calendar", sub: "events & invites", cls: "dest", icon: "calendar" },
  podio: { x: 930, y: 386, w: 170, h: 50, title: "External CRM", sub: "sync records", cls: "dest", icon: "sync" },
  clickup: { x: 930, y: 472, w: 170, h: 50, title: "Task Manager", sub: "create ticket", cls: "dest", icon: "checklist" },
  supa: { x: 1140, y: 472, w: 170, h: 50, title: "Error Log", sub: "audit trail", cls: "dest", icon: "document" },
};

export const edges = {
  e_wh_email: { d: edgeD(nodes, "wh_at", "r", "email_eng", "l") },
  e_gmail_ai: { d: edgeD(nodes, "gmail_in", "r", "ai", "l") },
  e_sched_metrics: { d: edgeD(nodes, "sched", "r", "metrics", "l") },
  e_sched_ai: { d: edgeD(nodes, "sched", "r", "ai", "l", 0, 0, 140, 120) },
  e_sched_report: { d: edgeD(nodes, "sched", "r", "report", "l", 0, 0, 110, 130) },
  e_stp_stp: { d: edgeD(nodes, "wh_stp", "r", "stp_mgr", "l") },
  e_wh_metrics: { d: edgeD(nodes, "wh_at", "r", "metrics", "l", 0, 0, 150, 130) },
  e_err_clickup: { d: edgeD(nodes, "err", "r", "clickup", "l", 0, 0, 140, 140) },
  e_err_supa: { d: edgeD(nodes, "err", "r", "supa", "l", 0, 0, 120, 100) },
  e_err_slack: { d: edgeD(nodes, "err", "r", "slack", "l", 0, 0, 160, 180) },
  e_email_gmail: { d: edgeD(nodes, "email_eng", "r", "gmail_out", "l") },
  e_email_at: { d: edgeD(nodes, "email_eng", "r", "airtable", "l", 0, 0, 80, 60) },
  e_email_slack: { d: edgeD(nodes, "email_eng", "r", "slack", "l", 0, 0, 110, 130) },
  e_email_gcal: { d: edgeD(nodes, "email_eng", "r", "gcal", "l", 0, 0, 140, 160) },
  e_ai_at: { d: edgeD(nodes, "ai", "r", "airtable", "l", 0, 0, 140, 170) },
  e_ai_report: { d: edgeD(nodes, "ai", "b", "report", "t", 0, 0, 50, 50) },
  e_stp_slack: { d: edgeD(nodes, "stp_mgr", "r", "slack", "l") },
  e_stp_gmail: { d: edgeD(nodes, "stp_mgr", "r", "gmail_out", "l", 0, 0, 130, 160) },
  e_metrics_at: { d: edgeD(nodes, "metrics", "r", "airtable", "l", 0, 0, 150, 200) },
  e_metrics_slack: { d: edgeD(nodes, "metrics", "r", "slack", "l", 0, 0, 130, 160) },
  e_metrics_podio: { d: edgeD(nodes, "metrics", "r", "podio", "l", 0, 0, 80, 60) },
  e_report_gmail: { d: edgeD(nodes, "report", "r", "gmail_out", "l", 0, 0, 180, 220) },
  e_report_slack: { d: edgeD(nodes, "report", "r", "slack", "l", 0, 0, 160, 200) },
  e_report_clickup: { d: edgeD(nodes, "report", "r", "clickup", "l", 0, 0, 80, 60) },
  e_report_supa: { d: edgeD(nodes, "report", "r", "supa", "l", 0, 0, 60, 40) },
};

export const aiStack = {
  title: "AI models powering the intelligence layer",
  desc: "These processes use AI to read, understand, and generate written output — they go beyond simple rule-based automation.",
  note: "These are the AI models powering the intelligence layer today — the solution works with any compatible AI provider.",
  vendors: [
    { label: "Groq", letter: "G", colorVar: "--groq" },
    { label: "OpenAI", letter: "O", colorVar: "--openai" },
  ],
};

export const scenarios = [
  {
    key: "vadata",
    label: "VA Data Management",
    route: "VA Data Management",
    desc: "When a VA's status changes — endorsed, placement-ready, stalled, or fast-tracked — the system handles endorsement emails, placement notifications, limbo flagging, and STP channel creation automatically.",
    stat: "44 steps (8 workflows) · ~35 min saved per lifecycle event",
    chips: [{ type: "live", label: "Active" }, { type: "time", label: "44 steps (8 workflows)" }],
    steps: [["n:wh_at", "n:wh_stp", "n:sched"], ["e:e_wh_email", "e:e_stp_stp", "e:e_sched_metrics"], ["n:email_eng", "n:stp_mgr", "n:metrics"], ["e:e_email_gmail", "e:e_email_slack", "e:e_stp_slack", "e:e_stp_gmail", "e:e_metrics_at"], ["n:gmail_out", "n:slack", "n:airtable"]],
    before: [
      "Endorsement emails written by hand with inconsistent formatting",
      "VAs not always told promptly when they reached placement-ready status",
      "Stalled candidates discovered during manual reviews, sometimes weeks late",
      "STP communication channels created manually with inconsistent naming",
      "Coordinators had to remember every follow-up for every VA",
    ],
    after: [
      "Endorsement emails built and sent automatically, formatted consistently every time",
      "Two-touch notification sequence for every placement-ready VA",
      "Stalled candidates flagged daily — no one slips through the cracks",
      "STP channels created automatically with consistent naming",
      "<strong>Every status change triggers the right action, every time</strong>",
    ],
    impact: [
      "<strong>Time saved:</strong> ~35 min per VA lifecycle event — no manual email drafting, no manual channel creation",
      "<strong>Cognitive load reduced:</strong> No forgotten follow-ups, no missed status changes, consistent process for every VA regardless of who's on shift",
    ],
  },
  {
    key: "pipeline",
    label: "Pipeline Management",
    route: "Pipeline Management",
    desc: "From interview scheduling through onboarding and CRM sync — calendar events created, the full email suite sent, external CRM synced, and a support channel opened, each triggered automatically as the placement moves forward, with no manual coordination between steps.",
    stat: "59 steps (4 workflows) · 30-45 min → seconds",
    chips: [{ type: "live", label: "Active" }, { type: "sys", label: "Integration" }, { type: "time", label: "59 steps (4 workflows)" }],
    steps: [["n:wh_at"], ["e:e_wh_email", "e:e_wh_metrics"], ["n:email_eng", "n:metrics"], ["e:e_email_gmail", "e:e_email_slack", "e:e_email_gcal", "e:e_email_at", "e:e_metrics_podio", "e:e_metrics_slack"], ["n:gmail_out", "n:slack", "n:gcal", "n:airtable", "n:podio"]],
    before: [
      "Calendar events created by hand with risk of wrong times or missing attendees",
      "Three separate onboarding messages sent manually — logistics, internal handoff, welcome note",
      "Support channels created and welcome messages written every time",
      "CRM records entered twice — once in the main system, once externally",
      "<strong>Total: 30–45 min per placement</strong>",
    ],
    after: [
      "Calendar events created automatically — no timezone mistakes, no missed attendees",
      "Each stage of onboarding fires automatically as it's reached — no one has to kick off the next step",
      "Support channel created and welcome message posted instantly",
      "External CRM synced in real time with success/failure notifications",
      "<strong>Seconds, zero manual coordination</strong>",
    ],
    impact: [
      "<strong>Time saved:</strong> 30–45 min → seconds per placement — no manual scheduling, no dual-entry",
      "<strong>Cognitive load reduced:</strong> Zero scheduling errors, no missed onboarding steps, both systems always in sync",
    ],
  },
  {
    key: "readiness",
    label: "Readiness & Reporting",
    route: "VA Readiness & Reporting",
    desc: "Automated weekly readiness check-ins for VAs, scheduled STP pipeline reports with visual report cards, and instant cancellation alerts — all delivered to stakeholders on a set cadence.",
    stat: "46 steps (3 workflows) · weekly + daily cadence",
    chips: [{ type: "live", label: "Active" }, { type: "time", label: "46 steps (3 workflows)" }],
    steps: [["n:sched"], ["e:e_sched_metrics", "e:e_sched_report"], ["n:metrics", "n:report"], ["e:e_metrics_at", "e:e_metrics_slack", "e:e_report_gmail", "e:e_report_slack"], ["n:gmail_out", "n:slack", "n:airtable"]],
    before: [
      "No structured way to check in with VAs about their readiness",
      "No daily or weekly reporting existed for STP candidates",
      "Cancellations communicated informally — the team sometimes found out days later",
      "Getting a pipeline update meant someone stopping to compile one by hand",
    ],
    after: [
      "VAs get a weekly automated check-in — responses collected centrally",
      "Visual report cards generated on daily and weekly cadences automatically",
      "Cancellations trigger instant team notifications — zero delay",
      "<strong>Consistent reporting cadence — no one has to remember to ask</strong>",
    ],
    impact: [
      "<strong>New capabilities:</strong> STP reporting and structured readiness tracking didn't exist before",
      "<strong>Cognitive load reduced:</strong> Consistent weekly check-in and reporting cadence without manual outreach or follow-up",
    ],
  },
  {
    key: "ai_insights",
    label: "AI Insights & Daily Report",
    route: "AI Insights & Daily Report",
    isAI: true,
    desc: "Every client reply to a candidate shortlist is read by the AI — it understands the intent (accept, reject, or request for more info) and updates the candidate record automatically. No reply goes unnoticed. At the end of each shift, the AI reviews all active placement records, writes an executive summary of the day's activity — wins, risks, and pipeline health — and delivers a visual report card to stakeholders.",
    stat: "27 steps (2 workflows) · AI-powered · 100% capture rate",
    chips: [{ type: "live", label: "Active" }, { type: "ai", label: "AI Engine" }, { type: "time", label: "27 steps (2 workflows)" }],
    steps: [["n:gmail_in", "n:sched"], ["e:e_gmail_ai", "e:e_sched_ai"], ["n:ai"], ["e:e_ai_at", "e:e_ai_report"], ["n:airtable", "n:report"], ["e:e_report_gmail", "e:e_report_slack"], ["n:gmail_out", "n:slack"]],
    before: [
      "Coordinators manually checked for client replies throughout the day",
      "Every reply had to be read, interpreted, and typed into the candidate record by hand",
      "Replies sometimes missed or delayed, leaving candidates waiting",
      "No daily placement summary existed — getting an update meant someone stopping to compile one",
    ],
    after: [
      "Every client reply captured and processed automatically — intent understood instantly",
      "Candidate records update themselves — no typing required",
      "Executive summary written automatically at the end of every shift",
      "<strong>100% capture rate on replies + net-new daily reporting capability</strong>",
    ],
    impact: [
      "<strong>Time saved:</strong> ~10 min per reply + net-new end-of-shift reporting",
      "<strong>Cognitive load reduced:</strong> No split attention monitoring inboxes, no candidates left in limbo, consistent end-of-shift visibility for leadership",
    ],
  },
  {
    key: "digest",
    label: "Health Digest & Metrics",
    route: "Daily Health Digest",
    desc: "Health metrics are computed daily for every active placement — scored objectively by urgency, not subjective review. A prioritized digest is posted to the team every morning, surfacing the placements that need attention first.",
    stat: "30 steps (2 workflows) · ~20-30 min saved daily",
    chips: [{ type: "live", label: "Active" }, { type: "time", label: "30 steps (2 workflows)" }],
    steps: [["n:sched"], ["e:e_sched_metrics"], ["n:metrics"], ["e:e_metrics_at", "e:e_metrics_slack"], ["n:airtable", "n:slack"]],
    before: [
      "Someone manually reviewed every active placement each morning",
      "Urgency assessed subjectively — inconsistent from person to person",
      "Some days the review didn't happen at all, and issues slipped through",
    ],
    after: [
      "Health scores are calculated automatically every day for every active placement",
      "A prioritized summary is shared with the team every morning",
      "<strong>The digest happens every day — no exceptions</strong>",
    ],
    impact: [
      "<strong>Time saved:</strong> ~20-30 min daily",
      "<strong>Cognitive load reduced:</strong> Objective scoring removes guesswork — consistent visibility, no missed mornings",
    ],
  },
  {
    key: "error",
    label: "Error Monitor",
    route: "Error Monitoring",
    desc: "When any process encounters an issue, it's caught instantly — a ticket is created, the issue is logged, and the team is alerted, all within seconds.",
    stat: "6 steps · zero-delay detection",
    chips: [{ type: "off", label: "Inactive" }, { type: "time", label: "6 steps" }],
    steps: [["n:err"], ["e:e_err_clickup", "e:e_err_supa", "e:e_err_slack"], ["n:clickup", "n:supa", "n:slack"]],
    before: [
      "Failures noticed hours or days later, often by accident",
      "Manual investigation and manual ticket creation for every issue",
      "No centralized history of what went wrong and when",
    ],
    after: [
      "Failures are caught the instant they happen",
      "A ticket is created and the issue is logged automatically",
      "The team is alerted within seconds",
    ],
    impact: [
      "<strong>Zero-delay detection</strong> — no risk of a missed failure",
      "<strong>Full audit trail</strong> for pattern analysis over time",
    ],
  },
];
