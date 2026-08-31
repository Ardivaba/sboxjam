export const ROLES = ["programmer", "artist", "animator", "sound", "design", "writer"] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  programmer: "Programmer",
  artist: "Artist",
  animator: "Animator",
  sound: "Sound & Music",
  design: "Game Design",
  writer: "Writer",
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
