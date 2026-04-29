import type { CollectionConfig } from "payload";

export const Teams: CollectionConfig = {
  slug: "teams",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "leader",
      type: "relationship",
      relationTo: "participants",
      required: true,
    },
    {
      name: "members",
      type: "relationship",
      relationTo: "participants",
      hasMany: true,
    },
    {
      name: "maxMembers",
      type: "number",
      defaultValue: 4,
      min: 1,
      max: 8,
    },
    {
      name: "inviteCode",
      type: "text",
      unique: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "lookingForMembers",
      type: "checkbox",
      defaultValue: true,
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === "create" && !data?.inviteCode) {
          data!.inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        }
        return data;
      },
    ],
  },
};
