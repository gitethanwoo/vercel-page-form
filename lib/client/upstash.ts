import { Search } from "@upstash/search"

export const searchClient = new Search({
  url: process.env.UPSTASH_SEARCH_REST_URL!,
  token: process.env.UPSTASH_SEARCH_REST_TOKEN!,
});

export const vercelDocsIndex = searchClient.index("vercel-docs");