import type { CollectionConfig } from "payload";

export const Participants: CollectionConfig = {
  slug: "participants",
  auth: true,
  access: {
    create: () => true,
    read: () => true,
  },
  admin: {
    useAsTitle: "username",
  },
  fields: [
    {
      name: "username",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "registeredForJam",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "team",
      type: "relationship",
      relationTo: "teams",
    },
    {
      name: "sboxAccountId",
      type: "text",
    },
  ],
};
