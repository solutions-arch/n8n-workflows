// LinkedIn Outreach — Automated Campaign Operations
// Migrated from n8n-workflows/docs/linkedin-outreach-workflows.html
import { edgeD } from "../map-engine.js";

export const meta = {
  key: "linkedin",
  name: "LinkedIn Outreach",
  shortName: "LinkedIn Outreach",
  eyebrow: "scale virtually · linkedin outreach",
  cardLine: "Reply classification, booking capture, and campaign reporting across multi-client outreach.",
  lead: "Four stations — spanning 8 automated workflows, one powered by AI — classify prospect replies, capture meeting bookings, report campaign performance, and manage system operations across multi-client LinkedIn outreach campaigns.",
  stationCount: 4,
  workflowCount: 8,
  aiPowered: true,
  keyMetric: "~15-20 min saved daily",
};

export const viewBox = "0 0 1340 520";

export const columnLabels = [
  { x: 115, y: 32, text: "TRIGGERS" },
  { x: 560, y: 62, text: "PROCESSING" },
  { x: 1015, y: 38, text: "DESTINATIONS" },
];

export const nodes = {
  inbox: { x: 30, y: 50, w: 170, h: 50, title: "Outreach Inbox", sub: "reply received", cls: "trigger", icon: "envelope" },
  webhook: { x: 30, y: 145, w: 170, h: 50, title: "Booking Event", sub: "webhook trigger", cls: "trigger", icon: "calendar" },
  sched: { x: 30, y: 240, w: 170, h: 50, title: "Scheduler", sub: "daily cron", cls: "trigger", icon: "clock" },
  campaign_u: { x: 30, y: 335, w: 170, h: 50, title: "Campaign Update", sub: "client status change", cls: "trigger", icon: "gear" },
  err: { x: 30, y: 430, w: 170, h: 50, title: "Error Trigger", sub: "process failure", cls: "trigger", icon: "warning" },
  ai: { x: 460, y: 80, w: 200, h: 54, title: "AI Engine", sub: "classify intent", cls: "ai-node", icon: "brain" },
  validator: { x: 460, y: 185, w: 200, h: 54, title: "Lead Validator", sub: "warm · dedup · log", cls: "proc", icon: "checklist" },
  campaign: { x: 460, y: 290, w: 200, h: 54, title: "Campaign Engine", sub: "fetch · aggregate", cls: "proc", icon: "chart" },
  wfmgr: { x: 460, y: 395, w: 200, h: 54, title: "Workflow Manager", sub: "activate · deactivate", cls: "proc", icon: "gear" },
  sheets: { x: 930, y: 55, w: 170, h: 50, title: "Tracking Sheet", sub: "log results", cls: "dest", icon: "table" },
  chat: { x: 930, y: 170, w: 170, h: 50, title: "Team Chat", sub: "notifications", cls: "dest", icon: "chat" },
  task: { x: 930, y: 290, w: 170, h: 50, title: "Task Manager", sub: "create ticket", cls: "dest", icon: "checklist" },
  errorlog: { x: 930, y: 400, w: 170, h: 50, title: "Error Log", sub: "audit trail", cls: "dest", icon: "document" },
};

export const edges = {
  e_inbox_ai: { d: edgeD(nodes, "inbox", "r", "ai", "l") },
  e_wh_validator: { d: edgeD(nodes, "webhook", "r", "validator", "l") },
  e_sched_campaign: { d: edgeD(nodes, "sched", "r", "campaign", "l") },
  e_cu_wfmgr: { d: edgeD(nodes, "campaign_u", "r", "wfmgr", "l") },
  e_ai_sheets: { d: edgeD(nodes, "ai", "r", "sheets", "l") },
  e_ai_chat: { d: edgeD(nodes, "ai", "r", "chat", "l", 0, 0, 110, 120) },
  e_validator_sheets: { d: edgeD(nodes, "validator", "r", "sheets", "l", 0, 0, 130, 150) },
  e_validator_chat: { d: edgeD(nodes, "validator", "r", "chat", "l") },
  e_campaign_sheets: { d: edgeD(nodes, "campaign", "r", "sheets", "l", 0, 0, 160, 190) },
  e_campaign_chat: { d: edgeD(nodes, "campaign", "r", "chat", "l", 0, 0, 130, 150) },
  e_wfmgr_chat: { d: edgeD(nodes, "wfmgr", "r", "chat", "l", 0, 0, 170, 200) },
  e_err_task: { d: edgeD(nodes, "err", "r", "task", "l", 0, 0, 140, 130) },
  e_err_errorlog: { d: edgeD(nodes, "err", "r", "errorlog", "l") },
  e_err_chat: { d: edgeD(nodes, "err", "r", "chat", "l", 0, 0, 180, 210) },
};

export const aiStack = {
  title: "AI model powering the classification layer",
  desc: "This process uses AI to read, understand, and classify prospect replies — it goes beyond simple rule-based automation.",
  note: "This is the AI model powering the classification layer today — the solution works with any compatible AI provider.",
  vendors: [
    { label: "Anthropic Claude", letter: "C", colorVar: "--anthropic" },
  ],
};

