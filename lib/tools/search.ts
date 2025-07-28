import { tool } from 'ai'
import { z } from 'zod'
import { searchVercelDocs } from '@/lib/actions/search'

export const searchVercel = tool({
  description: 'Search Vercel documentation and resources for relevant information. Use this when you need specific technical details about Vercel features, best practices, or solutions. Note that there are no sales best practices in the knowledgebase, so you should not use this tool to research sales best practices, just information about features and solutions.',
  inputSchema: z.object({
    query: z.string().describe('Search query for Vercel documentation'),
  }),
  execute: async ({ query }) => searchVercelDocs(query),
});