import type { CollectionConfig } from "payload";

export const ScheduleEvents: CollectionConfig = {
  slug: "schedule-events",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "date", "order"],
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
      name: "date",
      type: "date",
      required: true,
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
    {
      name: "dateLabel",
      type: "text",
      admin: {
        description: "Display label for the date, e.g. 'Friday, 6:00 PM UTC'",
      },
    },
    {
      name: "icon",
      type: "text",
      admin: {
        description: "Material Symbols icon name",
      },
    },
    {
      name: "accent",
      type: "select",
      options: [
        { label: "Primary (Blue)", value: "primary" },
        { label: "Warning (Gold)", value: "warning" },
        { label: "Error (Red)", value: "error" },
      ],
      defaultValue: "primary",
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
    },
  ],
};
