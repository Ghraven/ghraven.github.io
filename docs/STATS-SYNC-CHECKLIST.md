# Stats Sync Checklist

The site statistics are synced from the GitHub profile README badge values.

## Before changing stats

- Update the badges in `Ghraven/Ghraven` first.
- Confirm the same numbers should appear on the site.
- Run or trigger the sync workflow rather than manually editing every stat.

## Local verification

```bash
python scripts/sync_stats.py
git diff -- index.html
```

Only commit when the diff reflects intentional badge/stat changes.

