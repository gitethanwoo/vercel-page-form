import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'

const intelligentResponseSchema = z.object({
  response: z.string().describe("A concise, personalized response (2-3 paragraphs)."),
  companySummary: z.string().optional().describe("The company summary used for the response."),
  userRequest: z.string().optional().describe("The user's original request.")
});

export async function POST(request: Request) {
  try {
    const { companyResearch, userInput, userEmail, country, interest } = await request.json()
    
    if (!userInput) {
      return Response.json({ error: 'User input is required' }, { status: 400 })
    }

    const { object: intelligentResponse } = await generateObject({
      model: openai('gpt-4o'),
      schema: intelligentResponseSchema,
      prompt: `You are a Vercel sales expert. A potential customer has reached out. Here's what you know:

      COMPANY BRIEFING:
      ${JSON.stringify(companyResearch, null, 2)}
      
      USER DETAILS:
      - Email: ${userEmail}
      - Country: ${country}
      - Primary Interest: ${interest}
      - Their message: "${userInput}"
      
      Your task is to write a concise, personalized response (2-3 paragraphs).
      
      1.  Acknowledge their message directly.
      2.  Use the "Vercel Connection" and "Key Questions" from the briefing to make it relevant.
      3.  Subtly weave in how Vercel can address one of their likely reasons for contacting us.
      4.  End with an open-ended question to encourage a reply.
      
      Maintain a helpful, consultative tone.`,
    })

    console.log(`=== INTELLIGENT RESPONSE GENERATED ===`)
    console.log(`User: ${userEmail}`)
    console.log(`Company Summary: ${companyResearch?.companySummary || 'Unknown'}`)
    console.log(`Request: ${userInput.substring(0, 100)}...`)
    console.log(`Response length: ${intelligentResponse.response.length} characters`)

    return Response.json({ 
      response: intelligentResponse.response,
      metadata: {
        companySummary: companyResearch?.companySummary,
        userRequest: userInput
      }
    })
  } catch (error) {
    console.error('Error generating intelligent response:', error)
    return Response.json({ error: 'Failed to generate response' }, { status: 500 })
  }
}