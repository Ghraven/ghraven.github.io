"""Sync portfolio stats from the GitHub profile README badges.

The profile README (Ghraven/Ghraven) is the single source of truth for the
PRs-opened / merged / repos-contributed / combined-stars numbers. This script
fetches it, parses the shields.io badge URLs, and rewrites every element in
index.html tagged with a data-stat attribute, plus the meta descriptions.

Run by .github/workflows/sync-stats.yml on a schedule; safe to run manually:
    python scripts/sync_stats.py
"""

import re
import sys
import urllib.request
from pathlib import Path

README_URL = "https://raw.githubusercontent.com/Ghraven/Ghraven/main/README.md"
INDEX = Path(__file__).resolve().parent.parent / "index.html"

BADGES = {
    "prs": r"PRs_opened-(\d+)-",
    "merged": r"Merged-(\d+)-",
    "repos": r"Repos_contributed-(\d+)-",
    "stars": r"Contributed_to_repos_with-(\d+)k%2B",
}


def fetch_readme() -> str:
    request = urllib.request.Request(
        README_URL,
        headers={"User-Agent": "Ghraven-portfolio-stats-sync/1.0"},
    )
    with urllib.request.urlopen(request, timeout=30) as resp:
        return resp.read().decode("utf-8")


def parse_stats(readme: str) -> dict:
    stats = {}
    for key, pattern in BADGES.items():
        match = re.search(pattern, readme)
        if not match:
            raise SystemExit(f"Badge for '{key}' not found in profile README — aborting, nothing changed.")
        stats[key] = match.group(1)
    return stats


def apply(html: str, stats: dict) -> str:
    prs, merged, repos, stars = stats["prs"], stats["merged"], stats["repos"], stats["stars"]

    # Plain-text stat spans: <... data-stat="prs" ...>159</...>
    html = re.sub(r'(data-stat="prs"[^>]*>)\d+', rf"\g<1>{prs}", html)
    html = re.sub(r'(data-stat="merged"[^>]*>)\d+', rf"\g<1>{merged}", html)
    html = re.sub(r'(data-stat="repos"[^>]*>)\d+', rf"\g<1>{repos}", html)
    html = re.sub(r'(data-stat="stars"[^>]*>)\d+k\+', rf"\g<1>{stars}k+", html)

    # Meta / OG / Twitter descriptions
    html = re.sub(r"repos with \d+k\+ combined stars", f"repos totaling {stars}k+ stars", html)
    html = re.sub(r"repos totaling \d+k\+ stars", f"repos totaling {stars}k+ stars", html)

    return html


def main() -> int:
    stats = parse_stats(fetch_readme())
    original = INDEX.read_text(encoding="utf-8")
    updated = apply(original, stats)
    if updated == original:
        print(f"Already in sync: {stats}")
        return 0
    INDEX.write_text(updated, encoding="utf-8")
    print(f"Updated index.html with {stats}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
