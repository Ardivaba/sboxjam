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

export const prizesData: PrizeSeedData[] = [
  {
    title: "1st Place",
    amount: "$500",
    description: "Top entry as judged across all criteria.",
    category: "grand",
    icon: "emoji_events",
    order: 1,
  },
  {
    title: "2nd Place",
    amount: "$500",
    category: "runner-up",
    icon: "military_tech",
    order: 2,
  },
  {
    title: "3rd Place",
    amount: "$500",
    category: "runner-up",
    icon: "workspace_premium",
    order: 3,
  },
  {
    title: "Best Open-Source Project",
    amount: "Honorable Mention",
    description: "Most useful open-source contribution that others can build on.",
    category: "honorable",
    icon: "code",
    order: 4,
  },
  {
    title: "Best Sound Design",
    amount: "Honorable Mention",
    description: "Outstanding audio work — music, SFX, or both.",
    category: "honorable",
    icon: "music_note",
    order: 5,
  },
];
