export type PrizeSeedData = {
  title: string;
  amount: string;
  description?: string;
  category: "grand" | "runner-up" | "category" | "honorable";
  perks?: { perk: string }[];
  icon: string;
  order: number;
  sponsor?: string;
};

// Total pool: $1,500
//   1st       $525  (35%)
//   2nd       $300  (20%)
//   3rd       $175  (~12%)
//   4 × $125  $500  (~33%)  — category awards
export const prizesData: PrizeSeedData[] = [
  {
    title: "1st Place",
    amount: "$525",
    description: "Top entry as judged across all criteria.",
    category: "grand",
    icon: "emoji_events",
    order: 1,
  },
  {
    title: "2nd Place",
    amount: "$300",
    category: "runner-up",
    icon: "military_tech",
    order: 2,
  },
  {
    title: "3rd Place",
    amount: "$175",
    category: "runner-up",
    icon: "workspace_premium",
    order: 3,
  },
  {
    title: "Best Open-Source Project",
    amount: "$125",
    description: "Most useful open-source contribution that others can build on.",
    category: "category",
    icon: "code",
    order: 4,
  },
  {
    title: "Best Sound Design",
    amount: "$125",
    description: "Outstanding audio work — music, SFX, or both.",
    category: "category",
    icon: "music_note",
    order: 5,
  },
  {
    title: "Best Visuals",
    amount: "$125",
    description: "Most striking visual style or art direction.",
    category: "category",
    icon: "palette",
    order: 6,
  },
  {
    title: "Best Game Feel",
    amount: "$125",
    description: "Tightest controls, smoothest moment-to-moment gameplay.",
    category: "category",
    icon: "sports_esports",
    order: 7,
  },
  {
    title: "Most Original Concept",
    amount: "Featured",
    description: "Boldest take on the theme — even if rough around the edges.",
    category: "honorable",
    icon: "lightbulb",
    order: 8,
  },
  {
    title: "Best First-Time Submission",
    amount: "Featured",
    description: "Strongest entry from someone shipping their first jam game.",
    category: "honorable",
    icon: "auto_awesome",
    order: 9,
  },
];
