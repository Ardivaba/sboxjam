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
    title: "Grand Prize",
    amount: "$5,000",
    description: "The best overall game wins the grand prize and gets featured on the s&box store.",
    category: "grand",
    perks: [
      { perk: "Featured on s&box Store" },
      { perk: "Exclusive Developer Badge" },
      { perk: "1 Year s&box Pro Subscription" },
    ],
    icon: "emoji_events",
    order: 1,
  },
  {
    title: "2nd Place",
    amount: "$2,500",
    description: "Runner-up with exceptional execution and creativity.",
    category: "runner-up",
    perks: [
      { perk: "s&box Store Spotlight" },
      { perk: "6 Months s&box Pro" },
    ],
    icon: "military_tech",
    order: 2,
  },
  {
    title: "3rd Place",
    amount: "$1,500",
    description: "Outstanding entry that impressed the judges.",
    category: "runner-up",
    perks: [
      { perk: "3 Months s&box Pro" },
    ],
    icon: "workspace_premium",
    order: 3,
  },
  {
    title: "Best Visuals",
    amount: "$250",
    description: "Most visually impressive game with outstanding art direction.",
    category: "category",
    icon: "palette",
    order: 4,
    sponsor: "Asset Party",
  },
  {
    title: "Most Innovative",
    amount: "$250",
    description: "The most creative and original game concept.",
    category: "category",
    icon: "lightbulb",
    order: 5,
  },
  {
    title: "Best Multiplayer",
    amount: "$250",
    description: "Best use of multiplayer and social features in s&box.",
    category: "category",
    icon: "groups",
    order: 6,
  },
  {
    title: "Community Choice",
    amount: "$250",
    description: "Voted by the community as their favorite entry.",
    category: "category",
    icon: "favorite",
    order: 7,
  },
  {
    title: "Best First Jam",
    amount: "$100",
    description: "Best entry from a first-time jam participant.",
    category: "honorable",
    icon: "stars",
    order: 8,
  },
  {
    title: "Best Solo Entry",
    amount: "$100",
    description: "Best game made by a single developer.",
    category: "honorable",
    icon: "person",
    order: 9,
  },
];
