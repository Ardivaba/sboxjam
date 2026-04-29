import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-header">
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-primary rounded-[5px] flex items-center justify-center">
                <span className="text-white font-bold text-xs">S</span>
              </div>
              <span className="text-text-bright font-semibold">s&box jam</span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              The ultimate game jam for s&box creators. Build, compete, and win.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-text-bright">
              Event
            </h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/rules"
                className="text-sm text-text-muted hover:text-text-bright transition-colors"
              >
                Rules
              </Link>
              <Link
                href="/prizes"
                className="text-sm text-text-muted hover:text-text-bright transition-colors"
              >
                Prizes
              </Link>
              <Link
                href="/schedule"
                className="text-sm text-text-muted hover:text-text-bright transition-colors"
              >
                Schedule
              </Link>
              <Link
                href="/guides"
                className="text-sm text-text-muted hover:text-text-bright transition-colors"
              >
                Guides
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-text-bright">
              Participate
            </h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/register"
                className="text-sm text-text-muted hover:text-text-bright transition-colors"
              >
                Register
              </Link>
              <Link
                href="/teams"
                className="text-sm text-text-muted hover:text-text-bright transition-colors"
              >
                Teams
              </Link>
              <Link
                href="/dashboard"
                className="text-sm text-text-muted hover:text-text-bright transition-colors"
              >
                Dashboard
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-text-bright">
              Community
            </h3>
            <nav className="flex flex-col gap-2">
              <span className="text-sm text-text-muted">s&box Discord</span>
              <span className="text-sm text-text-muted">s&box Wiki</span>
              <span className="text-sm text-text-muted">GitHub</span>
            </nav>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-text-muted">
            &copy; 2026 s&box Jam. All rights reserved.
          </p>
          <p className="text-xs text-text-muted">
            Built for the s&box community
          </p>
        </div>
      </div>
    </footer>
  );
}
