export type Prize = {
  id: string;
  title: string;
  amount: string;
  description?: string;
  category: "grand" | "runner-up" | "category" | "honorable";
  perks?: { perk: string }[];
  icon?: string;
  order: number;
  sponsor?: string;
};

export type Rule = {
  id: string;
  title: string;
  content?: unknown;
  icon?: string;
  order: number;
  items?: { text: string }[];
};

export type Guide = {
  id: string;
  title: string;
  description: string;
  content?: unknown;
  category: "setup" | "development" | "tips";
  difficulty: "beginner" | "intermediate" | "advanced";
  readTime?: string;
  icon?: string;
  externalUrl?: string;
  order: number;
};

export type ScheduleEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  dateLabel?: string;
  icon?: string;
  accent: "primary" | "warning" | "error";
  order: number;
};

export type Team = {
  id: string;
  name: string;
  description?: string;
  leader: Participant | string;
  members: (Participant | string)[];
  maxMembers: number;
  inviteCode: string;
  lookingForMembers: boolean;
  createdAt: string;
};

export type Participant = {
  id: string;
  username: string;
  email: string;
  registeredForJam: boolean;
  team?: Team | string | null;
  sboxAccountId?: string;
};

export type JamSettings = {
  jamName: string;
  tagline: string;
  registrationOpen: boolean;
  registrationStartDate?: string;
  jamStartDate: string;
  jamEndDate: string;
  theme?: string;
  maxTeamSize: number;
  prizePool: string;
  judgingCriteria?: { name: string; weight: number }[];
  submissionsOpen: boolean;
  winnersAnnounced: boolean;
};
