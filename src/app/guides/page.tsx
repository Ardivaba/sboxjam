const SETUP_GUIDES = [
  {
    title: "Installing s&box",
    description: "Download and install s&box through Steam, and get your development environment ready.",
    readTime: "5 min",
    difficulty: "Beginner" as const,
    icon: "download",
  },
  {
    title: "Setting Up Your Dev Environment",
    description: "Configure your IDE, install extensions, and set up hot-reload for faster iteration.",
    readTime: "8 min",
    difficulty: "Beginner" as const,
    icon: "build",
  },
  {
    title: "Creating Your First Project",
    description: "Scaffold a new s&box game project and understand the project structure.",
    readTime: "10 min",
    difficulty: "Beginner" as const,
    icon: "rocket_launch",
  },
];

const DEV_GUIDES = [
  {
    title: "Understanding the Entity System",
    description: "Learn how entities work in s&box, including spawning, components, and lifecycle.",
    readTime: "15 min",
    difficulty: "Intermediate" as const,
    icon: "category",
  },
  {
    title: "Working with UI (Razor)",
    description: "Build game UI using Razor components, styling, and data binding.",
    readTime: "12 min",
    difficulty: "Intermediate" as const,
    icon: "web",
  },
  {
    title: "Networking & Multiplayer Basics",
    description: "Understand networked properties, RPCs, and syncing game state between clients.",
    readTime: "20 min",
    difficulty: "Advanced" as const,
    icon: "lan",
  },
  {
    title: "Asset Creation Pipeline",
    description: "Import models, textures, and sounds into your s&box project using the asset compiler.",
    readTime: "12 min",
    difficulty: "Intermediate" as const,
    icon: "view_in_ar",
  },
];

const JAM_TIPS = [
  {
    title: "Scoping Your Project",
    description: "Learn to plan a game you can realistically finish in 72 hours. Cut smart, not corners.",
    readTime: "6 min",
    difficulty: "Beginner" as const,
    icon: "target",
  },
  {
    title: "Working Effectively as a Team",
    description: "Divide tasks, manage source control, and communicate effectively during a jam.",
    readTime: "8 min",
    difficulty: "Beginner" as const,
    icon: "group",
  },
  {
    title: "Polishing for Submission",
    description: "Add juice, fix critical bugs, and make your game shine in the last hours of the jam.",
    readTime: "7 min",
    difficulty: "Intermediate" as const,
    icon: "auto_awesome",
  },
];

const RESOURCES = [
  {
    title: "s&box Wiki",
    description: "Official documentation covering all engine features and APIs.",
    url: "https://wiki.facepunch.com/sbox",
    icon: "menu_book",
  },
  {
    title: "s&box Discord",
    description: "Community Discord server for help, feedback, and collaboration.",
    url: "https://discord.gg/sbox",
    icon: "forum",
  },
  {
    title: "s&box GitHub",
    description: "Example projects, issue tracking, and community contributions.",
    url: "https://github.com/facepunch/sbox-issues",
    icon: "code",
  },
  {
    title: "Asset Party",
    description: "Browse and share community-made assets, tools, and libraries.",
    url: "https://asset.party",
    icon: "inventory_2",
  },
];

function DifficultyBadge({ level }: { level: "Beginner" | "Intermediate" | "Advanced" }) {
  const styles = {
    Beginner: "bg-success/15 text-success border-success/30",
    Intermediate: "bg-warning/15 text-warning border-warning/30",
    Advanced: "bg-error/15 text-error border-error/30",
  };

  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${styles[level]}`}>
      {level}
    </span>
  );
}

function GuideCard({
  title,
  description,
  readTime,
  difficulty,
  icon,
}: {
  title: string;
  description: string;
  readTime: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  icon: string;
}) {
  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="w-9 h-9 rounded-md bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
          <span className="material-symbols-rounded text-primary text-lg">{icon}</span>
        </div>
        <DifficultyBadge level={difficulty} />
      </div>
      <div className="flex-1">
        <h3 className="text-text-bright font-semibold mb-1">{title}</h3>
        <p className="text-text-muted text-sm leading-relaxed">{description}</p>
      </div>
      <div className="flex items-center gap-2 text-text-muted text-xs pt-1">
        <span className="material-symbols-rounded text-sm">schedule</span>
        <span>{readTime} read</span>
      </div>
    </div>
  );
}

export default function GuidesPage() {
  return (
    <div className="min-h-screen pt-[60px]">
      <div className="max-w-[1000px] mx-auto px-6 py-16">
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-text-bright mb-2">
            Getting <span className="text-gradient">Started</span>
          </h1>
          <p className="text-text-muted text-lg mb-12">
            Guides and resources to help you build your jam game from scratch.
          </p>
        </div>

        <div className="space-y-12">
          <section className="animate-fade-in">
            <div className="flex items-center gap-3 mb-5">
              <span className="material-symbols-rounded text-primary text-2xl">settings</span>
              <h2 className="text-xl font-semibold text-text-bright">Setting Up</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SETUP_GUIDES.map((guide) => (
                <GuideCard key={guide.title} {...guide} />
              ))}
            </div>
          </section>

          <section className="animate-fade-in">
            <div className="flex items-center gap-3 mb-5">
              <span className="material-symbols-rounded text-primary text-2xl">sports_esports</span>
              <h2 className="text-xl font-semibold text-text-bright">Game Development</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DEV_GUIDES.map((guide) => (
                <GuideCard key={guide.title} {...guide} />
              ))}
            </div>
          </section>

          <section className="animate-fade-in">
            <div className="flex items-center gap-3 mb-5">
              <span className="material-symbols-rounded text-primary text-2xl">emoji_events</span>
              <h2 className="text-xl font-semibold text-text-bright">Jam Tips</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {JAM_TIPS.map((guide) => (
                <GuideCard key={guide.title} {...guide} />
              ))}
            </div>
          </section>

          <section className="animate-fade-in">
            <div className="flex items-center gap-3 mb-5">
              <span className="material-symbols-rounded text-primary text-2xl">link</span>
              <h2 className="text-xl font-semibold text-text-bright">External Resources</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {RESOURCES.map((resource) => (
                <a
                  key={resource.title}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass rounded-lg p-5 flex items-start gap-4 group hover:border-primary/30 transition-all"
                >
                  <div className="w-10 h-10 rounded-md bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0 group-hover:bg-primary/25 transition-colors">
                    <span className="material-symbols-rounded text-primary">{resource.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-text-bright font-semibold group-hover:text-primary-light transition-colors">
                        {resource.title}
                      </h3>
                      <span className="material-symbols-rounded text-text-muted text-sm">open_in_new</span>
                    </div>
                    <p className="text-text-muted text-sm mt-1">{resource.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
