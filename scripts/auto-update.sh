#!/bin/sh
# Update the app from the `deploy` branch (built by GitHub) and restart the site.
#
# Meant for an alwaysdata scheduled task, e.g. every 15 minutes:
#   sh /home/<account>/www/mon-petit-lopin/scripts/auto-update.sh
# Does nothing when `deploy` has not changed (pass --force to update anyway).
#
# The restart uses the alwaysdata API when these lines are in .env:
#   ALWAYSDATA_API_KEY=...   (Admin → Profil → Gestion des tokens)
#   ALWAYSDATA_ACCOUNT=...   (account name)
#   ALWAYSDATA_SITE_ID=...   (number in the site's admin URL)
# .env and data/ are never touched.

# Everything is in a function so the whole file is read before git replaces it.
main() {
	set -eu
	cd "$(dirname "$0")/.."
	export GIT_TERMINAL_PROMPT=0 # fail instead of waiting for a password

	# Never run twice at the same time.
	lock=.update.lock
	if ! mkdir "$lock" 2>/dev/null; then
		log "Mise à jour déjà en cours, abandon."
		return 0
	fi
	trap 'rmdir "$lock"' EXIT

	git fetch -q --depth 1 origin deploy
	if [ "${1:-}" != "--force" ] && [ "$(git rev-parse HEAD)" = "$(git rev-parse FETCH_HEAD)" ]; then
		return 0
	fi

	log "Installation de : $(git log -1 --format=%s FETCH_HEAD)"
	git checkout -q -f -B deploy FETCH_HEAD
	git clean -q -fd -e .env -e data -e "$lock"

	# Drop the previous build's objects (low-memory settings for the host).
	git reflog expire --expire=now --all
	git -c pack.threads=1 -c pack.windowMemory=32m gc -q --prune=now

	restart_site
}

log() {
	echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

env_value() {
	[ -f .env ] && sed -n "s/^$1=//p" .env | tail -n 1 | tr -d '\r"' || true
}

restart_site() {
	key=$(env_value ALWAYSDATA_API_KEY)
	account=$(env_value ALWAYSDATA_ACCOUNT)
	site=$(env_value ALWAYSDATA_SITE_ID)
	if [ -z "$key" ] || [ -z "$account" ] || [ -z "$site" ]; then
		log "Mis à jour. Redémarrage automatique non configuré : redémarre le site dans l'admin."
		return 0
	fi
	if curl -fsS -o /dev/null -X POST --user "$key account=$account:" \
		"https://api.alwaysdata.com/v1/site/$site/restart/"; then
		log "Mis à jour et site redémarré."
	else
		log "Mis à jour, mais le redémarrage via l'API a échoué : redémarre le site dans l'admin."
		return 1
	fi
}

main "$@"
