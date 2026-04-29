export type ScheduleEventSeedData = {
  title: string;
  description: string;
  date: string;
  dateLabel?: string;
  icon: string;
  accent: "primary" | "warning" | "error";
  order: number;
};

export const scheduleData: ScheduleEventSeedData[] = [
  {
    title: "Registration Opens",
    description: "Sign up and start forming your team. Solo participants are welcome too.",
    date: "2026-05-15T12:00:00.000Z",
    dateLabel: "Thursday, 12:00 PM UTC",
    icon: "app_registration",
    accent: "primary",
    order: 1,
  },
  {
    title: "Team Formation Deadline",
    description: "All teams must be finalized and locked in by this date. No member changes after this point.",
    date: "2026-06-01T23:59:00.000Z",
    dateLabel: "Sunday, 11:59 PM UTC",
    icon: "group",
    accent: "primary",
    order: 2,
  },
  {
    title: "Theme Reveal & Jam Starts",
    description: "The theme is revealed and the one-week jam begins. Start building!",
    date: "2026-06-13T18:00:00.000Z",
    dateLabel: "Friday, 6:00 PM UTC",
    icon: "rocket_launch",
    accent: "warning",
    order: 3,
  },
  {
    title: "Submissions Close",
    description: "You have one week. All submissions must be uploaded before the deadline.",
    date: "2026-06-20T18:00:00.000Z",
    dateLabel: "Friday, 6:00 PM UTC",
    icon: "upload_file",
    accent: "error",
    order: 4,
  },
  {
    title: "Judging Period",
    description: "Our panel of judges plays and evaluates every submission across all criteria.",
    date: "2026-06-21T00:00:00.000Z",
    dateLabel: "June 21–25",
    icon: "gavel",
    accent: "primary",
    order: 5,
  },
  {
    title: "Winners Announced",
    description: "Results revealed during a live stream event.",
    date: "2026-06-28T18:00:00.000Z",
    dateLabel: "Sunday, 6:00 PM UTC",
    icon: "emoji_events",
    accent: "warning",
    order: 6,
  },
];
