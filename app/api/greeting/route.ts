import { generateText, stepCountIs } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 })
    }

    // Extract domain from email for company research
    const domain = email.split('@')[1]

    const result = await generateText({
      model: openai('gpt-4.1'),
      prompt: `Create a personalized Vercel sales greeting for someone with email: ${email}. 

The greeting should:
- Be warm and professional 
- Reference specific details about their company/industry
- Connect their business to how Vercel might help them reach their goals
- Ask how Vercel can assist them specifically
- Be 2-3 sentences maximum
<examples>
Example for a nonprofit organization:
"Hi Sarah! I came across Feeding America's incredible work in addressing food insecurity across the country. Given your mission to connect surplus food with families in need, I'd love to explore how Vercel's platform could help amplify your digital outreach and donation systems. How can we help Feeding America reach even more communities?"

Example for a tech startup:
"Hello Mike! I've been following Stripe's journey in simplifying online payments for businesses of all sizes. As you continue scaling your developer-first approach, Vercel's edge infrastructure could be a perfect fit for enhancing your documentation sites and developer tools. What are your biggest challenges in reaching developers globally?"
</examples>

<instructions>
- do not include any links, markdown, or non-textual content in your response
</instructions>`,
      tools: {
        web_search_preview: openai.tools.webSearchPreview({
          searchContextSize: 'medium',
        }),
      },
      prepareStep: async ({ stepNumber }) => {
        if (stepNumber === 0) {
          return {
            model: openai('gpt-4.1-mini'),
            prompt: `Research the company with domain: ${domain}. Find company name, industry, what they do, their mission/focus. Be thorough but concise.`,
            toolChoice: { type: 'tool', toolName: 'web_search_preview' },
            experimental_activeTools: ['web_search_preview'],
          }
        }
        return undefined
      },
    })

    console.log(`=== FINAL RESULT ===`)
    console.log(`Total steps executed: ${result.steps?.length || 'unknown'}`)
    console.log(`Final result: ${result.text?.substring(0, 200)}...`)

    return Response.json({ greeting: result.text })
  } catch (error) {
    console.error('Error generating greeting:', error)
    return Response.json({ error: 'Failed to generate greeting' }, { status: 500 })
  }
}