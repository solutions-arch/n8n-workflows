# Screenshots & media

Drop one JPG per placeholder at:

```
public/media/{media-id}.jpg
```

The app probes for that exact path. If it loads, the dashed placeholder is replaced with the real image automatically — no code changes needed — and it becomes click-to-maximize (opens full-size in a lightbox; Escape or the backdrop closes it). If the file's missing, the placeholder just stays as-is.

Each placeholder's `data-media-id` (visible in the page source, right above the placeholder `<div>` in an HTML comment with capture instructions) is the filename to use.

## Expected files

### Overview cards (1 per system)
- `public/media/pdev-overview-thumbnail.jpg`
- `public/media/placements-overview-thumbnail.jpg`
- `public/media/linkedin-overview-thumbnail.jpg`

### Scenario output screenshots (1 per scenario)
- `public/media/pdev-onboarding-output.jpg`
- `public/media/pdev-sync-output.jpg`
- `public/media/pdev-mom-output.jpg`
- `public/media/pdev-insights-output.jpg`
- `public/media/pdev-health-output.jpg`
- `public/media/pdev-error-output.jpg`
- `public/media/placements-vadata-output.jpg`
- `public/media/placements-pipeline-output.jpg`
- `public/media/placements-readiness-output.jpg`
- `public/media/placements-ai_insights-output.jpg`
- `public/media/placements-digest-output.jpg`
- `public/media/placements-error-output.jpg`
- `public/media/linkedin-ai_classify-output.jpg`
- `public/media/linkedin-booking-output.jpg`
- `public/media/linkedin-reporting-output.jpg`
- `public/media/linkedin-sysops-output.jpg`
