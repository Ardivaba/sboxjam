"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/features/auth/useAuthStore";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/prizes", label: "Prizes", icon: "emoji_events" },
  { href: "/rules", label: "Rules", icon: "gavel" },
  // { href: "/guides", label: "Guides", icon: "menu_book" },
  { href: "/devlog", label: "Devlog", icon: "edit_note" },
  { href: "/schedule", label: "Schedule", icon: "calendar_month" },
  { href: "/teams", label: "Teams", icon: "groups" },
];

export function Nav() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-[52px] transition-colors duration-200 ${
        scrolled ? "bg-[rgba(10,16,24,0.85)] backdrop-blur-md border-b border-white/5" : ""
      }`}
    >
      <div className="max-w-[1200px] mx-auto h-full flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-[5px] flex items-center justify-center">
              <span className="text-white font-bold text-xs">S</span>
            </div>
            <span className="text-white font-semibold text-[1rem] tracking-tight">
              s&box jam
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[0.85rem] font-medium transition-colors ${
                  pathname === link.href
                    ? "text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <span className="material-symbols-rounded text-[18px]">{link.icon}</span>
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
                className="flex items-center gap-1.5 text-[0.85rem] text-white/60 hover:text-white transition-colors"
              >
                <span className="material-symbols-rounded text-[18px]">dashboard</span>
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 text-[0.85rem] text-white/60 hover:text-white transition-colors"
              >
                <span className="material-symbols-rounded text-[18px]">logout</span>
                Logout
              </button>
              <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {user.username[0].toUpperCase()}
                </span>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-[0.85rem] text-white/60 hover:text-white transition-colors"
              >
                <span className="material-symbols-rounded text-[18px]">login</span>
                Log in
              </Link>
              <Link href="/register" className="btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
