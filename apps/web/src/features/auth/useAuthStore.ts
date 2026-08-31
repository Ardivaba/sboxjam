"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Participant } from "@/lib/types";

type AuthState = {
  user: Participant | null;
  token: string | null;
  loginWithDiscord: () => void;
  completeLogin: (token: string) => Promise<boolean>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:3000";

async function fetchMe(token: string): Promise<{ user: Participant; token: string } | null> {
  const res = await fetch(`${CMS_URL}/api/participants/me`, {
    headers: { Authorization: `JWT ${token}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.user) return null;
  return { user: data.user, token: data.token || token };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      loginWithDiscord: () => {
        window.location.href = `${CMS_URL}/api/participants/oauth/discord`;
      },

      // Called by /auth/callback with the JWT from the OAuth redirect.
      completeLogin: async (token) => {
        const me = await fetchMe(token);
        if (!me) return false;
        set(me);
        return true;
      },

      logout: () => {
        fetch(`${CMS_URL}/api/participants/logout`, { method: "POST" });
        set({ user: null, token: null });
      },

      // Re-validates the persisted token and picks up profile edits.
      refresh: async () => {
        const { token } = get();
        if (!token) return;
        try {
          const me = await fetchMe(token);
          set(me ?? { user: null, token: null });
        } catch {
          // Network hiccup — keep the persisted session.
        }
      },
    }),
    {
      name: "sbox-lfg-auth",
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
);