export const scenarios = [
  {
    key: "ai_classify",
    label: "AI Reply Classification",
    route: "AI Reply Classification",
    isAI: true,
    desc: "When a prospect replies via the outreach platform, the AI reads the message and classifies intent — interested, not interested, out of office, or requesting more info. The result is logged and the team is notified instantly.",
    stat: "12 steps · AI-powered · 100% capture rate",
    chips: [{ type: "live", label: "Active" }, { type: "ai", label: "AI Engine" }, { type: "time", label: "12 steps" }],
    steps: [["n:inbox"], ["e:e_inbox_ai"], ["n:ai"], ["e:e_ai_sheets", "e:e_ai_chat"], ["n:sheets", "n:chat"]],
    before: [
      "Replies read and classified manually by team members",
      "Inconsistent classification — different people categorized differently",
      "Some replies missed or delayed, especially during high-volume campaigns",
      "No centralized record of classification decisions",
    ],
    after: [
      "Every reply classified automatically by AI — consistent categories every time",
      "Classification logged to tracking sheets instantly",
      "Team notified with the result in real time",
      "<strong>100% capture rate — no reply goes unclassified</strong>",
    ],
    impact: [
      "<strong>Time saved:</strong> ~3-5 min per reply — no manual reading and categorizing",
      "<strong>Cognitive load reduced:</strong> No inconsistent classifications, no missed replies, no split attention monitoring inboxes",
    ],
  },
  {
    key: "booking",
    label: "Meeting Booking Tracker",
    route: "Meeting Booking Tracker",
    desc: "When a prospect books a meeting, the system captures the booking, validates the lead against warm-lead and DC booked lists, logs it to the tracking sheets, and sends a real-time notification.",
    stat: "27 steps (3 workflows) · ~5-10 min saved per booking",
    chips: [{ type: "live", label: "Active" }, { type: "time", label: "27 steps (3 workflows)" }],
    steps: [["n:webhook"], ["e:e_wh_validator"], ["n:validator"], ["e:e_validator_sheets", "e:e_validator_chat"], ["n:sheets", "n:chat"]],
    before: [
      "Bookings manually checked and logged from the scheduling platform",
      "No automated validation against warm leads or previously contacted lists",
      "Data scattered across sheets with inconsistent formatting",
      "Team notified informally, sometimes hours after a booking",
    ],
    after: [
      "Every booking captured, validated, and logged instantly",
      "Each client campaign tracked separately with consistent format",
      "<strong>Real-time team notification the moment a booking comes in</strong>",
    ],
    impact: [
      "<strong>Time saved:</strong> ~5-10 min per booking — no manual logging or cross-referencing",
      "<strong>Cognitive load reduced:</strong> Zero missed bookings, no manual dedup, consistent tracking across all clients",
    ],
  },
  {
    key: "reporting",
    label: "Daily Campaign Reporting",
    route: "Daily Campaign Reporting",
    desc: "Every morning, the system connects to the outreach platform, fetches campaign statistics for all active clients, aggregates the data per client, and updates the daily stats sheet. A summary notification is posted to the team — ready for review before the day starts.",
    stat: "14 steps · ~15-20 min saved daily",
    chips: [{ type: "live", label: "Active" }, { type: "time", label: "14 steps" }],
    steps: [["n:sched"], ["e:e_sched_campaign"], ["n:campaign"], ["e:e_campaign_sheets", "e:e_campaign_chat"], ["n:sheets", "n:chat"]],
    before: [
      "Campaign stats pulled manually from the outreach platform for each client",
      "Data aggregated by hand into spreadsheets",
      "Reporting inconsistent — some days it didn't happen at all",
      "No centralized view of multi-client campaign performance",
    ],
    after: [
      "Stats fetched automatically every morning for all active clients",
      "Data aggregated per client and upserted into the daily stats sheet",
      "Summary notification posted automatically — consistent daily cadence",
      "<strong>Multi-client performance visible before the day starts</strong>",
    ],
    impact: [
      "<strong>Time saved:</strong> ~15-20 min daily — no manual platform login or copy-paste",
      "<strong>Cognitive load reduced:</strong> Consistent morning reporting without effort — no risk of missed days",
    ],
  },
  {
    key: "sysops",
    label: "System Operations",
    route: "System Operations",
    desc: "When a client campaign status changes, the corresponding workflow is activated or deactivated automatically. Errors are caught instantly with automatic ticket creation, logging, and team alerts.",
    stat: "16 steps (3 workflows) · single source of truth",
    chips: [{ type: "live", label: "Active" }, { type: "sys", label: "Integration" }, { type: "time", label: "16 steps (3 workflows)" }],
    steps: [["n:campaign_u", "n:err"], ["e:e_cu_wfmgr", "e:e_err_task", "e:e_err_errorlog", "e:e_err_chat"], ["n:wfmgr", "n:task", "n:errorlog"], ["e:e_wfmgr_chat"], ["n:chat"]],
    before: [
      "Workflows manually activated or deactivated when client campaigns changed status",
      "Webhook registrations set up by hand for every new client",
      "Errors discovered hours or days later, with manual investigation",
      "No centralized history of what went wrong and when",
    ],
    after: [
      "Campaign status changes automatically activate/deactivate the right workflows",
      "Webhook registration automated through a setup utility",
      "Errors caught instantly with automatic ticket creation and logging",
      "<strong>Campaign on/off state always matches the source of truth</strong>",
    ],
    impact: [
      "<strong>Cognitive load reduced:</strong> No manual workflow management, no missed errors, no stale campaign states",
      "<strong>Consistency:</strong> Campaign activation always matches the tracking sheet — single source of truth",
    ],
  },
];
