import type { CollectionConfig } from "payload";

export const JoinRequests: CollectionConfig = {
  slug: "join-requests",
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  admin: {
    defaultColumns: ["participant", "team", "status", "createdAt"],
  },
  fields: [
    {
      name: "participant",
      type: "relationship",
      relationTo: "participants",
      required: true,
    },
    {
      name: "team",
      type: "relationship",
      relationTo: "teams",
      required: true,
    },
    {
      name: "message",
      type: "textarea",
    },
    {
      name: "status",
      type: "select",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Accepted", value: "accepted" },
        { label: "Declined", value: "declined" },
      ],
      defaultValue: "pending",
      required: true,
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation, req }) => {
        if (operation === "create" && !data?.participant && req.user) {
          data!.participant = req.user.id;
        }
        return data;
      },
    ],
  },
};
