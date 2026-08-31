"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/features/auth/useAuthStore";

export default function AuthCallbackPage() {
  const router = useRouter();
  const completeLogin = useAuthStore((s) => s.completeLogin);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const token = hash.get("token");
    if (!token) {
      setFailed(true);
      return;
    }
    // Clear the token from the URL before doing anything else.
    window.history.replaceState(null, "", window.location.pathname);
    completeLogin(token).then((ok) => {
      if (ok) {
        router.replace("/dashboard");
      } else {
        setFailed(true);
      }
    });
  }, [completeLogin, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {failed ? (
        <div className="text-center">
          <p className="text-text-muted mb-4">Login didn&apos;t go through.</p>
          <Link href="/login" className="btn-primary text-sm">Try again</Link>
        </div>
      ) : (
        <p className="text-text-muted text-sm">Signing you in...</p>
      )}
    </div>
  );
}
