# Narration Scripts

Voiceover scripts for the per-scenario "Narration" audio in the combined demo app (`n8n-workflows/demo`). Written for spoken delivery — natural cadence, no vendor/tool names — rather than lifted verbatim from the on-screen copy, which is written to be read, not heard.

Record each as an MP3 and drop it at the path noted under each script (see `demo/public/audio/README.md` for the full convention). Roughly 20–35 seconds each when read at a natural pace.

---

## Process Engineering Interface (PDEV)

### `public/audio/pdev/onboarding.mp3` — Client Onboarding
> When a new client request comes in, the system checks right away for any existing records so nothing gets duplicated. It then builds out everything that's needed — the client record, the contact, the project — updates the internal portal, and sends a confirmation email. What used to take someone thirty to sixty minutes of manual data entry now happens automatically, in seconds.

### `public/audio/pdev/sync.mp3` — Cross-System Sync
> Whenever a record changes — say, a team member gets reassigned — every connected system updates automatically to match. No one has to go update it twice. Once everything's synced, a notification goes out to the team confirming it's done.

### `public/audio/pdev/mom.mp3` — AI Meeting Minutes
> Every meeting gets recorded and transcribed automatically. From there, the AI reads the full transcript and writes structured minutes — attendees, decisions, action items — and sends them out by email, posts them to the team chat, and saves a record to the database. The same AI also reads meeting-related emails as they come in and matches them to the right project automatically, so nothing gets lost in someone's inbox.

### `public/audio/pdev/insights.mp3` — AI Insights & Daily Report
> Every incoming client email gets read by the AI, looking for updates, red flags, and anything that signals how a project is really going. Each of those insights is matched to the right client and saved. Then, once a day, the AI reviews everything it's captured, spots patterns across projects, and writes a plain-language summary of the wins, the risks, and what needs attention — delivered as a report card, posted straight to the team.

### `public/audio/pdev/health.mp3` — Health Digest & Metrics
> Every day, the system scores every active project on urgency, recency, and overall health — objectively, not based on who happened to notice something. It posts a prioritized digest to the team, so the projects that need attention are the first thing anyone sees. Every score gets saved as a snapshot too, which builds a trend line over time instead of just a one-day view.

### `public/audio/pdev/error.mp3` — Error Monitor
> If any automated process runs into a problem, it's caught the moment it happens. A ticket gets filed, the error is logged for later review, and the team is notified — all within seconds, instead of someone stumbling onto it days later.

---

## Placements Interface

### `public/audio/placements/vadata.mp3` — VA Data Management
> Whenever a VA's status changes — endorsed, ready for placement, stalled, or fast-tracked — the system reacts immediately. It builds and sends the endorsement email, notifies the right people once someone's placement-ready, flags anyone who's stalled before they slip through the cracks, and sets up a dedicated channel for fast-tracked candidates. All of it consistent, every time, no matter who's on shift.

### `public/audio/placements/pipeline.mp3` — Pipeline Management
> As a placement moves from interview scheduling through onboarding, each stage triggers automatically as it's reached. Calendar events get created with the right time zone and attendees, the full onboarding email sequence goes out, the external CRM stays in sync, and a support channel opens up. The AI also reads the interview call transcript and emails out a summary on its own — every stage firing by itself, with no one having to manually hand off from one step to the next.

### `public/audio/placements/readiness.mp3` — Readiness & Reporting
> Every week, VAs get an automated check-in asking about their availability and readiness, and the responses are collected in one place. On top of that, pipeline reports go out on a daily and weekly cadence as visual report cards, and if a placement gets cancelled, the team is notified instantly instead of finding out days later.

### `public/audio/placements/ai_insights.mp3` — AI Insights & Daily Report
> Every time a client replies to a candidate shortlist, the AI reads it and figures out the intent — accepted, rejected, or asking for more information — and updates the candidate record on its own. Nothing sits unread. Then, at the end of each shift, the AI looks across every active placement, writes an executive summary of the day — what went well, what's at risk, how the pipeline's looking — and sends that report card straight to stakeholders.

### `public/audio/placements/digest.mp3` — Health Digest & Metrics
> Every active placement gets scored daily on urgency — an objective number, not a guess based on who remembered to check. Each morning, a prioritized digest goes out to the team, so the placements that need the most attention are right at the top.

### `public/audio/placements/error.mp3` — Error Monitor
> If any process runs into an issue, it's caught the instant it happens. A ticket gets created, the error is logged so patterns can be analyzed later, and the team is alerted within seconds — no waiting for someone to notice something's wrong.

---

## LinkedIn Outreach

### `public/audio/linkedin/ai_classify.mp3` — AI Reply Classification
> When a prospect replies to an outreach message, the AI reads it and figures out the intent — interested, not interested, out of office, or asking for more information. That classification gets logged to the tracking sheet right away, and the team is notified instantly. Every single reply gets classified — nothing slips through.

### `public/audio/linkedin/booking.mp3` — Meeting Booking Tracker
> The moment a prospect books a meeting, the system captures it, checks the lead against the warm-lead and previously-contacted lists, and logs it to the tracking sheet — each client campaign kept separate and consistent. The team gets a real-time notification the second the booking comes in.

### `public/audio/linkedin/reporting.mp3` — Daily Campaign Reporting
> Every morning, the system pulls campaign statistics for every active client, rolls the numbers up per client, and updates the daily stats sheet. A summary gets posted to the team automatically — so performance across every campaign is ready to review before the day even starts.

### `public/audio/linkedin/sysops.mp3` — System Operations
> When a client's campaign status changes, the matching workflow turns on or off automatically — so the system's state always matches the source of truth, without anyone flipping a switch by hand. And if anything errors out, it's caught instantly: a ticket's created, it's logged, and the team's alerted within seconds.
