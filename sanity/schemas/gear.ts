import { defineField, defineType } from "sanity";

export const gearSchema = defineType({
  name: "gear",
  title: "Gear Item",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
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
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Camera Gear", value: "camera-gear" },
          { title: "Tech", value: "tech" },
          { title: "Accessories", value: "accessories" },
          { title: "Misc", value: "misc" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shortReview",
      title: "Short Review",
      description: "One or two sentences for the card preview.",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "body",
      title: "Full Review",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "samplePhoto",
      title: "Sample Photo",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", type: "string", title: "Alt text" }),
        defineField({ name: "caption", type: "string", title: "Caption" }),
      ],
    }),
    defineField({
      name: "rating",
      title: "Rating (1–5)",
      type: "number",
      options: { list: [1, 2, 3, 4, 5] },
    }),
    defineField({
      name: "stillOwn",
      title: "Still Own?",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "buyLink",
      title: "Buy / Find It",
      type: "url",
    }),
    defineField({
      name: "specs",
      title: "Key Specs",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", title: "Label" }),
            defineField({ name: "value", type: "string", title: "Value" }),
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category",
      media: "samplePhoto",
    },
  },
  orderings: [
    {
      title: "Category",
      name: "categoryAsc",
      by: [{ field: "category", direction: "asc" }],
    },
  ],
});
