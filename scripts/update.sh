#!/bin/sh
# Update the app on the server from the `deploy` branch (built by GitHub).
# Usage: sh scripts/update.sh   — then restart the site in the alwaysdata admin.
# .env and data/ are not tracked and are left untouched.
set -e
cd "$(dirname "$0")/.."

git fetch --depth 1 origin deploy
git checkout -q -f -B deploy FETCH_HEAD
git clean -q -fd -e .env -e data

# Drop the previous build's objects (low-memory settings for the SSH session).
git reflog expire --expire=now --all
git -c pack.threads=1 -c pack.windowMemory=32m gc -q --prune=now

echo "Version installée : $(git log -1 --format=%s)"
echo "Redémarre le site dans l'admin alwaysdata."
