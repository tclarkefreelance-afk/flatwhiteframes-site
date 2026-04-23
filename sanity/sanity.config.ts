import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemas";
import { dataset, projectId } from "./env";

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
            // Singleton — always opens the same document, no list view
            S.listItem()
              .title("Site Settings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
                  .title("Site Settings")
              ),
            S.divider(),
            S.listItem()
              .title("Coffee Shops")
              .child(S.documentTypeList("cafe").title("Coffee Shops")),
            S.listItem()
              .title("Gear")
              .child(S.documentTypeList("gear").title("Gear")),
          ]),
    }),
  ],
});
