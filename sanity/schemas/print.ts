import { defineField, defineType } from "sanity";

export const printSchema = defineType({
  name: "print",
  title: "Print",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "string" }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "A short description shown on the print page.",
    }),
    defineField({
      name: "available",
      title: "Show in shop",
      type: "boolean",
      description: "Uncheck to hide this print from the shop without deleting it.",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "Lower numbers appear first. Leave blank to use alphabetical order.",
    }),
  ],
  preview: {
    select: { title: "name", media: "image", available: "available" },
    prepare({ title, media, available }) {
      return {
        title,
        subtitle: available ? "Available" : "Hidden",
        media,
      };
    },
  },
  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }, { field: "name", direction: "asc" }],
    },
  ],
});
