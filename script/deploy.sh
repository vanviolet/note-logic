#!/usr/bin/env bash
set -euo pipefail

# Deploy built dist/ to GitHub Pages repo via SSH
# Repo: git@github.com:vanviolet/vanviolet.github.io.git
# This script will:
# 1) Build the app
# 2) Create a temp worktree containing only dist
# 3) Commit and force-push to the pages repo main branch

REPO_SSH="git@github.com:vanviolet/vanviolet.github.io.git"
BRANCH="main"
DIST_DIR="build/client"
TMP_DIR=".gh-pages-tmp"

# Ensure we run from repo root
cd "$(dirname "$0")/.."

# 1) Build
printf "\n▶ Building project...\n"
rm -rf "$DIST_DIR"
npm run build

# 2) Prepare temp dir with dist contents as a git repo
printf "\n▶ Preparing temporary git repo with dist...\n"
rm -rf "$TMP_DIR"
mkdir -p "$TMP_DIR"
cp -R "$DIST_DIR"/* "$TMP_DIR"/

# SPA fallback: copy index.html to 404.html for GitHub Pages
if [[ -f "$DIST_DIR/index.html" ]]; then
	cp "$DIST_DIR/index.html" "$TMP_DIR/404.html"
fi

# Optional CNAME support: use env var, ./CNAME, or ./public/CNAME
if [[ -n "${GHPAGES_CNAME:-}" ]]; then
	printf "%s\n" "$GHPAGES_CNAME" > "$TMP_DIR/CNAME"
elif [[ -f "CNAME" ]]; then
	cp "CNAME" "$TMP_DIR/CNAME"
elif [[ -f "public/CNAME" ]]; then
	cp "public/CNAME" "$TMP_DIR/CNAME"
fi

pushd "$TMP_DIR" >/dev/null

git init

git remote add origin "$REPO_SSH" || true

git checkout -b "$BRANCH" 2>/dev/null || git checkout "$BRANCH" || true

# Create .nojekyll to avoid Jekyll processing blocking files like _assets
printf "\n▶ Adding .nojekyll and basic commit...\n"

echo > .nojekyll

git add -A

git -c user.name="Etone Deploy" -c user.email="deploy@local" commit -m "Deploy $(date -u +"%Y-%m-%dT%H:%M:%SZ")"

printf "\n▶ Pushing to %s (%s) ...\n" "$REPO_SSH" "$BRANCH"

git push -f origin "$BRANCH"

popd >/dev/null

printf "\n✅ Deployed to GitHub Pages.\n"
