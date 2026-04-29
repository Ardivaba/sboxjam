#!/usr/bin/env bash
# On-droplet deploy: pull latest, build into a sibling .next.new, atomically
# swap to .next, restart services. Running services keep serving the old
# .next/ untouched throughout the build window — no broken-asset gap.

set -euo pipefail

REPO_DIR=/srv/sboxjam
APP_USER=sboxjam
APPS=(apps/cms apps/web)
BUILD_DIR_NAME=.next.new

cd "$REPO_DIR"

echo "==> Fetching latest"
sudo GIT_SSH_COMMAND="ssh -i /root/.ssh/id_rsa -o StrictHostKeyChecking=accept-new" \
	git -C "$REPO_DIR" fetch origin master
sudo GIT_SSH_COMMAND="ssh -i /root/.ssh/id_rsa -o StrictHostKeyChecking=accept-new" \
	git -C "$REPO_DIR" reset --hard origin/master
sudo chown -R "$APP_USER:$APP_USER" "$REPO_DIR"

echo "==> Cleaning previous staging build dirs"
for app in "${APPS[@]}"; do
	sudo rm -rf "$REPO_DIR/$app/$BUILD_DIR_NAME" "$REPO_DIR/$app/.next.old"
done

echo "==> Installing dependencies"
sudo -u "$APP_USER" -H bash -c "cd '$REPO_DIR' && pnpm install --frozen-lockfile"

echo "==> Building into $BUILD_DIR_NAME"
sudo -u "$APP_USER" -H bash -c "cd '$REPO_DIR' && NEXT_BUILD_DIR='$BUILD_DIR_NAME' pnpm build"

echo "==> Verifying staged build outputs"
for app in "${APPS[@]}"; do
	if [[ ! -d "$REPO_DIR/$app/$BUILD_DIR_NAME" ]]; then
		echo "Build did not produce $app/$BUILD_DIR_NAME — aborting" >&2
		exit 1
	fi
done

echo "==> Atomically swapping .next"
for app in "${APPS[@]}"; do
	if [[ -d "$REPO_DIR/$app/.next" ]]; then
		sudo -u "$APP_USER" -H mv "$REPO_DIR/$app/.next" "$REPO_DIR/$app/.next.old"
	fi
	sudo -u "$APP_USER" -H mv "$REPO_DIR/$app/$BUILD_DIR_NAME" "$REPO_DIR/$app/.next"
done

echo "==> Restarting services"
sudo systemctl restart sboxjam-cms.service sboxjam-web.service

echo "==> Health check"
sleep 4
curl -fsS -o /dev/null -w "cms /admin -> %{http_code}\n" http://127.0.0.1:3000/admin
curl -fsS -o /dev/null -w "web /     -> %{http_code}\n" http://127.0.0.1:3001/

echo "==> Cleaning up old build dirs"
for app in "${APPS[@]}"; do
	sudo rm -rf "$REPO_DIR/$app/.next.old"
done

echo "==> Deploy complete"
