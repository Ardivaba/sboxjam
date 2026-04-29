import type { CollectionConfig } from "payload";

export const Guides: CollectionConfig = {
  slug: "guides",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "difficulty", "order"],
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
      required: true,
    },
    {
      name: "content",
      type: "textarea",
    },
    {
      name: "category",
      type: "select",
      required: true,
      options: [
        { label: "Setting Up", value: "setup" },
        { label: "Game Development", value: "development" },
        { label: "Jam Tips", value: "tips" },
      ],
    },
    {
      name: "difficulty",
      type: "select",
      required: true,
      options: [
        { label: "Beginner", value: "beginner" },
        { label: "Intermediate", value: "intermediate" },
        { label: "Advanced", value: "advanced" },
      ],
    },
    {
      name: "readTime",
      type: "text",
    },
    {
      name: "icon",
      type: "text",
      admin: {
        description: "Material Symbols icon name",
      },
    },
    {
      name: "externalUrl",
      type: "text",
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
    },
  ],
};
