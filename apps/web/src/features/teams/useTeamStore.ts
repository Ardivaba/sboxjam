"use client";

import { create } from "zustand";
import type { Team } from "@/lib/types";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:3000";

type TeamsState = {
  teams: Team[];
  myTeam: Team | null;
  loading: boolean;
  fetchTeams: () => Promise<void>;
  fetchMyTeam: (userId: string) => Promise<void>;
  createTeam: (name: string, description: string, token: string) => Promise<Team>;
};

export const useTeamStore = create<TeamsState>((set) => ({
  teams: [],
  myTeam: null,
  loading: false,

  fetchTeams: async () => {
    set({ loading: true });
    const res = await fetch(`${CMS_URL}/api/teams?depth=1&limit=50&where[lookingForMembers][equals]=true`);
    if (res.ok) {
      const data = await res.json();
      set({ teams: data.docs, loading: false });
    } else {
      set({ loading: false });
    }
  },

  fetchMyTeam: async (userId: string) => {
    const res = await fetch(
      `${CMS_URL}/api/teams?depth=1&where[members][in]=${userId}`
    );
    if (res.ok) {
      const data = await res.json();
      set({ myTeam: data.docs[0] ?? null });
    }
  },

  createTeam: async (name, description, token) => {
    const res = await fetch(`${CMS_URL}/api/teams`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify({ name, description }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.errors?.[0]?.message || "Failed to create team");
    }
    const { doc } = await res.json();
    set({ myTeam: doc });
    return doc;
  },
}));
