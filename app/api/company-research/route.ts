import { generateObject, stepCountIs } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'

const companyResearchSchema = z.object({
  companySummary: z.string().describe("A one-sentence summary of what the company does."),
  techInsights: z.string().describe("Brief note on their tech stack or engineering culture."),
  vercelConnection: z.array(z.string()).describe("Top 3-4 likely reasons they're exploring Vercel."),
  keyQuestions: z.array(z.string()).describe("3 pointed, open-ended questions to uncover their needs.")
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 })
    }

    // Extract domain from email for company research
    const domain = email.split('@')[1]

    const { object: researchData } = await generateObject({
      model: openai('gpt-4.1'),
      schema: companyResearchSchema,
      prompt: `Research the company with domain: ${domain}. Your goal is to provide a sales executive with a concise briefing for a call.

      1. **Company Summary:** In one sentence, what does this company do?
      2. **Tech Insights:** What can you infer about their tech stack or engineering culture from public data (e.g., "React shop", "Hiring Svelte devs")? If not obvious, state that.
      3. **Vercel Connection:** What are the top 3-4 likely reasons they're exploring Vercel? Consider their industry, product, and pain points Vercel solves (e.g., "Slow e-commerce site," "Faster CI/CD," "New marketing site").
      4. **Key Questions:** What are 3 pointed, open-ended questions to uncover their needs, based on the Vercel Connection insights?
      
      Be concise and direct.`,
    })


    console.log(`=== COMPANY RESEARCH RESULT ===`)
    console.log(`Domain: ${domain}`)
    console.log(`Research Data: ${JSON.stringify(researchData, null, 2)}`)

    return Response.json(researchData)
  } catch (error) {
    console.error('Error conducting company research:', error)
    return Response.json({ error: 'Failed to conduct company research' }, { status: 500 })
  }
}