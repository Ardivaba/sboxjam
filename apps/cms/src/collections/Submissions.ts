import type { CollectionConfig } from "payload";

export const Submissions: CollectionConfig = {
  slug: "submissions",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "team", "submittedAt", "status"],
  },
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
      name: "team",
      type: "relationship",
      relationTo: "teams",
      required: true,
    },
    {
      name: "gameUrl",
      type: "text",
    },
    {
      name: "sourceUrl",
      type: "text",
    },
    {
      name: "thumbnail",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "screenshots",
      type: "array",
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
    {
      name: "status",
      type: "select",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Submitted", value: "submitted" },
        { label: "Under Review", value: "reviewing" },
        { label: "Accepted", value: "accepted" },
        { label: "Disqualified", value: "disqualified" },
      ],
      defaultValue: "draft",
    },
    {
      name: "submittedAt",
      type: "date",
    },
  ],
};
