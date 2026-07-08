# Scenario narration audio

Drop one MP3 per scenario at:

```
public/audio/{system}/{scenario-key}.mp3
```

The app checks for that exact path per scenario. If the file exists, a "▶ Narration" button appears automatically in that scenario's panel — no code changes needed. If it's missing, the button just stays hidden, so there's no broken/disabled UI in the meantime.

Scripts: `n8n-workflows/docs/narration-scripts.md` has a ready-to-read script per scenario, written for spoken delivery (not lifted from the on-screen copy, which reads dense out loud). If that copy gets revised later, restyle the script rather than reading it verbatim from `desc` in `src/systems/{system}.js`.

## Expected files

### `public/audio/pdev/`
- `onboarding.mp3` — Client Onboarding
- `sync.mp3` — Cross-System Sync
- `mom.mp3` — AI Meeting Minutes
- `insights.mp3` — AI Insights & Daily Report
- `health.mp3` — Health Digest & Metrics
- `error.mp3` — Error Monitor

### `public/audio/placements/`
- `vadata.mp3` — VA Data Management
- `pipeline.mp3` — Pipeline Management
- `readiness.mp3` — Readiness & Reporting
- `ai_insights.mp3` — AI Insights & Daily Report
- `digest.mp3` — Health Digest & Metrics
- `error.mp3` — Error Monitor

### `public/audio/linkedin/`
- `ai_classify.mp3` — AI Reply Classification
- `booking.mp3` — Meeting Booking Tracker
- `reporting.mp3` — Daily Campaign Reporting
- `sysops.mp3` — System Operations
