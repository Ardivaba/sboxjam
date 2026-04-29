export type RuleSeedData = {
  title: string;
  icon: string;
  order: number;
  items: { text: string }[];
};

export const rulesData: RuleSeedData[] = [
  {
    title: "Eligibility",
    icon: "verified_user",
    order: 1,
    items: [
      { text: "Must have a valid s&box account" },
      { text: "Participants must be 13 years or older" },
      { text: "Teams of 1-4 people are allowed" },
      { text: "You may only be on one team" },
      { text: "Both new and experienced developers welcome" },
    ],
  },
  {
    title: "Theme",
    icon: "category",
    order: 2,
    items: [
      { text: "The theme will be revealed at the start of the jam" },
      { text: "Your game must incorporate the theme in a meaningful way" },
      { text: "Interpretation of the theme is up to you — be creative" },
      { text: "Theme adherence is part of the judging criteria" },
    ],
  },
  {
    title: "Timeline",
    icon: "timer",
    order: 3,
    items: [
      { text: "The jam lasts one week from theme reveal" },
      { text: "Start: Friday, June 13, 2026 at 6:00 PM UTC" },
      { text: "End: Friday, June 20, 2026 at 6:00 PM UTC" },
      { text: "Late submissions will not be accepted" },
      { text: "You may submit early and update until the deadline" },
    ],
  },
  {
    title: "Submissions",
    icon: "upload_file",
    order: 4,
    items: [
      { text: "All core gameplay must be created during the jam window" },
      { text: "Pre-existing code libraries and frameworks are allowed" },
      { text: "Pre-made assets (sounds, textures) are allowed if you have the license" },
      { text: "Your game must be playable within s&box" },
      { text: "Include a short description and screenshots with your submission" },
    ],
  },
  {
    title: "Judging Criteria",
    icon: "gavel",
    order: 5,
    items: [
      { text: "Creativity & Originality — 25%" },
      { text: "Gameplay & Fun Factor — 25%" },
      { text: "Polish & Presentation — 20%" },
      { text: "Theme Adherence — 20%" },
      { text: "Technical Achievement — 10%" },
    ],
  },
  {
    title: "Code of Conduct",
    icon: "shield",
    order: 6,
    items: [
      { text: "No NSFW, hateful, or offensive content" },
      { text: "No harassment of other participants" },
      { text: "No plagiarism or stolen assets" },
      { text: "Respect the judges and their decisions" },
      { text: "Be supportive of fellow jammers" },
      { text: "Have fun and learn something new" },
    ],
  },
  {
    title: "Disqualification",
    icon: "block",
    order: 7,
    items: [
      { text: "Plagiarism or using another team's work" },
      { text: "Submitting a pre-existing game" },
      { text: "Submitting after the deadline" },
      { text: "Violating the Code of Conduct" },
    ],
  },
];
