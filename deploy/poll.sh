#!/usr/bin/env bash
# Poll origin/master and deploy if it has moved past the last-deployed SHA.
# Tracks deployment state in a file so pushes made *from the droplet* (which
# advance local HEAD before origin) still trigger a deploy.
# Run by systemd timer; exits cleanly when nothing to do.

set -euo pipefail

REPO_DIR=/srv/sboxjam
SSH_KEY=/root/.ssh/id_rsa
LOCK=/var/lock/sboxjam-poll.lock
STATE_DIR=/var/lib/sboxjam
STATE_FILE="$STATE_DIR/last-deployed-sha"

# Single-instance: skip if a previous poll/deploy is still running.
exec 200>"$LOCK"
flock -n 200 || exit 0

mkdir -p "$STATE_DIR"

cd "$REPO_DIR"

remote_sha=$(GIT_SSH_COMMAND="ssh -i $SSH_KEY -o StrictHostKeyChecking=accept-new" \
	git ls-remote origin master | awk '{print $1}')

if [[ -z "$remote_sha" ]]; then
	echo "poll: failed to read origin/master" >&2
	exit 1
fi

last_deployed=""
[[ -f "$STATE_FILE" ]] && last_deployed=$(cat "$STATE_FILE")

# First run: bootstrap state from current HEAD without redeploying.
if [[ -z "$last_deployed" ]]; then
	git rev-parse HEAD > "$STATE_FILE"
	last_deployed=$(cat "$STATE_FILE")
fi

if [[ "$last_deployed" == "$remote_sha" ]]; then
	exit 0
fi

echo "poll: $last_deployed -> $remote_sha — deploying"
"$REPO_DIR/deploy/deploy.sh"

# Only mark deployed on success.
echo "$remote_sha" > "$STATE_FILE"
