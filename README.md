# AI-Powered Sales Form Template

A Next.js template that demonstrates how to build an intelligent sales workflow using Vercel's AI SDK, Upstash Search, and Slack webhooks. This template shows how to capture leads through a multi-step form, automatically research companies using AI, generate personalized email responses, and post results to Slack.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/gitethanwoo/vercel-page-form)

## Features

- **Multi-step Sales Form**: Collect company information with validation and progress tracking
- **AI-Powered Research**: Automatically research companies using Vercel's AI SDK and Upstash Search
- **Personalized Email Generation**: Create tailored sales emails based on research findings
- **Slack Integration**: Post research results and email drafts directly to Slack channels
- **Modern UI**: Built with Next.js 15, Tailwind CSS, and Radix UI components
- **Type Safety**: Full TypeScript support with Zod validation

## Quick Start

1. **Deploy the template**
   - Click the "Deploy with Vercel" button above
   - Connect your Git provider and import the project
   - Vercel will prompt you for environment variables

2. **Configure environment variables**
   ```bash
   UPSTASH_SEARCH_REST_URL=your_upstash_search_url
   UPSTASH_SEARCH_REST_TOKEN=your_upstash_search_token
   SLACK_WEBHOOK_URL=your_slack_webhook_url
   VERCEL_URL=your_vercel_url
   NEXT_PUBLIC_BASE_URL=your_base_url
   ```

3. **Set up Slack webhook**
   - In your Slack workspace, create an incoming webhook for your desired channel
   - Copy the webhook URL and add it to your environment variables

4. **Test the form**
   - Visit your deployment URL
   - Submit the form with company information
   - Check your Slack channel for the research results and email draft

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── ai-workflow/     # AI research and email generation
│   │   ├── search/          # Upstash Search integration
│   │   └── slack/webhook/   # Slack webhook handler
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── multi-step-sales-form.tsx  # Main multi-step form
│   ├── sales-form.tsx             # Simple one-page form
│   └── ui/                        # Reusable UI components
├── lib/
│   └── utils.ts                   # Utility functions
└── public/                        # Static assets
```

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

**Phase 1: Bot Detection & Research**
- Uses AI to detect if the submission is from a bot
- If human, performs research using Upstash Search and web search
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

### Styling

The template uses Tailwind CSS with custom components. Modify `tailwind.config.ts` and component styles to match your brand.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `UPSTASH_SEARCH_REST_URL` | Upstash Search REST API URL | Yes |
| `UPSTASH_SEARCH_REST_TOKEN` | Upstash Search REST API token | Yes |
| `SLACK_WEBHOOK_URL` | Slack incoming webhook URL | Yes |
| `VERCEL_URL` | Your Vercel deployment URL | Yes |
| `NEXT_PUBLIC_BASE_URL` | Public base URL for API calls | Yes |

## Technologies Used

- **Framework**: Next.js 15 with App Router
- **AI**: Vercel AI SDK with OpenAI
- **Search**: Upstash Search for documentation indexing
- **Styling**: Tailwind CSS with Radix UI components
- **Validation**: Zod schema validation
- **Deployment**: Vercel

## Contributing

This template is designed to be easily customizable and extensible. Feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this template for your own projects.

## Support

If you have questions or need help customizing this template:

1. Check the [Vercel documentation](https://vercel.com/docs)
2. Review the [Next.js documentation](https://nextjs.org/docs)
3. Explore the [Vercel AI SDK docs](https://sdk.vercel.ai/docs)

---

Built with ❤️ using [Vercel](https://vercel.com) and [Next.js](https://nextjs.org) 