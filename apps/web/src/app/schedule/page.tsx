import { fetchCollection } from "@/lib/payload";
import type { ScheduleEvent } from "@/lib/types";

export default async function SchedulePage() {
  let events: ScheduleEvent[] = [];

  try {
    const data = await fetchCollection<ScheduleEvent>("schedule-events", { sort: "order", limit: 50 });
    events = data.docs;
  } catch {}

  return (
    <div className="min-h-screen px-4 pt-20 pb-24">
      <section className="mx-auto max-w-5xl py-12 text-center md:py-20">
        <div className="animate-fade-in">
          <h1 className="mb-4 text-3xl font-bold text-text-white md:text-5xl">
            Event <span className="text-gradient">Schedule</span>
          </h1>
          <p className="mx-auto max-w-xl text-text-muted md:text-lg">
            Key dates and milestones for the s&box Game Jam.
          </p>
        </div>
      </section>

      <section className="relative mx-auto max-w-4xl pb-16">
        {events.length > 0 ? (
          <>
            <div className="absolute top-0 bottom-0 left-5 hidden w-px bg-border md:left-1/2 md:block" />
            <div className="absolute top-0 bottom-0 left-5 block w-px bg-border md:hidden" />

            <div className="space-y-12">
              {events.map((event, i) => {
                const isLeft = i % 2 === 0;
                const accentColor = event.accent === "warning" ? "text-warning" : event.accent === "error" ? "text-error" : "text-primary";
                const dotBg = event.accent === "warning" ? "bg-warning" : event.accent === "error" ? "bg-error" : "bg-primary";
                const formattedDate = new Date(event.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

                return (
                  <div key={event.id} className="animate-fade-in">
                    <div className="relative md:hidden">
                      <div className={`absolute left-5 top-6 h-3 w-3 -translate-x-1/2 rounded-full ${dotBg} ring-4 ring-bg`} />
                      <div className="ml-12 card p-5">
                        <div className="mb-2 flex items-center gap-2">
                          <span className={`material-symbols-rounded text-xl ${accentColor}`}>{event.icon || "event"}</span>
                          <span className={`text-xs font-semibold uppercase tracking-wider ${accentColor}`}>{formattedDate}</span>
                        </div>
                        {event.dateLabel && <p className="mb-1 text-xs text-text-muted">{event.dateLabel}</p>}
                        <h3 className="text-lg font-bold text-text-bright">{event.title}</h3>
                        <p className="mt-1 text-sm text-text-muted">{event.description}</p>
                      </div>
                    </div>

                    <div className="relative hidden md:flex md:items-center">
                      <div className={`absolute left-1/2 h-4 w-4 -translate-x-1/2 rounded-full ${dotBg} ring-4 ring-bg z-10`} />
                      {isLeft ? (
                        <>
                          <div className="w-1/2 pr-12 text-right">
                            <div className="card inline-block p-6 text-left">
                              <div className="mb-2 flex items-center justify-end gap-2">
                                <span className={`text-xs font-semibold uppercase tracking-wider ${accentColor}`}>{formattedDate}</span>
                                <span className={`material-symbols-rounded text-xl ${accentColor}`}>{event.icon || "event"}</span>
                              </div>
                              {event.dateLabel && <p className="mb-1 text-right text-xs text-text-muted">{event.dateLabel}</p>}
                              <h3 className="text-lg font-bold text-text-bright">{event.title}</h3>
                              <p className="mt-1 text-sm text-text-muted">{event.description}</p>
                            </div>
                          </div>
                          <div className="w-1/2" />
                        </>
                      ) : (
                        <>
                          <div className="w-1/2" />
                          <div className="w-1/2 pl-12">
                            <div className="card p-6">
                              <div className="mb-2 flex items-center gap-2">
                                <span className={`material-symbols-rounded text-xl ${accentColor}`}>{event.icon || "event"}</span>
                                <span className={`text-xs font-semibold uppercase tracking-wider ${accentColor}`}>{formattedDate}</span>
                              </div>
                              {event.dateLabel && <p className="mb-1 text-xs text-text-muted">{event.dateLabel}</p>}
                              <h3 className="text-lg font-bold text-text-bright">{event.title}</h3>
                              <p className="mt-1 text-sm text-text-muted">{event.description}</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="glass rounded-xl p-12 text-center">
            <span className="material-symbols-rounded text-4xl text-text-muted">calendar_month</span>
            <p className="mt-4 text-text-muted">Schedule will be announced soon.</p>
          </div>
        )}

        <div className="mt-12 glass rounded-xl p-6 text-center">
          <div className="flex items-center justify-center gap-2 text-text-muted">
            <span className="material-symbols-rounded text-lg text-primary">public</span>
            <p className="text-sm">
              All times are in <span className="font-semibold text-text-bright">UTC</span>. Convert to your local timezone.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
