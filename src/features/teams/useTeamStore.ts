"use client";

import { create } from "zustand";

type TeamMember = {
  id: string;
  username: string;
  role: "leader" | "member";
};

type Team = {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  maxMembers: number;
  inviteCode: string;
  createdAt: string;
};

type TeamsState = {
  teams: Team[];
  myTeam: Team | null;
  loading: boolean;
  fetchTeams: () => Promise<void>;
  fetchMyTeam: () => Promise<void>;
  createTeam: (name: string, description: string) => Promise<void>;
  joinTeam: (inviteCode: string) => Promise<void>;
  leaveTeam: () => Promise<void>;
};

export const useTeamStore = create<TeamsState>((set) => ({
  teams: [],
  myTeam: null,
  loading: false,

  fetchTeams: async () => {
    set({ loading: true });
    const res = await fetch("/api/teams");
    if (res.ok) {
      const { teams } = await res.json();
      set({ teams, loading: false });
    } else {
      set({ loading: false });
    }
  },

  fetchMyTeam: async () => {
    const res = await fetch("/api/teams?mine=true");
    if (res.ok) {
      const { team } = await res.json();
      set({ myTeam: team });
    }
  },

  createTeam: async (name, description) => {
    const res = await fetch("/api/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to create team");
    }
    const { team } = await res.json();
    set({ myTeam: team });
  },

  joinTeam: async (inviteCode) => {
    const res = await fetch(`/api/teams/${inviteCode}/join`, {
      method: "POST",
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to join team");
    }
    const { team } = await res.json();
    set({ myTeam: team });
  },

  leaveTeam: async () => {
    const res = await fetch("/api/teams/leave", { method: "POST" });
    if (res.ok) {
      set({ myTeam: null });
    }
  },
}));
