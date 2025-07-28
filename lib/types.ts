// Form Data Types
export interface FormData {
  email: string
  name: string
  phone: string
  country: string
  organizationNeeds: string[]
  help: string
}

// Enhanced form data with full context for AI processing
export interface EnhancedFormData extends FormData {
  organizationNeedsDetails: {
    id: string
    label: string
    description: string
  }[]
  countryLabel: string
}

export interface FormErrors {
  email?: string
  name?: string 
  phone?: string
  country?: string
  organizationNeeds?: string
  help?: string
}

// Organization needs options
export const organizationNeedsOptions = [
  { 
    id: "vercel_hosting", 
    label: "Global CDN & Edge Deployment",
    description: "Push to git, deploy everywhere. Lightning-fast loading from 100+ edge locations worldwide."
  },
  { 
    id: "preview_deployments", 
    label: "Staging Environments",
    description: "Every pull request gets a live URL. Ship with confidence after stakeholders review real deploys."
  },
  { 
    id: "nextjs_platform", 
    label: "Zero-Config Infrastructure",
    description: "The creators of Next.js host it best. Automatic optimizations, ISR, and framework-native features."
  },
  { 
    id: "enterprise_security", 
    label: "SOC 2 & HIPAA Compliance",
    description: "SOC 2, HIPAA, SSO, advanced RBAC, isolated builds, and 99.99% SLA for mission-critical apps."
  },
  {
    id: "performance_scale",
    label: "Auto-Scaling Infrastructure",
    description: "Handle millions of users without config. Automatic scaling, DDoS protection, and global CDN included."
  },
  { 
    id: "v0_personal", 
    label: "AI Code Generation",
    description: "Turn ideas into React code instantly. Build UIs, components, and features with natural language."
  },
  { 
    id: "v0_teams", 
    label: "Team Collaboration Tools",
    description: "Collaborate with shared Projects, custom instructions, higher rate limits, and centralized billing."
  },
  { 
    id: "v0_enterprise", 
    label: "Enterprise AI Features",
    description: "SSO, data training opt-out, priority access, and higher rate limits for security-conscious organizations."
  },
  {
    id: "custom_needs",
    label: "Custom Requirements",
    description: "I have specific requirements not listed here."
  }
] as const

// Country options
export const countries = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "gb", label: "United Kingdom" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
  { value: "other", label: "Other" }
] as const

// Test scenario type
export interface TestScenario {
  name: string
  description: string
  data: FormData
}

// API Response types
export interface AIWorkflowResponse {
  response: string
  research: string
}

export interface APIError {
  error: string
}