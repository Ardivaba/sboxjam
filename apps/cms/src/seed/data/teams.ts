export type TeamSeedData = {
  name: string;
  description: string;
  lookingForMembers: boolean;
};

export const teamsData: TeamSeedData[] = [
  {
    name: "Pixel Pushers",
    description: "We make games that look pretty and play smooth. Looking for a sound designer!",
    lookingForMembers: true,
  },
  {
    name: "Runtime Terror",
    description: "Three devs who live for multiplayer chaos. Need someone who can model.",
    lookingForMembers: true,
  },
  {
    name: "Scope Creep Studios",
    description: "We promise we'll keep it small this time. Narrator: they did not.",
    lookingForMembers: true,
  },
  {
    name: "null && void",
    description: "Systems programmers trying to make something fun for once. UI help wanted.",
    lookingForMembers: true,
  },
  {
    name: "The Jam Jars",
    description: "Fourth jam together. We've got workflow down to a science.",
    lookingForMembers: false,
  },
  {
    name: "Last Minute Legends",
    description: "We do our best work under pressure. All roles filled but say hi anyway.",
    lookingForMembers: false,
  },
  {
    name: "Voxel Vagrants",
    description: "Blocky art, big ambitions. Need one more coder comfortable with procedural gen.",
    lookingForMembers: true,
  },
  {
    name: "Git Blame Society",
    description: "We break things fast and fix them faster. Looking for a generalist.",
    lookingForMembers: true,
  },
];
