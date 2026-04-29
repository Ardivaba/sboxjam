import type { CollectionConfig } from "payload";

export const Prizes: CollectionConfig = {
  slug: "prizes",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "amount", "category", "order"],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "amount",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "category",
      type: "select",
      required: true,
      options: [
        { label: "Grand Prize", value: "grand" },
        { label: "Runner Up", value: "runner-up" },
        { label: "Category Award", value: "category" },
        { label: "Honorable Mention", value: "honorable" },
      ],
    },
    {
      name: "perks",
      type: "array",
      fields: [
        {
          name: "perk",
          type: "text",
          required: true,
        },
      ],
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
      name: "sponsor",
      type: "text",
    },
  ],
};
