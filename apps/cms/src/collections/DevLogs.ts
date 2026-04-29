import type { CollectionConfig } from "payload";

export const DevLogs: CollectionConfig = {
  slug: "devlogs",
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "team", "author", "publishedAt"],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "body",
      type: "richText",
      required: true,
    },
    {
      name: "team",
      type: "relationship",
      relationTo: "teams",
      required: true,
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "participants",
      required: true,
    },
    {
      name: "images",
      type: "array",
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        {
          name: "caption",
          type: "text",
        },
      ],
    },
    {
      name: "videoUrl",
      type: "text",
      admin: {
        description: "YouTube or other video embed URL",
      },
    },
    {
      name: "publishedAt",
      type: "date",
      admin: {
        date: { pickerAppearance: "dayAndTime" },
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === "create" && !data?.publishedAt) {
          data!.publishedAt = new Date().toISOString();
        }
        return data;
      },
    ],
  },
};
