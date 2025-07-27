import { generateObject, generateText, stepCountIs, tool } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'

const searchVercel = tool({
  description: 'Search Vercel documentation and resources for relevant information. Use this when you need specific technical details about Vercel features, best practices, or solutions. Note that there are no sales best practices in the knowledgebase, so you should not use this tool to research sales best practices, just information about features and solutions.',
  inputSchema: z.object({
    query: z.string().describe('Search query for Vercel documentation'),
  }),
  execute: async ({ query }: { query: string }) => {
    try {
      const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      
      const response = await fetch(`${baseUrl}/api/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();
      const results = data.results?.slice(0, 2).map((result: any) => ({
        title: result.content?.title || 'Untitled',
        content: result.content?.text || 'No content',
        url: result.content?.url || ''
      })) || [];

      return { results, query };
    } catch (error) {
      console.error('Error searching Vercel docs:', error);
      return { results: [], query, error: 'Search failed' };
    }
  },
});


export async function POST(request: Request) {
  try {
    const { formData } = await request.json();
    
    if (!formData) {
      return Response.json({ error: 'Form data is required' }, { status: 400 });
    }

    const is_bot = await generateObject({
      model: openai('gpt-4.1-nano'),
      schema: z.object({
        is_bot: z.boolean().describe('Whether the form submission is from a bot'),
      }),
      prompt: `Identify if the form submission is from a bot. Note that this form is on the Vercel website, where someone has entered their company email address and clicked 'talk to sales'. If the subject matter is significantly different from what we would expect, it is likely a bot. If the subject matter is similar to what we would expect, it is likely a human. You only need to be 40% sure it's a human. Here is the form data: ${JSON.stringify(formData, null, 2)}`,
    })

    if (is_bot.object.is_bot) {
      return Response.json({ error: 'Form submission is from a bot' }, { status: 400 })
    }

    // Phase 1: Research with o3
    const researchResult = await generateText({
      model: openai('o3'),
      tools: {
        searchVercel: searchVercel,
        web_search_preview: openai.tools.webSearchPreview({
          searchContextSize: 'high',
        }),
      },
      prompt: `You are a research assistant helping to gather business information about a potential customer for a sales team.

## Research Task
Research the company to provide context for crafting a personalized sales response. Focus ONLY on business/company information.

## Research Guidelines
1. Search for the domain connected to their email address
2. Understand their industry, company size, and technical context
3. Use the searchVercel tool to find relevant case studies, guides, and solutions
4. Use web_search for additional context about their tech stack, challenges, or industry

### Important: NO PERSONAL RESEARCH
- Do NOT research the individual person submitting the form
- Do NOT look up personal profiles, LinkedIn, or individual backgrounds
- Focus ONLY on the company and business context
- Keep all research professional and company-focused

## Output Format
Provide your research findings in this structured format:

COMPANY RESEARCH:
- Company name and industry
- Company size and scale
- Key products/services
- Technical stack or relevant technology usage
- Recent news or developments

VERCEL RELEVANCE:
- Relevant Vercel solutions or case studies
- Technical challenges Vercel could address
- Similar companies or use cases
- These should come from the knowledgebase, not the web - do not mention case studies, success stories, or example companies unless you explicitly know they are using Vercel and can cite a specific example. 

INSIGHTS:
- Key pain points or opportunities
- Technical requirements or constraints
- Decision-making factors

Form data: ${JSON.stringify(formData, null, 2)}`,
      stopWhen: stepCountIs(20),
      onStepFinish: (step) => {
        console.log(`Research step: ${step.text}`)
      }
    });

    // Phase 2: Email writing with ChatGPT-4o-latest
    const emailResult = await generateText({
      model: openai('chatgpt-4o-latest'),
      prompt: `You are a sales professional crafting a personalized, helpful response to a 'talk to sales' form submission.

## Response Format
Generate a concise email draft that includes:
- A warm, personalized opening that references specific details about their company/use case
- 2-3 thoughtful discovery questions to better understand their specific needs and challenges
- 1-2 relevant insights or solutions based on their needs (positioned as "here's how we might help")
- A clear next step or call-to-action

## Content Guidelines
### Tone
- Conversational yet professional
- Helpful and consultative, not pushy
- Knowledgeable but approachable
- Concise and respectful of their time

### Source Usage
- Synthesize findings naturally into your response
- Don't include inline citations or links unless specifically relevant
- Focus on insights rather than listing sources

### Social Proof
When relevant, mention similar companies or use cases that have succeeded with Vercel. (Do not mention companies unless you explicitly know they are using Vercel)

## Discovery Questions Guidelines
Lead with 2-3 specific questions that:
- Clarify their technical requirements or constraints
- Explore their timeline and decision criteria
- Understand their current pain points better
- Are relevant to providing a more tailored solution
- Show genuine interest in their specific situation

Original form data: ${JSON.stringify(formData, null, 2)}

## Research Context
Here is the research gathered about the prospect:
${researchResult.text}

Write the email response:`,
      onStepFinish: (step) => {
        console.log(`Email writing step: ${step.text}`)
      }
    });

    console.log(`=== AI WORKFLOW RESULT ===`);
    console.log(`Form Data: ${JSON.stringify(formData, null, 2)}`);
    console.log(`Research Result: ${researchResult.text || 'No research generated'}`);
    console.log(`Email Result: ${emailResult.text || 'No email generated'}`);
    console.log(`Research steps taken: ${researchResult.steps?.length || 0}`);
    console.log(`Email steps taken: ${emailResult.steps?.length || 0}`);

    // Send to Slack webhook
    try {
      const slackWebhookUrl = `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}/api/slack/webhook`;
      
      await fetch(slackWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData,
          researchResult: researchResult.text,
          aiResponse: emailResult.text,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Slack webhook delivery failed:', error);
    }

    return Response.json({ 
      response: emailResult.text,
      research: researchResult.text 
    });
  } catch (error) {
    console.error('Error in AI workflow:', error);
    return Response.json({ error: 'Failed to process AI workflow' }, { status: 500 });
  }
}