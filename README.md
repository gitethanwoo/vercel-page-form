# AI-Powered Sales Form Template

A Next.js template that demonstrates how to build an intelligent sales workflow using Vercel's AI SDK, [Upstash Search](https://upstash.com/docs/search), and Slack webhooks. This template shows how to capture leads through a multi-step form, automatically research companies using AI, generate personalized email responses, and post results to Slack.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/gitethanwoo/vercel-page-form&demo-title=AI-Powered%20Sales%20Form&demo-description=Multi-step%20sales%20form%20with%20AI%20research%2C%20automated%20email%20generation%2C%20and%20Slack%20integration&demo-url=https://vercel-page-form.vercel.app&env=OPENAI_API_KEY&envDescription=Get%20your%20OpenAI%20API%20key%20from%20https://platform.openai.com/api-keys&envLink=https://platform.openai.com/api-keys&stores=%5B%7B%22type%22%3A%22integration%22%2C%22integrationSlug%22%3A%22upstash%22%2C%22productSlug%22%3A%22upstash-search%22%7D%5D&skippable-integrations=1&project-name=AI-Powered%20Sales%20Form&repository-name=vercel-sales-form)

[Read Docs](#how-it-works) • [Features](#features) • [Deploy Your Own](#quick-start) • [Running Locally](#running-locally)


## Quick Start

1. **Deploy the template**
   - Click the "Deploy with Vercel" button above
   - Connect your Git provider and import the project
   - Environment variables will be auto-populated

2. **Configure environment variables**
   
   **Required:**
   - `OPENAI_API_KEY`: Get from [OpenAI Platform](https://platform.openai.com/api-keys)
   
   **Added Later:**
   - `SLACK_WEBHOOK_URL`: For Slack notifications (can be added later)

3. **Set up Slack webhook**
   - In your Slack workspace, create an incoming webhook for your desired channel (https://api.slack.com/apps) - Add Incoming Webhooks. Requires a channel to select. 
   - Copy the webhook URL and add it to your environment variables

4. **Test the form**
   - Visit your deployment URL
   - Submit the form with company information
   - Check your Slack channel for the research results and email draft


## How It Works

### 1. Multi-step Sales Form

The `MultiStepSalesForm` component collects:
- Company email (with business domain validation)
- Contact name and phone
- Country selection
- Organizational needs (customizable options)
- "How can we help?" text field

Each step includes validation and a progress indicator. The form rejects personal email domains and provides real-time feedback.

### 2. AI Research Workflow

When the form is submitted, the AI workflow runs in two phases:

**Phase 1: Company Research**
- Performs research using Upstash Search and web search
- Gathers information about company industry, size, products, and technical stack
- Focuses on Vercel-relevant case studies and solutions

**Phase 2: Email Generation**
- Creates a personalized sales email with:
  - Warm opening
  - 2-3 discovery questions
  - 1-2 relevant insights from research
  - Clear call-to-action
- Maintains conversational, professional tone

### 3. Slack Integration

The Slack webhook posts a structured message containing:
- Form submission data
- Research summary
- Generated email draft

This allows your sales team to receive leads with context immediately.

## Customization

### Creating Your Own Knowledge Base

One of the most powerful features of this template is the ability to create domain-specific knowledge bases using [Upstash's Documentation Crawler](https://upstash.com/docs/search/tools/documentationcrawler). This allows you to crawl your own documentation, knowledge base, or any website and create a searchable index for AI research.

#### Quick Setup with Documentation Crawler

1. **Get your credentials** from your newly deployed project:
   - Go to your Vercel dashboard
   - Click **Storage** on the horizontal menu
   - Click on your Upstash Search database
   - Copy your `UPSTASH_SEARCH_REST_URL` and `UPSTASH_SEARCH_REST_TOKEN`

2. **Run the crawler** (no installation required):
   ```bash
   npx @upstash/search-crawler \
     --upstash-url "UPSTASH_SEARCH_REST_URL" \
     --upstash-token "UPSTASH_SEARCH_REST_TOKEN" \
     --index-name "default" \
     --doc-url "https://your-docs-site.com"
   ```

   Or run it interactively and you'll be prompted for the missing options:
   ```bash
   npx @upstash/search-crawler
   ```

3. **Verify your data**:
   - In the same Vercel Storage page, click **"Open in Upstash"** in the top right corner
   - You should see all your indexed documentation in the Data Browser tab!

The crawler automatically:
- **Discovers** all internal documentation links
- **Crawls** each page and extracts content
- **Tracks** new or obsolete data
- **Upserts** the new records into your Upstash Search index

#### Use Cases for Custom Knowledge Bases

- **Company Documentation**: Crawl your internal docs, product guides, or knowledge base
- **Industry Research**: Index competitor websites, industry reports, or market analysis
- **Technical Resources**: Crawl technical documentation, API docs, or developer guides
- **Sales Materials**: Index case studies, whitepapers, or marketing content

#### Automated Updates

You can combine the Documentation Crawler with [Qstash Schedule](https://upstash.com/docs/qstash) to keep your knowledge base up to date automatically. Deploy the crawler on a server and call it on a schedule to fetch updates in your documentation.


### Modifying Organizational Needs

Update the `organizationNeedsOptions` array in `components/multi-step-sales-form.tsx`:

```typescript
const organizationNeedsOptions = [
  'E-commerce Platform',
  'Content Management',
  'Performance Optimization',
  'Custom Development',
  // Add your own options here
];
```

### Adjusting AI Prompts

Modify the research and email generation prompts in `app/api/ai-workflow/route.ts` to match your sales tone and requirements.


## Support

If you have questions or need help customizing this template:

1. Check the [Vercel documentation](https://vercel.com/docs)
2. Review the [Next.js documentation](https://nextjs.org/docs)
3. Explore the [Vercel AI SDK docs](https://sdk.vercel.ai/docs)

---

Built with [Vercel](https://vercel.com) and [Next.js](https://nextjs.org) 