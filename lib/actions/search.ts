import { vercelDocsIndex } from '@/lib/client/upstash'

export interface SearchResult {
  title: string
  content: string
  url: string
}

export interface SearchResponse {
  results: SearchResult[]
  query: string
  error?: string
}

export async function searchVercelDocs(query: string): Promise<SearchResponse> {
  try {
    const results = await vercelDocsIndex.search({ query });
    
    const formattedResults: SearchResult[] = results.slice(0, 2).map((result: any) => ({
      title: result.content?.title || 'Untitled',
      content: result.content?.text || 'No content',
      url: result.content?.url || ''
    }));

    return { results: formattedResults, query };
  } catch (error) {
    console.error('Error searching Vercel docs:', error);
    return { results: [], query, error: 'Search failed' };
  }
}