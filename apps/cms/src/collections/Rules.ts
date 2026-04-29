import type { CollectionConfig } from "payload";

export const Rules: CollectionConfig = {
  slug: "rules",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "order"],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "content",
      type: "textarea",
    },
    {
      name: "icon",
      type: "text",
      admin: {
        description: "Material Symbols icon name",
      },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "items",
      type: "array",
      fields: [
        {
          name: "text",
          type: "text",
          required: true,
        },
      ],
    },
  ],
};
