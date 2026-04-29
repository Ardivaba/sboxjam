#!/usr/bin/env bash
# Idempotent bootstrap for an Ubuntu 22.04 / 24.04 DigitalOcean droplet.
# Run as root (or via sudo). Repo must already be cloned at REPO_DIR.

set -euo pipefail

REPO_DIR="${REPO_DIR:-/srv/sboxjam}"
APP_USER="${APP_USER:-sboxjam}"
NODE_MAJOR="${NODE_MAJOR:-20}"
MONGO_VERSION="${MONGO_VERSION:-8.0}"

if [[ $EUID -ne 0 ]]; then
	echo "Run as root: sudo $0" >&2
	exit 1
fi

if [[ ! -d "$REPO_DIR" ]]; then
	echo "Clone the repo to $REPO_DIR first:" >&2
	echo "  git clone https://github.com/Ardivaba/sboxjam $REPO_DIR" >&2
	exit 1
fi

if [[ ! -f "$REPO_DIR/apps/cms/.env" ]]; then
	echo "Missing $REPO_DIR/apps/cms/.env — copy from .env.production.example and fill in PAYLOAD_SECRET." >&2
	exit 1
fi
if [[ ! -f "$REPO_DIR/apps/web/.env" ]]; then
	echo "Missing $REPO_DIR/apps/web/.env — copy from .env.production.example." >&2
	exit 1
fi

echo "==> Installing base packages"
apt-get update
apt-get install -y curl ca-certificates gnupg lsb-release git ufw debian-keyring debian-archive-keyring apt-transport-https

echo "==> Installing Node.js $NODE_MAJOR"
if ! command -v node >/dev/null || [[ "$(node -v)" != v${NODE_MAJOR}.* ]]; then
	curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
	apt-get install -y nodejs
fi

echo "==> Enabling pnpm via corepack"
corepack enable
corepack prepare pnpm@latest --activate

echo "==> Installing MongoDB $MONGO_VERSION"
if ! command -v mongod >/dev/null; then
	UBUNTU_CODENAME="$(lsb_release -cs)"
	# MongoDB only publishes for jammy/noble; pin noble->jammy fallback.
	case "$UBUNTU_CODENAME" in
		noble|jammy) MONGO_CODENAME="$UBUNTU_CODENAME" ;;
		*) MONGO_CODENAME="jammy" ;;
	esac
	curl -fsSL "https://pgp.mongodb.com/server-${MONGO_VERSION}.asc" \
		| gpg --dearmor -o /usr/share/keyrings/mongodb-server-${MONGO_VERSION}.gpg
	echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-${MONGO_VERSION}.gpg ] https://repo.mongodb.org/apt/ubuntu ${MONGO_CODENAME}/mongodb-org/${MONGO_VERSION} multiverse" \
		> /etc/apt/sources.list.d/mongodb-org-${MONGO_VERSION}.list
	apt-get update
	apt-get install -y mongodb-org
fi
systemctl enable --now mongod

echo "==> Installing Caddy"
if ! command -v caddy >/dev/null; then
	curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
		| gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
	curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
		> /etc/apt/sources.list.d/caddy-stable.list
	apt-get update
	apt-get install -y caddy
fi

echo "==> Creating $APP_USER user"
if ! id "$APP_USER" >/dev/null 2>&1; then
	useradd --system --create-home --home-dir "/home/$APP_USER" --shell /usr/sbin/nologin "$APP_USER"
fi
chown -R "$APP_USER:$APP_USER" "$REPO_DIR"

echo "==> Installing dependencies and building"
sudo -u "$APP_USER" -H bash -c "cd '$REPO_DIR' && pnpm install --frozen-lockfile"
sudo -u "$APP_USER" -H bash -c "cd '$REPO_DIR' && pnpm build"

echo "==> Installing systemd units"
install -m 644 "$REPO_DIR/deploy/sboxjam-cms.service" /etc/systemd/system/sboxjam-cms.service
install -m 644 "$REPO_DIR/deploy/sboxjam-web.service" /etc/systemd/system/sboxjam-web.service
systemctl daemon-reload
systemctl enable --now sboxjam-cms.service
systemctl enable --now sboxjam-web.service

echo "==> Installing Caddy config"
install -m 644 "$REPO_DIR/deploy/Caddyfile" /etc/caddy/Caddyfile
systemctl reload caddy || systemctl restart caddy

echo "==> Configuring firewall"
ufw allow OpenSSH || true
ufw allow 80/tcp || true
ufw allow 443/tcp || true
yes | ufw enable || true

echo "==> Seeding database"
sudo -u "$APP_USER" -H bash -c "cd '$REPO_DIR' && pnpm db:seed"

echo
echo "Done. Services:"
systemctl --no-pager status sboxjam-cms.service sboxjam-web.service caddy mongod | head -40
echo
echo "If the seed failed (already-seeded), run individual seeders manually:"
echo "  sudo -u $APP_USER pnpm --dir $REPO_DIR db:seed:settings"
echo "  sudo -u $APP_USER pnpm --dir $REPO_DIR db:seed:prizes"
echo "  sudo -u $APP_USER pnpm --dir $REPO_DIR db:seed:rules"
echo "  sudo -u $APP_USER pnpm --dir $REPO_DIR db:seed:guides"
echo "  sudo -u $APP_USER pnpm --dir $REPO_DIR db:seed:schedule"
