import { defineField, defineType } from "sanity";

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  // Singleton — the studio config pins this to a fixed document ID
  // so only one instance ever exists.
  groups: [
    { name: "general", title: "General" },
    { name: "navigation", title: "Navigation" },
    { name: "homepage", title: "Homepage" },
    { name: "coffeePage", title: "Coffee Page" },
    { name: "gearPage", title: "Gear Page" },
    { name: "footer", title: "Footer" },
  ],
  fields: [
    // ── General ────────────────────────────────────────────────────────────
    defineField({
      name: "siteTitle",
      title: "Site Title",
      type: "string",
      group: "general",
      description: "Appears in the browser tab and as the site name in search results.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "siteDescription",
      title: "Site Meta Description",
      type: "text",
      rows: 2,
      group: "general",
      description: "Default description for search engines and social share cards.",
    }),
    defineField({
      name: "instagramHandle",
      title: "Instagram Handle",
      type: "string",
      group: "general",
      description: "Without the @ symbol — e.g. flatwhiteframes",
    }),

    // ── Navigation ─────────────────────────────────────────────────────────
    defineField({
      name: "navCoffeeLabel",
      title: "Coffee Nav Label",
      type: "string",
      group: "navigation",
      initialValue: "Coffee Log",
    }),
    defineField({
      name: "navGearLabel",
      title: "Gear Nav Label",
      type: "string",
      group: "navigation",
      initialValue: "Gear",
    }),

    // ── Homepage ───────────────────────────────────────────────────────────
    defineField({
      name: "heroEyebrow",
      title: "Hero Eyebrow",
      type: "string",
      group: "homepage",
      description: "Small label above the headline.",
      initialValue: "Coffee & Cameras",
    }),
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      group: "homepage",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroAbout",
      title: "About Text",
      type: "text",
      rows: 3,
      group: "homepage",
      description: "The short intro paragraph below the headline.",
    }),
    defineField({
      name: "heroCoffeeCtaLabel",
      title: "Coffee CTA Button Label",
      type: "string",
      group: "homepage",
      initialValue: "Browse the Coffee Log",
    }),
    defineField({
      name: "heroInstagramCtaLabel",
      title: "Instagram CTA Label",
      type: "string",
      group: "homepage",
      description: "The text link next to the CTA button.",
      initialValue: "@flatwhiteframes on Instagram",
    }),
    defineField({
      name: "latestVisitsHeading",
      title: "Latest Visits Section Heading",
      type: "string",
      group: "homepage",
      initialValue: "Latest Visits",
    }),
    defineField({
      name: "gearTeaserHeading",
      title: "Gear Teaser Heading",
      type: "string",
      group: "homepage",
      initialValue: "What's in the Bag",
    }),
    defineField({
      name: "gearTeaserBody",
      title: "Gear Teaser Body Text",
      type: "text",
      rows: 3,
      group: "homepage",
    }),
    defineField({
      name: "gearTeaserCtaLabel",
      title: "Gear Teaser CTA Label",
      type: "string",
      group: "homepage",
      initialValue: "See the Gear Index",
    }),

    // ── Coffee Page ────────────────────────────────────────────────────────
    defineField({
      name: "coffeePageEyebrow",
      title: "Eyebrow",
      type: "string",
      group: "coffeePage",
      initialValue: "The Log",
    }),
    defineField({
      name: "coffeePageHeading",
      title: "Page Heading",
      type: "string",
      group: "coffeePage",
      initialValue: "Coffee Shop Log",
    }),
    defineField({
      name: "coffeePageDescription",
      title: "Meta Description",
      type: "text",
      rows: 2,
      group: "coffeePage",
    }),

    // ── Gear Page ──────────────────────────────────────────────────────────
    defineField({
      name: "gearPageEyebrow",
      title: "Eyebrow",
      type: "string",
      group: "gearPage",
      initialValue: "What's in the Bag",
    }),
    defineField({
      name: "gearPageHeading",
      title: "Page Heading",
      type: "string",
      group: "gearPage",
      initialValue: "Gear Index",
    }),
    defineField({
      name: "gearPageAbout",
      title: "About Text",
      type: "text",
      rows: 3,
      group: "gearPage",
      description: "Intro paragraph shown below the page heading.",
    }),
    defineField({
      name: "gearPageDescription",
      title: "Meta Description",
      type: "text",
      rows: 2,
      group: "gearPage",
      description: "Used by search engines and social share cards — not shown on the page.",
    }),

    // ── Footer ─────────────────────────────────────────────────────────────
    defineField({
      name: "footerTagline",
      title: "Footer Tagline",
      type: "string",
      group: "footer",
      description: "Short italic line in the footer.",
      initialValue: "Flat White Frames — coffee & cameras",
    }),
  ],

  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
