import crypto from "crypto";
import type { Endpoint } from "payload";

// Discord is the only way to register/log in. The flow:
//   web → GET /api/participants/oauth/discord → discord.com authorize
//   discord → GET /api/participants/oauth/discord/callback
//     → exchange code, fetch Discord profile
//     → find-or-create participant by discordId
//     → rotate a random internal password and payload.login() with it
//     → redirect to the web app with the JWT in the URL fragment
// Participants never see or set a password; it rotates on every login.

const DISCORD_API = "https://discord.com/api";
const STATE_COOKIE = "discord_oauth_state";

function getEnv() {
  return {
    clientId: process.env.DISCORD_CLIENT_ID || "",
    clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
    serverUrl: process.env.SERVER_URL || "http://localhost:3000",
    webUrl: process.env.WEB_URL || "http://localhost:3001",
  };
}

function redirectUri(serverUrl: string) {
  return `${serverUrl}/api/participants/oauth/discord/callback`;
}

function getCookie(header: string | null, name: string): string | null {
  if (!header) return null;
  for (const part of header.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return rest.join("=");
  }
  return null;
}

function errorRedirect(webUrl: string, message: string): Response {
  const url = new URL(`${webUrl}/login`);
  url.searchParams.set("error", message);
  return new Response(null, { status: 302, headers: { Location: url.toString() } });
}

export const discordAuthorize: Endpoint = {
  path: "/oauth/discord",
  method: "get",
  handler: async () => {
    const { clientId, serverUrl } = getEnv();
    if (!clientId) {
      return new Response("Discord OAuth is not configured (DISCORD_CLIENT_ID missing)", { status: 500 });
    }
    const state = crypto.randomUUID();
    const url = new URL(`${DISCORD_API}/oauth2/authorize`);
    url.searchParams.set("client_id", clientId);
    url.searchParams.set("redirect_uri", redirectUri(serverUrl));
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", "identify email");
    url.searchParams.set("state", state);
    return new Response(null, {
      status: 302,
      headers: {
        Location: url.toString(),
        "Set-Cookie": `${STATE_COOKIE}=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`,
      },
    });
  },
};

export const discordCallback: Endpoint = {
  path: "/oauth/discord/callback",
  method: "get",
  handler: async (req) => {
    const { clientId, clientSecret, serverUrl, webUrl } = getEnv();
    const url = new URL(req.url || "", serverUrl);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const cookieState = getCookie(req.headers.get("cookie"), STATE_COOKIE);

    if (!code) return errorRedirect(webUrl, "Discord login was cancelled");
    if (!state || !cookieState || state !== cookieState) {
      return errorRedirect(webUrl, "Login session expired, please try again");
    }

    // Exchange the code for an access token
    const tokenRes = await fetch(`${DISCORD_API}/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri(serverUrl),
      }),
    });
    if (!tokenRes.ok) return errorRedirect(webUrl, "Discord token exchange failed");
    const { access_token: accessToken } = (await tokenRes.json()) as { access_token?: string };
    if (!accessToken) return errorRedirect(webUrl, "Discord token exchange failed");

    const userRes = await fetch(`${DISCORD_API}/users/@me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!userRes.ok) return errorRedirect(webUrl, "Could not read your Discord profile");
    const discordUser = (await userRes.json()) as {
      id: string;
      username: string;
      global_name?: string | null;
      email?: string | null;
      avatar?: string | null;
    };

    const payload = req.payload;
    const avatarUrl = discordUser.avatar
      ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png?size=256`
      : undefined;
    const email = discordUser.email || `discord-${discordUser.id}@sboxlfg.local`;
    // Rotated on every login; never shown to the user.
    const password = crypto.randomBytes(32).toString("hex");

    const existing = await payload.find({
      collection: "participants",
      where: { discordId: { equals: discordUser.id } },
      limit: 1,
      depth: 0,
    });

    let participant = existing.docs[0];
    if (participant) {
      participant = await payload.update({
        collection: "participants",
        id: participant.id,
        data: { password, avatarUrl },
      });
    } else {
      let username = discordUser.global_name || discordUser.username;
      const clash = await payload.find({
        collection: "participants",
        where: { username: { equals: username } },
        limit: 1,
        depth: 0,
      });
      if (clash.docs.length > 0) {
        username = `${username}_${discordUser.id.slice(-4)}`;
      }
      participant = await payload.create({
        collection: "participants",
        data: {
          username,
          email,
          password,
          discordId: discordUser.id,
          discordHandle: discordUser.username,
          avatarUrl,
        },
      });
    }

    const { token } = await payload.login({
      collection: "participants",
      data: { email: participant.email, password },
    });
    if (!token) return errorRedirect(webUrl, "Login failed, please try again");

    // Token travels in the fragment so it never hits server logs.
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${webUrl}/auth/callback#token=${encodeURIComponent(token)}`,
        "Set-Cookie": `${STATE_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
      },
    });
  },
};
