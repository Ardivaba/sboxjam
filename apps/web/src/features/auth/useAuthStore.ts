"use client";

import { create } from "zustand";
import type { Participant } from "@/lib/types";

type AuthState = {
  user: Participant | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: Participant, token: string) => void;
};

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:3000";

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  loading: false,

  login: async (email, password) => {
    set({ loading: true });
    const res = await fetch(`${CMS_URL}/api/participants/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    if (!res.ok) {
      set({ loading: false });
      const data = await res.json();
      throw new Error(data.errors?.[0]?.message || "Invalid credentials");
    }
    const data = await res.json();
    set({ user: data.user, token: data.token, loading: false });
  },

  register: async (username, email, password) => {
    set({ loading: true });
    const res = await fetch(`${CMS_URL}/api/participants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
      credentials: "include",
    });
    if (!res.ok) {
      set({ loading: false });
      const data = await res.json();
      throw new Error(data.errors?.[0]?.message || "Registration failed");
    }
    const data = await res.json();
    const loginRes = await fetch(`${CMS_URL}/api/participants/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    if (loginRes.ok) {
      const loginData = await loginRes.json();
      set({ user: loginData.user, token: loginData.token, loading: false });
    } else {
      set({ loading: false });
    }
  },

  logout: () => {
    fetch(`${CMS_URL}/api/participants/logout`, {
      method: "POST",
      credentials: "include",
    });
    set({ user: null, token: null });
  },

  setUser: (user, token) => set({ user, token }),
}));
