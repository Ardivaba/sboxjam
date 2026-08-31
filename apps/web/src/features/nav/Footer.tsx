import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-dark">
      <div className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-primary rounded-[5px] flex items-center justify-center">
                <span className="text-white font-bold text-xs">S</span>
              </div>
              <span className="text-text-bright font-semibold">s&box lfg</span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              Find your team for the s&box gamejam. Build a crew before the theme drops.
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-text-bright">Find</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/teams" className="text-sm text-text-muted hover:text-text-bright transition-colors">Teams</Link>
              <Link href="/players" className="text-sm text-text-muted hover:text-text-bright transition-colors">Players</Link>
            </nav>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-text-bright">Account</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/register" className="text-sm text-text-muted hover:text-text-bright transition-colors">Join</Link>
              <Link href="/dashboard" className="text-sm text-text-muted hover:text-text-bright transition-colors">Dashboard</Link>
            </nav>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-text-bright">Community</h3>
            <nav className="flex flex-col gap-2">
              <a href="https://sbox.game" target="_blank" rel="noopener noreferrer" className="text-sm text-text-muted hover:text-text-bright transition-colors">sbox.game</a>
              <a href="https://wiki.facepunch.com/sbox" target="_blank" rel="noopener noreferrer" className="text-sm text-text-muted hover:text-text-bright transition-colors">s&box Wiki</a>
            </nav>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-text-muted">Community project. Not affiliated with Facepunch.</p>
          <p className="text-xs text-text-muted">Built for the s&box community</p>
        </div>
      </div>
    </footer>
  );
}
