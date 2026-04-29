import type { CollectionConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

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
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        description: "URL path segment. Auto-derived from title if blank.",
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value && typeof value === "string" && value.trim().length > 0) {
              return slugify(value);
            }
            if (data?.title) return slugify(String(data.title));
            return value;
          },
        ],
      },
    },
    {
      name: "description",
      type: "textarea",
      required: true,
    },
    {
      name: "content",
      type: "richText",
      editor: lexicalEditor(),
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
      name: "coverImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "externalUrl",
      type: "text",
      admin: {
        description: "If set, the guide row links here instead of the in-app detail page.",
      },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
    },
  ],
};
