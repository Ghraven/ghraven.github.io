# ghraven.github.io

Personal portfolio of **Rolly Calma** — Python developer and AI automation builder.

**Live site:** [ghraven.github.io](https://ghraven.github.io)

## Stack

Plain HTML/CSS/JS, no framework, hosted on GitHub Pages. Dark/light theme with persisted preference, constellation hero canvas, scroll-reveal animations, and a contact modal.

## Auto-synced stats

The PR / merged / repos / stars numbers shown on the site are **not** edited by hand. [`scripts/sync_stats.py`](scripts/sync_stats.py) parses the badge values from my [profile README](https://github.com/Ghraven/Ghraven) (the single source of truth) and rewrites every element tagged with a `data-stat` attribute in `index.html`, plus the meta descriptions.

[`sync-stats.yml`](.github/workflows/sync-stats.yml) runs it every 6 hours (and on manual dispatch), committing only when the numbers actually changed.

To update the stats everywhere: edit the badges in the profile README, then wait for the schedule or trigger the workflow manually.

## Local development

```bash
python -m http.server 8000
# open http://localhost:8000
```

## AI Assistance Transparency

I use AI-assisted development tools, including Codex and Claude, while building and maintaining this site. All content and design decisions are reviewed and shipped by me.
