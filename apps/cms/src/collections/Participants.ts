import type { CollectionConfig } from "payload";
import { discordAuthorize, discordCallback } from "../oauth/discord";

export const ROLE_OPTIONS = [
  { label: "Programmer", value: "programmer" },
  { label: "Artist", value: "artist" },
  { label: "Sound", value: "sound" },
  { label: "Money", value: "money" },
];

// Teams cannot recruit for "money".
export const RECRUITABLE_ROLE_OPTIONS = ROLE_OPTIONS.filter((o) => o.value !== "money");

export const Participants: CollectionConfig = {
  slug: "participants",
  auth: {
    // Discord OAuth issues week-long sessions; there is no password UI.
    tokenExpiration: 60 * 60 * 24 * 7,
  },
  access: {
    // Accounts are only created through the Discord OAuth flow (local API
    // bypasses this) — no public username/password registration.
    create: () => false,
    read: () => true,
  },
  endpoints: [discordAuthorize, discordCallback],
  admin: {
    useAsTitle: "username",
    defaultColumns: ["username", "roles", "lookingForTeam"],
  },
  fields: [
    {
      name: "username",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "discordId",
      type: "text",
      unique: true,
      index: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "avatarUrl",
      type: "text",
      admin: {
        description: "Discord avatar, synced on login",
      },
    },
    {
      name: "lookingForTeam",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "Shown in the player directory when enabled",
      },
    },
    {
      name: "roles",
      type: "select",
      hasMany: true,
      options: ROLE_OPTIONS,
    },
    {
      name: "bio",
      type: "textarea",
    },
    {
      name: "skills",
      type: "array",
      fields: [
        {
          name: "skill",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "discordHandle",
      type: "text",
    },
    {
      name: "sboxProfileUrl",
      type: "text",
      admin: {
        description: "Link to sbox.game profile",
      },
    },
    {
      name: "avatar",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "portfolio",
      type: "array",
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
        },
        {
          name: "description",
          type: "textarea",
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
        },
        {
          name: "videoUrl",
          type: "text",
          admin: {
            description: "YouTube or other video URL",
          },
        },
        {
          name: "url",
          type: "text",
          admin: {
            description: "Link to the project (sbox.game page, GitHub, etc.)",
          },
        },
      ],
    },
  ],
};
