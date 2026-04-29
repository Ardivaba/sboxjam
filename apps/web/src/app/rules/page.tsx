import { fetchCollection } from "@/lib/payload";
import type { Rule } from "@/lib/types";

export default async function RulesPage() {
  let rules: Rule[] = [];

  try {
    const data = await fetchCollection<Rule>("rules", { sort: "order", limit: 50 });
    rules = data.docs;
  } catch {}

  return (
    <div className="min-h-screen px-4 pt-20 pb-24">
      <section className="relative mx-auto max-w-5xl py-12 text-center md:py-20">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 50% 60% at 50% 0%, rgba(50,115,235,0.1) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 animate-fade-in">
          <h1 className="mb-4 text-3xl font-bold text-text-white md:text-5xl">
            Rules & <span className="text-gradient">Guidelines</span>
          </h1>
          <p className="mx-auto max-w-xl text-text-muted md:text-lg">
            Everything you need to know before participating.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl pb-16">
        {rules.length > 0 ? (
          <div className="space-y-6">
            {rules.map((rule, i) => (
              <div key={rule.id} className="card rounded-xl p-6 animate-fade-in">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                    {rule.icon ? (
                      <span className="material-symbols-rounded text-xl text-primary">{rule.icon}</span>
                    ) : (
                      <span className="text-sm font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-text-bright mb-2">{rule.title}</h3>
                    {rule.items && rule.items.length > 0 && (
                      <ul className="space-y-1.5">
                        {rule.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-text-muted">
                            <span className="material-symbols-rounded text-xs text-primary mt-1">check</span>
                            {item.text}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass rounded-xl p-12 text-center">
            <span className="material-symbols-rounded text-4xl text-text-muted">gavel</span>
            <p className="mt-4 text-text-muted">Rules will be published soon.</p>
          </div>
        )}
      </section>
    </div>
  );
}
