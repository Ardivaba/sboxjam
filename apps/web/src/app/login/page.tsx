"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/features/auth/useAuthStore";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-[60px]">
      <div className="w-full max-w-md animate-fade-in">
        <div className="glass-strong rounded-2xl p-8 md:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/20">
              <span className="material-symbols-rounded text-3xl text-primary">login</span>
            </div>
            <h1 className="text-2xl font-bold text-text-white md:text-3xl">Welcome Back</h1>
            <p className="mt-2 text-sm text-text-muted">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-lg bg-error/10 border border-error/20 px-4 py-3">
              <span className="material-symbols-rounded text-lg text-error">error</span>
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text-bright">Email</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="you@example.com" />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-text-bright">Password</label>
              <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="Enter your password" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? (
                <span className="material-symbols-rounded animate-spin text-lg">progress_activity</span>
              ) : (
                <span className="material-symbols-rounded text-lg">login</span>
              )}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-primary hover:text-primary-light transition-colors">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
