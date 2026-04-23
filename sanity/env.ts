// These are injected at build time as NEXT_PUBLIC_ vars.
// Empty string fallbacks allow the build to succeed even without a .env.local;
// the Studio and queries will simply fail gracefully until real values are set.
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
