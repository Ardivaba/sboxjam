export type GuideSeedData = {
  title: string;
  description: string;
  category: "setup" | "development" | "tips";
  difficulty: "beginner" | "intermediate" | "advanced";
  readTime: string;
  icon: string;
  externalUrl?: string;
  order: number;
};

export const guidesData: GuideSeedData[] = [
  {
    title: "Installing s&box",
    description: "Download and set up s&box on your machine. Get the editor running and verify everything works.",
    category: "setup",
    difficulty: "beginner",
    readTime: "5 min",
    icon: "download",
    order: 1,
  },
  {
    title: "Setting Up Your Dev Environment",
    description: "Configure your IDE, install extensions, and set up hot-reload for a smooth development workflow.",
    category: "setup",
    difficulty: "beginner",
    readTime: "10 min",
    icon: "code",
    order: 2,
  },
  {
    title: "Creating Your First Project",
    description: "Bootstrap a new s&box game project from scratch. Understand the project structure and build pipeline.",
    category: "setup",
    difficulty: "beginner",
    readTime: "15 min",
    icon: "rocket_launch",
    order: 3,
  },
  {
    title: "Understanding the Entity System",
    description: "Learn how entities work in s&box — spawning, components, properties, and lifecycle hooks.",
    category: "development",
    difficulty: "intermediate",
    readTime: "20 min",
    icon: "hub",
    order: 4,
  },
  {
    title: "Working with UI (Razor)",
    description: "Build in-game UI using Razor components. Create HUDs, menus, and interactive panels.",
    category: "development",
    difficulty: "intermediate",
    readTime: "25 min",
    icon: "dashboard",
    order: 5,
  },
  {
    title: "Networking & Multiplayer",
    description: "Implement multiplayer features — RPCs, networked properties, client/server architecture.",
    category: "development",
    difficulty: "advanced",
    readTime: "30 min",
    icon: "lan",
    order: 6,
  },
  {
    title: "Asset Creation Pipeline",
    description: "Import models, textures, and sounds into your s&box project. Understand the asset compiler.",
    category: "development",
    difficulty: "intermediate",
    readTime: "20 min",
    icon: "view_in_ar",
    order: 7,
  },
  {
    title: "Scoping Your Project",
    description: "How to plan a game you can actually finish in 72 hours. Start small, cut features early, and polish what matters.",
    category: "tips",
    difficulty: "beginner",
    readTime: "8 min",
    icon: "target",
    order: 8,
  },
  {
    title: "Working Effectively as a Team",
    description: "Communication strategies, task splitting, version control tips, and avoiding merge conflicts during a jam.",
    category: "tips",
    difficulty: "beginner",
    readTime: "10 min",
    icon: "handshake",
    order: 9,
  },
  {
    title: "Polishing for Submission",
    description: "Last-hour tips: juice, screen shake, particles, sound effects, and a proper main menu make a huge difference.",
    category: "tips",
    difficulty: "intermediate",
    readTime: "12 min",
    icon: "auto_fix_high",
    order: 10,
  },
];
