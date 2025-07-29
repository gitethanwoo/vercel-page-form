import fs from 'node:fs/promises';
import path from 'node:path';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { compileMDX } from 'next-mdx-remote/rsc';
import { Header } from '@/components/header';

export const dynamic = 'force-static';

export default async function SolutionOverview() {

  const mdPath = path.join(process.cwd(), 'content', 'solution-overview.mdx');
  const raw = await fs.readFile(mdPath, 'utf8');

  const { content } = await compileMDX({
    source: raw,
    options: { 
      mdxOptions: { 
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeHighlight]
      } 
    }
  });

  return (
    <>
      <Header />
      <article className="max-w-[52rem] mx-auto py-12 px-4 prose">
        {content}
      </article>
    </>
  );
}