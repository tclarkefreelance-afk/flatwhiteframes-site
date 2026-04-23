import { defineField, defineType } from "sanity";

export const cafeSchema = defineType({
  name: "cafe",
  title: "Coffee Shop",
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
      name: "city",
      title: "City",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "country",
      title: "Country",
      type: "string",
    }),
    defineField({
      name: "visitDate",
      title: "Visit Date",
      type: "date",
    }),
    defineField({
      name: "rating",
      title: "Rating (1–5)",
      type: "number",
      options: {
        list: [1, 2, 3, 4, 5],
      },
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: "shortNotes",
      title: "Short Notes",
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
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", type: "string", title: "Alt text" }),
      ],
    }),
    defineField({
      name: "photos",
      title: "Photo Gallery",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", type: "string", title: "Alt text" }),
            defineField({ name: "caption", type: "string", title: "Caption" }),
          ],
        },
      ],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Specialty Coffee", value: "specialty" },
          { title: "Good for Working", value: "good-for-working" },
          { title: "Dog Friendly", value: "dog-friendly" },
          { title: "Outdoor Seating", value: "outdoor-seating" },
          { title: "Great Food", value: "great-food" },
          { title: "Hidden Gem", value: "hidden-gem" },
          { title: "Photogenic", value: "photogenic" },
          { title: "Local Roaster", value: "local-roaster" },
        ],
        layout: "tags",
      },
    }),
    defineField({
      name: "website",
      title: "Website URL",
      type: "url",
    }),
    defineField({
      name: "instagram",
      title: "Instagram Handle",
      type: "string",
      description: "Without the @ symbol",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "city",
      media: "coverImage",
    },
  },
  orderings: [
    {
      title: "Visit Date, Newest",
      name: "visitDateDesc",
      by: [{ field: "visitDate", direction: "desc" }],
    },
  ],
});
