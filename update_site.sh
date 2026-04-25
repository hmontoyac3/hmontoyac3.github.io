#!/bin/bash
# update_site.sh — sync latest files and push to GitHub
# Usage: bash update_site.sh

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

# PDFs — SDM Instrument (add path when ready)
# SDM="$RESEARCH/..."
# if [ -f "$SDM/draft.pdf" ]; then
#   cp "$SDM/draft.pdf" "$REPO/research/sdm-instrument/draft.pdf"
# fi

# Push
cd "$REPO"
git add .
git status --short
git commit -m "update: $(date '+%Y-%m-%d %H:%M')"
git push

echo "Done. Site updated at helenamontoyacalero.com"
