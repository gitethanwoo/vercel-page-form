# AI-Powered Sales Form Template

A Next.js template that demonstrates how to build an intelligent sales workflow using Vercel's AI SDK, Upstash Search, and Slack webhooks. This template shows how to capture leads through a multi-step form, automatically research companies using AI, generate personalized email responses, and post results to Slack.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/gitethanwoo/vercel-page-form&demo-title=AI-Powered%20Sales%20Form&demo-description=Multi-step%20sales%20form%20with%20AI%20research%2C%20automated%20email%20generation%2C%20and%20Slack%20integration&demo-url=https://vercel-page-form.vercel.app&env=UPSTASH_SEARCH_REST_URL,UPSTASH_SEARCH_REST_TOKEN,SLACK_WEBHOOK_URL&envDescription=See%20the%20README%20to%20learn%20how%20to%20get%20these%20env%20vars&envLink=https://github.com/gitethanwoo/vercel-page-form&stores=%5B%7B%22type%22%3A%22integration%22%2C%22integrationSlug%22%3A%22upstash%22%2C%22productSlug%22%3A%22upstash-search%22%7D%5D&skippable-integrations=1&project-name=AI-Powered%20Sales%20Form&repository-name=vercel-sales-form)

## Features

- **Multi-step Sales Form**: Collect company information with validation and progress tracking
- **AI-Powered Research**: Automatically research companies using Vercel's AI SDK and Upstash Search
- **Personalized Email Generation**: Create tailored sales emails based on research findings
- **Slack Integration**: Post research results and email drafts directly to Slack channels
- **Seamless Setup**: Native Vercel-Upstash integration for one-click credential management
- **Modern UI**: Built with Next.js 15, Tailwind CSS, and Radix UI components
- **Type Safety**: Full TypeScript support with Zod validation

## Quick Start

1. **Deploy the template**
   - Click the "Deploy with Vercel" button above
   - Connect your Git provider and import the project
   - Vercel will automatically detect Upstash requirements and offer to set up the integration
   - You'll be prompted to create/connect your Upstash account
   - Environment variables will be auto-populated

2. **Configure environment variables**
   
   **Option A: Set up Upstash through Vercel (Recommended)**
   - In your Vercel dashboard, go to Settings → Environment Variables
   - Add your `SLACK_WEBHOOK_URL` and other variables
   - For Upstash Search, you can create a new Upstash account directly through Vercel's integration
   - Vercel will automatically populate `UPSTASH_SEARCH_REST_URL` and `UPSTASH_SEARCH_REST_TOKEN`
   
   **Option B: Manual Upstash setup**
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

1. **Install the crawler** (no installation required):
   ```bash
   npx @upstash/search-crawler
   ```

2. **Run the crawler** with your Upstash credentials:
   ```bash
   npx @upstash/search-crawler \
     --upstash-url "UPSTASH_SEARCH_REST_URL" \
     --upstash-token "UPSTASH_SEARCH_REST_TOKEN" \
     --index-name "my-knowledge-base" \
     --doc-url "https://your-docs.com"
   ```

3. **Update the search index** in `app/api/search/route.ts`:
   ```typescript
   const index = client.index("my-knowledge-base"); // Change from "vercel-docs"
   ```

#### What the Documentation Crawler Does

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

### Styling

The template uses Tailwind CSS with custom components. Modify `tailwind.config.ts` and component styles to match your brand.

## Environment Variables

### Setting Up Upstash Search

The easiest way to set up Upstash Search is through Vercel's native integration:

1. **Deploy your template to Vercel**
2. **Go to your Vercel dashboard** → Settings → Environment Variables
3. **Click "Add Integration"** and search for "Upstash"
4. **Create a new Upstash account** or connect an existing one
5. **Vercel will automatically populate** the required environment variables:
   - `UPSTASH_SEARCH_REST_URL`
   - `UPSTASH_SEARCH_REST_TOKEN`

This integration eliminates the need to manually copy credentials and ensures secure credential management.

**Benefits of Vercel Integration:**
- ✅ **One-click setup** - No manual credential copying
- ✅ **Automatic updates** - Credentials stay in sync
- ✅ **Enhanced security** - Credentials managed by Vercel
- ✅ **Zero configuration** - Works out of the box
- ✅ **Free tier included** - Upstash offers generous free tier

### Manual Setup (Alternative)

If you prefer to set up Upstash manually:

1. Create an account at [upstash.com](https://upstash.com)
2. Create a new Search database
3. Copy the REST URL and token from your dashboard
4. Add them to your Vercel environment variables

### All Required Variables

| Variable | Description | Required | Auto-populated by Vercel |
|----------|-------------|----------|-------------------------|
| `UPSTASH_SEARCH_REST_URL` | Upstash Search REST API URL | Yes | ✅ (with integration) |
| `UPSTASH_SEARCH_REST_TOKEN` | Upstash Search REST API token | Yes | ✅ (with integration) |
| `SLACK_WEBHOOK_URL` | Slack incoming webhook URL | Yes | ❌ |
| `VERCEL_URL` | Your Vercel deployment URL | Yes | ✅ (automatic) |
| `NEXT_PUBLIC_BASE_URL` | Public base URL for API calls | Yes | ✅ (automatic) |

## Technologies Used

- **Framework**: Next.js 15 with App Router
- **AI**: Vercel AI SDK with OpenAI
- **Search**: Upstash Search for documentation indexing
- **Styling**: Tailwind CSS with Radix UI components
- **Validation**: Zod schema validation
- **Deployment**: Vercel

## How the Deploy Button Works

The "Deploy to Vercel" button includes special parameters that enable seamless integration:

### **URL Parameters**
- `repository-url`: Points to this GitHub repository
- `demo-title`, `demo-description`, `demo-url`: Template showcase information
- `env`: Pre-defines required environment variables
- `envDescription`: Provides helpful descriptions for each variable
- `products`: JSON array defining integrations (Upstash Search)
- `skippable-integrations`: Allows users to skip integrations
- `project-name`, `repository-name`: Default project naming

### **Deployment Flow**
1. **Click Deploy** → Vercel clones the repository
2. **Integration Detection** → Vercel identifies Upstash requirements
3. **Setup Wizard** → Offers to create/connect Upstash account
4. **Auto-Configuration** → Populates environment variables
5. **Deploy** → Launches your AI-powered sales form

This creates a "one-click deployment" experience where users don't need to manually set up any external services!

### **Products Parameter Breakdown**
The `products` parameter uses this structure:
```json
[
  {
    "type": "integration",
    "protocol": "storage", 
    "productSlug": "upstash",
    "integrationSlug": "upstash"
  }
]
```

This tells Vercel to:
- Offer Upstash integration during setup
- Auto-configure environment variables
- Handle account creation/connection
- Set up the necessary services automatically

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