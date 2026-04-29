"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/features/auth/useAuthStore";

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading } = useAuthStore();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await register(username, email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-in">
        <h1 className="text-2xl font-bold text-white mb-1">Create account</h1>
        <p className="text-sm text-text-muted mb-8">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:text-primary-light transition-colors">Sign in</Link>
        </p>

        {error && (
          <p className="mb-5 text-sm text-error">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="mb-1.5 block text-xs uppercase tracking-wider text-text-muted">Username</label>
            <input id="username" type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="input-field" placeholder="Your display name" />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs uppercase tracking-wider text-text-muted">Email</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs uppercase tracking-wider text-text-muted">Password</label>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="mb-1.5 block text-xs uppercase tracking-wider text-text-muted">Confirm Password</label>
            <input id="confirmPassword" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
