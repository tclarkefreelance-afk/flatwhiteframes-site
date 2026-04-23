import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";
import { apiVersion, dataset, projectId } from "./env";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Flat White Frames")
          .items([
            S.listItem()
              .title("Coffee Shops")
              .child(S.documentTypeList("cafe").title("Coffee Shops")),
            S.listItem()
              .title("Gear")
              .child(S.documentTypeList("gear").title("Gear")),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
