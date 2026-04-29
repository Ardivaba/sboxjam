"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/features/auth/useAuthStore";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/prizes", label: "Prizes" },
  { href: "/rules", label: "Rules" },
  { href: "/guides", label: "Guides" },
  { href: "/schedule", label: "Schedule" },
  { href: "/teams", label: "Teams" },
];

export function Nav() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[60px] bg-header border-b border-border">
      <div className="max-w-[1200px] mx-auto h-full flex items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-[6px] flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-text-bright font-semibold text-[1.1rem] tracking-tight">
              s&box jam
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-[0.9rem] font-medium transition-all ${
                  pathname === link.href
                    ? "text-white bg-white/5"
                    : "text-text-muted hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-[0.85rem] text-text-muted hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="text-[0.85rem] text-text-muted hover:text-white transition-colors"
              >
                Logout
              </button>
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <span className="text-primary-light text-xs font-medium">
                  {user.username[0].toUpperCase()}
                </span>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[0.85rem] text-text-muted hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link href="/register" className="btn-primary text-[0.85rem]">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
