#!/bin/bash
# update_site.sh — sync latest files and push to GitHub
# Usage: bash update_site.sh
#
# ⚠️  STALE — DO NOT RUN AS-IS (disabled July 2026).
#
# The copies under $RESEARCH/website/ are older than what is committed here
# (April 2026 vs. the current pages), so running this script would OVERWRITE
# the live research pages with outdated content and undo the redesign.
# It also only knows about onepager v1–v2, while v3–v10, the methodology note
# and the seminar slides are already committed here.
#
# Deploy manually instead:
#     cd /Users/helenamontoya/Documents/hmontoyac3.github.io
#     git add . && git commit -m "..." && git push
#
# To repair this script: make the repo the source of truth and delete the
# cp lines below, or re-point them at directories that are actually newer.

if [ "$FORCE_STALE_SYNC" != "1" ]; then
  echo "update_site.sh is disabled: its source files are older than the repo."
  echo "Deploy with: git add . && git commit -m '...' && git push"
  echo "To override anyway: FORCE_STALE_SYNC=1 bash update_site.sh"
  exit 1
fi

REPO="/Users/helenamontoya/Documents/hmontoyac3.github.io"
RESEARCH="/Users/helenamontoya/Documents/Documentos/Bocconi/Research"

echo "Syncing files..."

# HTML pages
cp "$RESEARCH/website/research/index.html"                        "$REPO/research/index.html"
cp "$RESEARCH/website/research/sdm-instrument/index.html"         "$REPO/research/sdm-instrument/index.html"
cp "$RESEARCH/website/research/heterogeneity-effects/index.html"  "$REPO/research/heterogeneity-effects/index.html"

# PDFs — Heterogeneous Effects
HET="$RESEARCH/Heterogeneous Effects Paper/drafts"
if [ -f "$HET/onepager_v1.pdf" ]; then
  cp "$HET/onepager_v1.pdf" "$REPO/research/heterogeneity-effects/onepager_v1.pdf"
fi
if [ -f "$HET/onepager_v2.pdf" ]; then
  cp "$HET/onepager_v2.pdf" "$REPO/research/heterogeneity-effects/onepager_v2.pdf"
fi

# Push
cd "$REPO"
git add .
git status --short
git commit -m "update: $(date '+%Y-%m-%d %H:%M')"
git push

echo "Done. Site updated at helenamontoyacalero.com"
