"use client";

import { create } from "zustand";
import type { Role, Team } from "@/lib/types";
import { CMS_URL, createDoc, updateDoc, fetchCollection } from "@/lib/payload";

type CreateTeamInput = {
  name: string;
  description: string;
  rolesNeeded: Role[];
  discordUrl?: string;
  maxMembers?: number;
};

type TeamsState = {
  teams: Team[];
  myTeam: Team | null;
  loading: boolean;
  fetchTeams: (opts?: { recruitingOnly?: boolean }) => Promise<void>;
  fetchMyTeam: (userId: string) => Promise<void>;
  createTeam: (input: CreateTeamInput, token: string) => Promise<Team>;
  joinByCode: (code: string, userId: string, token: string) => Promise<Team>;
  leaveTeam: (team: Team, userId: string, token: string) => Promise<void>;
};

const memberId = (m: Team["members"][number]) => (typeof m === "string" ? m : m.id);

export const useTeamStore = create<TeamsState>((set) => ({
  teams: [],
  myTeam: null,
  loading: false,

  fetchTeams: async (opts) => {
    set({ loading: true });
    const recruitingOnly = opts?.recruitingOnly ?? true;
    const where = recruitingOnly ? "&where[lookingForMembers][equals]=true" : "";
    const res = await fetch(`${CMS_URL}/api/teams?depth=1&limit=100${where}`);
    if (res.ok) {
      const data = await res.json();
      set({ teams: data.docs, loading: false });
    } else {
      set({ loading: false });
    }
  },

  fetchMyTeam: async (userId: string) => {
    const res = await fetch(`${CMS_URL}/api/teams?depth=1&where[members][in]=${userId}`);
    if (res.ok) {
      const data = await res.json();
      set({ myTeam: data.docs[0] ?? null });
    }
  },

  createTeam: async (input, token) => {
    const doc = await createDoc<Team>("teams", input, token);
    set({ myTeam: doc });
    return doc;
  },

  joinByCode: async (code, userId, token) => {
    const data = await fetchCollection<Team>("teams", {
      where: { inviteCode: { equals: code.trim().toUpperCase() } },
      depth: 0,
    });
    const team = data.docs[0];
    if (!team) throw new Error("No team found with that invite code");
    const members = (team.members || []).map(memberId);
    if (members.includes(userId)) throw new Error("You're already on this team");
    if (members.length >= team.maxMembers) throw new Error("That team is full");
    const doc = await updateDoc<Team>("teams", team.id, { members: [...members, userId] }, token);
    set({ myTeam: doc });
    return doc;
  },

  leaveTeam: async (team, userId, token) => {
    const members = (team.members || []).map(memberId).filter((id) => id !== userId);
    await updateDoc<Team>("teams", team.id, { members }, token);
    set({ myTeam: null });
  },
}));
