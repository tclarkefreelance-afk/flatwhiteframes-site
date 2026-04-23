import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

// Only create the client when projectId is available so builds succeed before
// env vars are configured (generateStaticParams returns [] in that case).
export const client = projectId
  ? createClient({ projectId, dataset, apiVersion, useCdn: true })
  : null;
