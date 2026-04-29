import { fetchCollection } from "@/lib/payload";
import type { Rule } from "@/lib/types";

export default async function RulesPage() {
  let rules: Rule[] = [];

  try {
    const data = await fetchCollection<Rule>("rules", { sort: "order", limit: 50 });
    rules = data.docs;
  } catch {}

  return (
    <div className="min-h-screen px-4 pt-16 pb-24">
      <div className="mx-auto max-w-3xl">
        <div className="py-8 md:py-12 animate-fade-in">
          <h1 className="text-3xl font-bold text-white md:text-4xl mb-2">Rules</h1>
          <p className="text-text-muted">
            Everything you need to know before participating.
          </p>
        </div>

        {rules.length > 0 ? (
          <div className="divide-y divide-white/[0.04]">
            {rules.map((rule, i) => (
              <div key={rule.id} className="py-8 first:pt-0 animate-fade-in">
                <div className="flex gap-5 items-baseline">
                  <span className="text-3xl font-bold text-white/10 shrink-0 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-white mb-3">{rule.title}</h2>
                    {rule.items && rule.items.length > 0 && (
                      <ul className="space-y-2">
                        {rule.items.map((item, j) => (
                          <li key={j} className="text-text-muted text-sm leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/40">
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
          <div className="py-20 text-center">
            <p className="text-text-muted">Rules will be published soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
