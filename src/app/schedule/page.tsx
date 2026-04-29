const events = [
  {
    date: "May 15, 2026",
    title: "Registration Opens",
    description:
      "Sign up and start forming your team. Solo participants welcome.",
    icon: "app_registration",
    accent: "primary",
  },
  {
    date: "June 1, 2026",
    title: "Team Formation Deadline",
    description:
      "All teams must be finalized and locked in by this date. No changes after.",
    icon: "group",
    accent: "primary",
  },
  {
    date: "June 13, 2026",
    detail: "Friday, 6:00 PM UTC",
    title: "Theme Reveal & Jam Starts",
    description:
      "The theme is revealed live and the 72-hour countdown begins. Start building!",
    icon: "rocket_launch",
    accent: "warning",
  },
  {
    date: "June 16, 2026",
    detail: "Monday, 6:00 PM UTC",
    title: "Submissions Close",
    description:
      "You have exactly 72 hours. All submissions must be uploaded before the deadline.",
    icon: "upload_file",
    accent: "error",
  },
  {
    date: "June 17–20, 2026",
    title: "Judging Period",
    description:
      "Our panel of judges plays and evaluates every submission across all criteria.",
    icon: "gavel",
    accent: "primary",
  },
  {
    date: "June 21, 2026",
    title: "Winners Announced",
    description:
      "Results revealed during a live stream. Tune in to see who takes the prizes!",
    icon: "emoji_events",
    accent: "warning",
  },
];

export default function SchedulePage() {
  return (
    <div className="min-h-screen px-4 pt-20 pb-24">
      <section className="relative mx-auto max-w-5xl py-12 text-center md:py-20">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 60% at 50% 0%, rgba(50,115,235,0.1) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 animate-fade-in">
          <h1 className="mb-4 text-3xl font-bold text-text-white md:text-5xl">
            Event <span className="text-gradient">Schedule</span>
          </h1>
          <p className="mx-auto max-w-xl text-text-muted md:text-lg">
            Key dates and milestones for the s&box Game Jam. Mark your calendar
            and don&apos;t miss a beat.
          </p>
        </div>
      </section>

      <section className="relative mx-auto max-w-4xl pb-16">
        <div className="absolute top-0 bottom-0 left-5 hidden w-px bg-border md:left-1/2 md:block" />
        <div className="absolute top-0 bottom-0 left-5 block w-px bg-border md:hidden" />

        <div className="space-y-12">
          {events.map((event, i) => {
            const isLeft = i % 2 === 0;

            const accentColor =
              event.accent === "warning"
                ? "text-warning"
                : event.accent === "error"
                  ? "text-error"
                  : "text-primary";

            const dotBg =
              event.accent === "warning"
                ? "bg-warning"
                : event.accent === "error"
                  ? "bg-error"
                  : "bg-primary";

            return (
              <div key={event.title} className="animate-fade-in">
                <div className="relative md:hidden">
                  <div
                    className={`absolute left-5 top-6 h-3 w-3 -translate-x-1/2 rounded-full ${dotBg} ring-4 ring-bg`}
                  />
                  <div className="ml-12 card p-5">
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className={`material-symbols-rounded text-xl ${accentColor}`}
                      >
                        {event.icon}
                      </span>
                      <span className={`text-xs font-semibold uppercase tracking-wider ${accentColor}`}>
                        {event.date}
                      </span>
                    </div>
                    {event.detail && (
                      <p className="mb-1 text-xs text-text-muted">
                        {event.detail}
                      </p>
                    )}
                    <h3 className="text-lg font-bold text-text-bright">
                      {event.title}
                    </h3>
                    <p className="mt-1 text-sm text-text-muted">
                      {event.description}
                    </p>
                  </div>
                </div>

                <div className="relative hidden md:flex md:items-center">
                  <div
                    className={`absolute left-1/2 h-4 w-4 -translate-x-1/2 rounded-full ${dotBg} ring-4 ring-bg z-10`}
                  />

                  {isLeft ? (
                    <>
                      <div className="w-1/2 pr-12 text-right">
                        <div className="card inline-block p-6 text-left">
                          <div className="mb-2 flex items-center justify-end gap-2">
                            <span
                              className={`text-xs font-semibold uppercase tracking-wider ${accentColor}`}
                            >
                              {event.date}
                            </span>
                            <span
                              className={`material-symbols-rounded text-xl ${accentColor}`}
                            >
                              {event.icon}
                            </span>
                          </div>
                          {event.detail && (
                            <p className="mb-1 text-right text-xs text-text-muted">
                              {event.detail}
                            </p>
                          )}
                          <h3 className="text-lg font-bold text-text-bright">
                            {event.title}
                          </h3>
                          <p className="mt-1 text-sm text-text-muted">
                            {event.description}
                          </p>
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
                            <span
                              className={`material-symbols-rounded text-xl ${accentColor}`}
                            >
                              {event.icon}
                            </span>
                            <span
                              className={`text-xs font-semibold uppercase tracking-wider ${accentColor}`}
                            >
                              {event.date}
                            </span>
                          </div>
                          {event.detail && (
                            <p className="mb-1 text-xs text-text-muted">
                              {event.detail}
                            </p>
                          )}
                          <h3 className="text-lg font-bold text-text-bright">
                            {event.title}
                          </h3>
                          <p className="mt-1 text-sm text-text-muted">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-3xl pb-8 text-center">
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-center gap-2 text-text-muted">
            <span className="material-symbols-rounded text-lg text-primary">
              public
            </span>
            <p className="text-sm">
              All times are in <span className="font-semibold text-text-bright">UTC</span>.
              Make sure to convert to your local timezone.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
