#!/usr/bin/env bash
# On-droplet deploy: pull latest, install, build, restart services.
# Invoked by GitHub Actions over SSH as user `claude` (passwordless sudo).

set -euo pipefail

REPO_DIR=/srv/sboxjam
APP_USER=sboxjam

cd "$REPO_DIR"

echo "==> Fetching latest"
sudo GIT_SSH_COMMAND="ssh -i /root/.ssh/id_rsa -o StrictHostKeyChecking=accept-new" \
	git -C "$REPO_DIR" fetch origin master
sudo GIT_SSH_COMMAND="ssh -i /root/.ssh/id_rsa -o StrictHostKeyChecking=accept-new" \
	git -C "$REPO_DIR" reset --hard origin/master
sudo chown -R "$APP_USER:$APP_USER" "$REPO_DIR"

echo "==> Installing dependencies"
sudo -u "$APP_USER" -H bash -c "cd '$REPO_DIR' && pnpm install --frozen-lockfile"

echo "==> Building"
sudo -u "$APP_USER" -H bash -c "cd '$REPO_DIR' && pnpm build"

echo "==> Restarting services"
sudo systemctl restart sboxjam-cms.service sboxjam-web.service

echo "==> Health check"
sleep 4
curl -fsS -o /dev/null -w "cms /admin -> %{http_code}\n" http://127.0.0.1:3000/admin
curl -fsS -o /dev/null -w "web /     -> %{http_code}\n" http://127.0.0.1:3001/

echo "==> Deploy complete"
