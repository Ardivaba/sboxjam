type Role = "programmer" | "artist" | "sound" | "money";

export type TeamSeedData = {
  name: string;
  description: string;
  lookingForMembers: boolean;
  rolesNeeded: Role[];
  memberCount: number;
};

export const teamsData: TeamSeedData[] = [
  {
    name: "Pixel Pushers",
    description: "We make games that look pretty and play smooth. Looking for a sound designer!",
    lookingForMembers: true,
    rolesNeeded: ["sound"],
    memberCount: 3,
  },
  {
    name: "Runtime Terror",
    description: "Three devs who live for multiplayer chaos. Need someone who can model.",
    lookingForMembers: true,
    rolesNeeded: ["artist", "money"],
    memberCount: 2,
  },
  {
    name: "Scope Creep Studios",
    description: "We promise we'll keep it small this time. Narrator: they did not.",
    lookingForMembers: true,
    rolesNeeded: ["programmer", "artist"],
    memberCount: 2,
  },
  {
    name: "The Jam Jars",
    description: "Fourth jam together. We've got workflow down to a science.",
    lookingForMembers: false,
    rolesNeeded: [],
    memberCount: 2,
  },
];
