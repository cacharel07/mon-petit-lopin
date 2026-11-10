#!/bin/sh
# Manual update: same as the scheduled task, even if `deploy` did not change.
# Usage: sh scripts/update.sh
exec sh "$(dirname "$0")/auto-update.sh" --force
