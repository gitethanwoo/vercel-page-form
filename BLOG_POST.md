# Building an AI-Powered Sales Form Template for Vercel

*How to create a reusable template that combines Next.js, AI research, and Slack integration for streamlined sales workflows*

## Introduction

Vercel's template marketplace provides ready-made projects that help developers move from idea to deployment quickly. A good template uses the App Router in Next.js, follows best practices, includes a working demo and a "Deploy to Vercel" button in its README, provides a `.env.example` file, and presents a polished design.

This guide walks through creating a comprehensive sales form template that demonstrates advanced AI integration, automated company research, and real-time Slack notifications. Once published, developers can fork it from the marketplace, connect their Git provider and environment variables, and deploy it to see a live version immediately.

## Template Overview

Our project demonstrates how to capture leads through a multi-step form, automatically research the company using Vercel's AI SDK and Upstash Search, generate a personalized email response, and post the results to a Slack channel. It uses the Next.js App Router and is structured as a template with all the necessary files and configuration for quick deployment.

## Key Features

### Multi-step Sales Form

The `MultiStepSalesForm` component collects:
- Company email (with business domain validation)
- Contact name and phone
- Country selection
- Organizational needs (customizable options)
- "How can we help?" text field

Each step includes validation and a progress indicator. The form rejects personal email domains and provides real-time feedback. The options for organizational needs are defined in an array, making it easy to customize the categories according to your use case.

A simpler one-page `SalesForm` is also included for when you don't need step-by-step navigation.

### AI Research Workflow

When the form is submitted, the AI workflow runs in two phases:

**Phase 1: Bot Detection & Research**
- Uses AI to detect if the submission is from a bot (only considers it a bot if the model is confident)
- If human, performs research using Upstash Search and web search
- Gathers information about company industry, size, products, and technical stack
- Focuses on Vercel-relevant case studies and solutions
- The research prompt instructs the AI to focus strictly on company information and not to perform personal research

**Phase 2: Email Generation**
- Creates a personalized sales email with:
  - Warm opening
  - 2-3 discovery questions
  - 1-2 relevant insights from research
  - Clear call-to-action
- Maintains conversational, professional tone
- Instructs the AI not to include citations

### Slack Integration

The Slack webhook posts a structured message containing:
- Form submission data
- Research summary
- Generated email draft

This allows your sales team to receive leads with context immediately. The webhook reads a `SLACK_WEBHOOK_URL` environment variable and assembles a Slack message with blocks containing all the relevant information.

## Template Structure

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
├── README.md                      # Comprehensive documentation
├── .env.example                   # Environment variable template
└── package.json                   # Template metadata
```

## Environment Variables

The template includes a `.env.example` file with the following variables:

- `UPSTASH_SEARCH_REST_URL` and `UPSTASH_SEARCH_REST_TOKEN` – credentials for the Upstash Search REST API
- `SLACK_WEBHOOK_URL` – the incoming Slack webhook
- `VERCEL_URL` and `NEXT_PUBLIC_BASE_URL` – used to construct internal API requests

When you import a project from a template, Vercel prompts you to fill out environment variables before the first deployment. After deploying, you can navigate to Settings → Environment Variables to update them and redeploy.

## Deployment and Usage

### 1. Deploy the Template

From the Vercel Templates marketplace, click "Use template", connect your Git provider and import the project. Vercel will prompt you for environment variables and then deploy the app automatically. You can watch the deployment build logs and access the live URL as soon as it completes.

### 2. Configure Slack

In your Slack workspace, create an incoming webhook for the channel where you want to receive leads. Paste the webhook URL into your `SLACK_WEBHOOK_URL` environment variable. Optionally, you can install the Vercel Slack app to receive deployment notifications and link user accounts.

### 3. Test the Form

Visit your deployment and submit the form with your company information. The multi-step form will validate each field, trigger the AI research and email generation, and send a structured message to Slack. You can open Slack to see the research summary and draft email posted by the webhook.

### 4. Iterate and Customize

- Adjust the `organizationNeedsOptions` array to reflect your products or services
- Modify the research prompt or email instructions in `app/api/ai-workflow/route.ts` to suit your sales tone
- Because the AI call is decoupled from the form, you can reuse this pattern in other contexts (e.g., contact forms or support enquiries)

## Customization Examples

### Modifying Organizational Needs

```typescript
const organizationNeedsOptions = [
  'E-commerce Platform',
  'Content Management',
  'Performance Optimization',
  'Custom Development',
  'AI Integration',
  'Analytics & Monitoring',
  // Add your own options here
];
```

### Adjusting AI Prompts

The research and email generation prompts in `app/api/ai-workflow/route.ts` can be modified to match your sales tone and requirements. The prompts are designed to be easily customizable while maintaining the core workflow.

### Styling and Branding

The template uses Tailwind CSS with custom components. Modify `tailwind.config.ts` and component styles to match your brand. The UI components are built with Radix UI for accessibility and consistency.

## Best Practices for Template Development

### 1. Follow Vercel's Guidelines

- Use the App Router if your template relies on Next.js
- Include a comprehensive README with deployment instructions
- Provide a `.env.example` file with all required environment variables
- Include a "Deploy to Vercel" button in your README
- Ensure the template works out of the box

### 2. Documentation

- Explain the project structure clearly
- Provide step-by-step setup instructions
- Include customization examples
- Document all environment variables
- Add troubleshooting sections

### 3. Code Quality

- Use TypeScript for type safety
- Implement proper error handling
- Follow Next.js best practices
- Include validation and security measures
- Make components reusable and customizable

## Submitting Your Template

If you would like to share this pattern with the community, Vercel provides a template submission form. You must:

- Host your code in a public GitHub repository
- Include a `.env.example` file
- Provide a thumbnail and a live demo URL
- Use App Router if it relies on Next.js
- Describe the use case and select the frameworks, CSS solution, database and integrations
- Link to a working demo

After submitting, Vercel reviews templates for quality and best practices.

## Conclusion

This template illustrates a practical way to combine Next.js, Vercel's AI SDK, Upstash Search and Slack webhooks into a streamlined sales workflow. By following Vercel's guidelines for templates and environment variables, you can publish a polished solution that others can deploy with a single click.

The pattern—collect structured input, perform AI-assisted research, generate a personalized response, and deliver it via Slack—can easily be adapted to other domains such as support tickets, recruiting, or customer onboarding.

This approach demonstrates how modern web development tools can be combined to create intelligent, automated workflows that improve efficiency and provide better user experiences. The template serves as a useful starting point for your own integrations and encourages contribution to the Vercel template ecosystem.

## Resources

- [Vercel Templates Documentation](https://vercel.com/docs/templates)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Upstash Search](https://upstash.com/docs/search)
- [Slack Webhooks](https://api.slack.com/messaging/webhooks)

---

*This template is available on GitHub and can be deployed directly to Vercel with a single click. Follow the setup instructions in the README to get started with your own AI-powered sales workflow.* 