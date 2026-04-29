#!/usr/bin/env bash
# Poll origin/master and deploy if HEAD has moved.
# Run by systemd timer; exits cleanly when nothing to do.

set -euo pipefail

REPO_DIR=/srv/sboxjam
SSH_KEY=/root/.ssh/id_rsa
LOCK=/var/lock/sboxjam-poll.lock

# Single-instance: skip if a previous poll/deploy is still running.
exec 200>"$LOCK"
flock -n 200 || exit 0

cd "$REPO_DIR"

local_sha=$(git rev-parse HEAD)
remote_sha=$(GIT_SSH_COMMAND="ssh -i $SSH_KEY -o StrictHostKeyChecking=accept-new" \
	git ls-remote origin master | awk '{print $1}')

if [[ -z "$remote_sha" ]]; then
	echo "poll: failed to read origin/master" >&2
	exit 1
fi

if [[ "$local_sha" == "$remote_sha" ]]; then
	exit 0
fi

echo "poll: $local_sha -> $remote_sha — deploying"
exec "$REPO_DIR/deploy/deploy.sh"
