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
  slug: string;
  description: string;
  content?: LexicalRoot | null;
  category: "setup" | "development" | "tips";
  difficulty: "beginner" | "intermediate" | "advanced";
  readTime?: string;
  icon?: string;
  coverImage?: { id: string; url: string; alt?: string } | string | null;
  externalUrl?: string;
  order: number;
};

export type LexicalNode = {
  type: string;
  version?: number;
  text?: string;
  format?: number | string;
  tag?: string;
  url?: string;
  fields?: { url?: string; newTab?: boolean; linkType?: string };
  listType?: "number" | "bullet";
  language?: string;
  code?: string;
  value?: { id: string; url?: string; alt?: string } | string;
  relationTo?: string;
  altText?: string;
  caption?: { editorState?: LexicalRoot } | string;
  children?: LexicalNode[];
};

export type LexicalRoot = {
  root: LexicalNode;
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

export type MediaItem = {
  id: string;
  url: string;
  alt?: string;
  filename?: string;
  mimeType?: string;
  width?: number;
  height?: number;
};

export type DevLog = {
  id: string;
  title: string;
  body: LexicalRoot;
  team: Team | string;
  author: Participant | string;
  images?: { image: MediaItem | string; caption?: string }[];
  videoUrl?: string;
  publishedAt: string;
  createdAt: string;
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
