import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

// Only create the client when projectId is available so builds succeed before
// env vars are configured (generateStaticParams returns [] in that case).
//
// useCdn: false — avoids Sanity's CDN caching layer so Next.js ISR is the
// single source of truth for freshness. With useCdn: true, Sanity's CDN has
// its own TTL that sits on top of ISR, causing published changes to be
// invisible until both caches expire independently.
export const client = projectId
  ? createClient({ projectId, dataset, apiVersion, useCdn: false })
  : null;
