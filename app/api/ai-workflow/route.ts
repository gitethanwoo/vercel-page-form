import { generateText, stepCountIs } from 'ai'
import { openai } from '@ai-sdk/openai'
import { sendSlackNotification } from '@/lib/actions/slack'
import { searchVercel } from '@/lib/tools/search'


export async function POST(request: Request) {
  try {
    const { formData } = await request.json();
    
    if (!formData) {
      return Response.json({ error: 'Form data is required' }, { status: 400 });
    }
    // Phase 1: Research with o3
    const researchResult = await generateText({
      model: openai('gpt-4.1'),
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


## Form Structure & Questions Asked
The prospect filled out a multi-step sales form with these questions:

1. **Company Email**: "What's your company email?" (We'll use this to understand your company better)
   - Answer: ${formData.email}

2. **Personal Info**: "What's your name?"
   - Name: ${formData.name}

3. **Location**: "Which country are you in?" (This helps us provide relevant information)
   - Country: ${formData.countryLabel || formData.country}

4. **Organization Needs**: "What are your organization's needs?" (Choose all that apply)
   - Selected options: ${formData.organizationNeedsDetails ? formData.organizationNeedsDetails.map((need: { label: string; description: string }) => `${need.label}: ${need.description}`).join('\n   - ') : formData.organizationNeeds?.join(', ')}

5. **Help Request**: "How can we help?" (Tell us about your needs and goals - text area. Pay close attention to this one!)
   - Answer: ${formData.help}

Raw form data: ${JSON.stringify(formData, null, 2)}`,
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
- Clarify their technical requirements or constraints (if you use an acronym, make sure to explain it. Don't come across as a technical know-it-all. Be conversational and friendly.)
- Explore their timeline and decision criteria
- Understand their current pain points better
- Are relevant to providing a more tailored solution
- Show genuine interest in their specific situation

<bad_example>
...
"To better tailor the right path forward for you, a few quick questions:  
- Which parts of the storefront are you most interested in modernizing first—PLPs, PDPs, homepage storytelling modules?
<explanation>
This is a bad example because it comes across as too technical - unexplained acronyms are almost always a bad idea. No payoff with a huge risk - never make the prospect feel like you're talking down to them. 
</explanation>
</bad_example>

<bad_example2>
...
You’re not alone in facing the challenge of modernizing an SFCC-driven storefront without taking on a full-scale migration all at once.  
To help shape a tailored next step, I’d love to understand a bit more:  
- Are there specific parts of the shopping experience (e.g. homepage, campaign microsites, PDPs) where you see the most friction today?  
<explanation>
More bad acronyms!
</explanation>
</bad_example2>

<good_example>
...
To better tailor our advice, I’d love to understand a few things:
- Which parts of the site experience feel the slowest or most cumbersome—for customers and your internal teams?
- How is your dev team currently managing changes to the storefront? What’s slowing them down today?
- Do you have a specific goal or milestone in mind (e.g., for peak shopping season or a new product launch)?
<explanation>
This is a good example because it's conversational and friendly. It's not too technical and it's not too salesy.
</explanation>
</good_example>

Original form data: ${JSON.stringify(formData, null, 2)}

## Research Context
Here is the research gathered about the prospect:
${researchResult.text}

Write the email response:`,
      onStepFinish: (step) => {
        console.log(`Email writing step: ${step.text}`)
      }
    });

    // Send Slack notification
    await sendSlackNotification({
      formData,
      researchResult: researchResult.text,
      aiResponse: emailResult.text,
      timestamp: new Date().toISOString()
    });

    return Response.json({ 
      response: emailResult.text,
      research: researchResult.text 
    });
  } catch (error) {
    console.error('Error in AI workflow:', error);
    return Response.json({ error: 'Failed to process AI workflow' }, { status: 500 });
  }
}