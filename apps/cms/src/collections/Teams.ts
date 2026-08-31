import type { CollectionConfig } from "payload";
import { ROLE_OPTIONS } from "./Participants";

export const Teams: CollectionConfig = {
  slug: "teams",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "leader", "lookingForMembers"],
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
      name: "rolesNeeded",
      type: "select",
      hasMany: true,
      options: ROLE_OPTIONS,
      admin: {
        description: "Roles this team is recruiting for",
      },
    },
    {
      name: "discordUrl",
      type: "text",
      admin: {
        description: "Discord server invite or contact link",
      },
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
      ({ data, operation, req }) => {
        if (operation === "create") {
          if (!data?.inviteCode) {
            data!.inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
          }
          if (!data?.leader && req.user) {
            data!.leader = req.user.id;
          }
          if (!data?.members?.length && req.user) {
            data!.members = [req.user.id];
          }
        }
        return data;
      },
    ],
  },
};
