export const ROLES = ["programmer", "artist", "sound", "money"] as const;

export type Role = (typeof ROLES)[number];

// Teams recruit for craft roles only — "money" is something a person brings,
// not a slot a team advertises.
export const RECRUITABLE_ROLES = ["programmer", "artist", "sound"] as const;

export type RecruitableRole = (typeof RECRUITABLE_ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  programmer: "Programmer",
  artist: "Artist",
  sound: "Sound",
  money: "Money",
};

export type Media = {
  id: string;
  url?: string;
  filename?: string;
  alt?: string;
  mimeType?: string;
};

export type PortfolioItem = {
  id?: string;
  title: string;
  description?: string;
  image?: Media | string | null;
  videoUrl?: string;
  url?: string;
};

export type Participant = {
  id: string;
  username: string;
  email?: string;
  lookingForTeam?: boolean;
  roles?: Role[];
  bio?: string;
  skills?: { id?: string; skill: string }[];
  discordHandle?: string;
  sboxProfileUrl?: string;
  avatar?: Media | string | null;
  portfolio?: PortfolioItem[];
};

export type Team = {
  id: string;
  name: string;
  description?: string;
  leader: Participant | string;
  members: (Participant | string)[];
  maxMembers: number;
  rolesNeeded?: Role[];
  discordUrl?: string;
  inviteCode: string;
  lookingForMembers: boolean;
  createdAt: string;
};

export type JoinRequest = {
  id: string;
  participant: Participant | string;
  team: Team | string;
  message?: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
};
