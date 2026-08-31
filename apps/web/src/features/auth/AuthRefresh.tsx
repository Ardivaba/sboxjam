"use client";

import { useEffect } from "react";
import { useAuthStore } from "./useAuthStore";

// Re-validates the persisted session once per page load.
export function AuthRefresh() {
  const refresh = useAuthStore((s) => s.refresh);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return null;
}
