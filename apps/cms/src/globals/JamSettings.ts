import type { GlobalConfig } from "payload";

export const JamSettings: GlobalConfig = {
  slug: "jam-settings",
  access: {
    read: () => true,
  },
  admin: {
    group: "Settings",
  },
  fields: [
    {
      name: "jamName",
      type: "text",
      required: true,
      defaultValue: "s&box Jam 2026",
    },
    {
      name: "tagline",
      type: "text",
      defaultValue: "Build something incredible in 72 hours",
    },
    {
      name: "registrationOpen",
      type: "checkbox",
      defaultValue: true,
    },
    {
      name: "registrationStartDate",
      type: "date",
      admin: {
        date: { pickerAppearance: "dayAndTime" },
      },
    },
    {
      name: "jamStartDate",
      type: "date",
      required: true,
      admin: {
        date: { pickerAppearance: "dayAndTime" },
      },
    },
    {
      name: "jamEndDate",
      type: "date",
      required: true,
      admin: {
        date: { pickerAppearance: "dayAndTime" },
      },
    },
    {
      name: "theme",
      type: "text",
      admin: {
        description: "Revealed at jam start. Leave blank until reveal.",
      },
    },
    {
      name: "maxTeamSize",
      type: "number",
      defaultValue: 4,
      min: 1,
      max: 8,
    },
    {
      name: "prizePool",
      type: "text",
      defaultValue: "$10,000+",
    },
    {
      name: "judgingCriteria",
      type: "array",
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
        },
        {
          name: "weight",
          type: "number",
          required: true,
          min: 0,
          max: 100,
        },
      ],
    },
    {
      name: "submissionsOpen",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "winnersAnnounced",
      type: "checkbox",
      defaultValue: false,
    },
  ],
};
