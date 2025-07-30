"use client"

import { Header } from "@/components/header"
import { SalesForm } from "@/components/sales-form"
import { MultiStepSalesForm } from "@/components/multi-step-sales-form"
import { EbayLogo } from "@/components/ebay-logo"
import { TripadvisorLogo } from "@/components/tripadvisor-logo"
import { SonosLogo } from "@/components/sonos-logo"
import { Phone, Clock, Settings2, Loader2, CheckCircle, AlertCircle, X } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Define the structure for AI response
interface AIResponse {
  research: string;
  response: string;
}

// Test scenarios from the standalone page
const testScenarios = [
  {
    name: "The Weather Channel",
    description: "Enterprise re-platforming for performance",
    data: {
      name: "Jane Doe",
      email: "jane.doe@weather.com",
      phone: "555-0101",
      country: "us",
      organizationNeeds: ["vercel_hosting", "performance_scale"],
      help: "Our site, weather.com, gets crushed with traffic during major weather events, and it's starting to affect our ad revenue and reputation. We need to be faster and more reliable, especially when people need us most. Our current platform is too rigid and slow. How can we make our site faster and more resilient, especially during traffic spikes?"
    }
  },
  {
    name: "Patagonia",
    description: "Headless commerce migration for e-commerce",
    data: {
      name: "John Smith",
      email: "john.smith@patagonia.com",
      phone: "555-0102",
      country: "us",
      organizationNeeds: ["vercel_hosting", "preview_deployments"],
      help: "Our online store feels clunky and outdated, and our development team says our current e-commerce platform makes it incredibly hard to make even simple updates to the user experience. We want to build a much faster, more modern storefront, but we can't afford to replatform everything at once. How can we start improving our customer experience without a massive, risky migration?"
    }
  },
  {
    name: "Substack",
    description: "Exploring generative UI for user features",
    data: {
      name: "Emily White",
      email: "emily.white@substackinc.com",
      phone: "555-0103",
      country: "us",
      organizationNeeds: ["v0_personal", "v0_teams"],
      help: "We want to give our writers the ability to create unique designs for their publications, but most of them don't know how to code. We've been thinking about tools that can generate UIs from a text description. Is it possible to build a feature like that for our platform so our writers can just describe the layout they want?"
    }
  },
  {
    name: "Expedia",
    description: "Improving developer workflow for micro-frontends",
    data: {
      name: "Michael Brown",
      email: "michael.brown@expediagroup.com",
      phone: "555-0104",
      country: "us",
      organizationNeeds: ["vercel_hosting", "preview_deployments", "enterprise_security"],
      help: "We have hundreds of developers working on different parts of our websites, and it's become a huge bottleneck. A simple change can take weeks to get deployed because of conflicts and a slow, complicated process. We need a way for our teams to work more independently and get their changes in front of stakeholders for review without all the overhead."
    }
  },
  {
    name: "The New York Times",
    description: "Personalization and A/B testing at the edge",
    data: {
      name: "Sarah Miller",
      email: "sarah.miller@nytimes.com",
      phone: "555-0105",
      country: "us",
      organizationNeeds: ["vercel_hosting", "performance_scale", "enterprise_security"],
      help: "We need to get much better at testing different headlines and subscription offers to see what works best. Our current system is too slow and rigid to run these kinds of experiments effectively. We're looking for a way to quickly target content to different audiences and measure the results without slowing down the site for everyone."
    }
  }
]

export default function SalesPage() {
  const [useMultiStep, setUseMultiStep] = useState(false)
  const [showTesting, setShowTesting] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, { success: boolean; response?: string; error?: string }>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null)
  const [submissionError, setSubmissionError] = useState<string | null>(null)

  // Check for test parameter on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('test') === 'true') {
      setShowTesting(true)
    }
  }, [])

  const handleFormSubmit = async (formData: any) => {
    setIsSubmitting(true)
    setAiResponse(null)
    setSubmissionError(null)

    // The multi-step form already enhances the data, but the single-step one doesn't.
    // We'll check if enhancement is needed.
    const needsEnhancement = !formData.organizationNeedsDetails || !formData.countryLabel;

    const payload = needsEnhancement ? enhanceFormData(formData) : formData;

    try {
      const response = await fetch('/api/ai-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData: payload }),
      })

      const result = await response.json()

      if (response.ok) {
        setAiResponse(result)
      } else {
        setSubmissionError(result.error || 'An unexpected error occurred.')
      }
    } catch (error) {
      setSubmissionError('Failed to connect to the AI workflow. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const testAIWorkflow = async (scenarioName: string, formData: any) => {
    setLoading(scenarioName)

    const enhancedFormData = enhanceFormData(formData)

    try {
      const response = await fetch('/api/ai-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData: enhancedFormData }),
      })

      const result = await response.json()

      if (response.ok) {
        setResults(prev => ({
          ...prev,
          [scenarioName]: { success: true, response: result.response }
        }))
        
        // Show the same modal as manual form submission
        setAiResponse(result)
        setShowTesting(false) // Close testing panel
      } else {
        setResults(prev => ({
          ...prev,
          [scenarioName]: { success: false, error: result.error || 'Request failed' }
        }))
        setSubmissionError(result.error || 'Request failed')
        setShowTesting(false) // Close testing panel
      }
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [scenarioName]: { success: false, error: 'Network error' }
      }))
      setSubmissionError('Network error')
      setShowTesting(false) // Close testing panel
    } finally {
      setLoading(null)
    }
  }

  const enhanceFormData = (formData: any) => {
    // Data needed for enhancement
    const organizationNeedsOptions = [
      { id: "vercel_hosting", label: "Global CDN & Edge Deployment", description: "Push to git, deploy everywhere. Lightning-fast loading from 100+ edge locations worldwide." },
      { id: "preview_deployments", label: "Staging Environments", description: "Every pull request gets a live URL. Ship with confidence after stakeholders review real deploys." },
      { id: "nextjs_platform", label: "Zero-Config Infrastructure", description: "The creators of Next.js host it best. Automatic optimizations, ISR, and framework-native features." },
      { id: "enterprise_security", label: "SOC 2 & HIPAA Compliance", description: "SOC 2, HIPAA, SSO, advanced RBAC, isolated builds, and 99.99% SLA for mission-critical apps." },
      { id: "performance_scale", label: "Auto-Scaling Infrastructure", description: "Handle millions of users without config. Automatic scaling, DDoS protection, and global CDN included." },
      { id: "v0_personal", label: "AI Code Generation", description: "Turn ideas into React code instantly. Build UIs, components, and features with natural language." },
      { id: "v0_teams", label: "Team Collaboration Tools", description: "Collaborate with shared Projects, custom instructions, higher rate limits, and centralized billing." },
      { id: "v0_enterprise", label: "Enterprise AI Features", description: "SSO, data training opt-out, priority access, and higher rate limits for security-conscious organizations." },
      { id: "custom_needs", label: "Custom Requirements", description: "I have specific requirements not listed here." }
    ]
    const countries = [
      { value: "us", label: "United States" },
      { value: "ca", label: "Canada" },
      { value: "gb", label: "United Kingdom" },
      { value: "au", label: "Australia" },
      { value: "de", label: "Germany" },
      { value: "fr", label: "France" },
      { value: "jp", label: "Japan" },
      { value: "other", label: "Other" }
    ]

    return {
      ...formData,
      organizationNeedsDetails: formData.organizationNeeds?.map((needId: string) => {
        const option = organizationNeedsOptions.find(opt => opt.id === needId)
        return option || { id: needId, label: needId, description: '' }
      }),
      countryLabel: countries.find(c => c.value === formData.country)?.label || formData.country
    }
  }

  return (
    <div className="w-full px-4 min-h-screen bg-gray-50 text-black">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#9ca3af_1px,transparent_1px),linear-gradient(to_bottom,#9ca3af_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>
      <Header useMultiStep={useMultiStep} onToggleForm={() => setUseMultiStep(!useMultiStep)} />
      
      {/* Results Modal */}
      {(isSubmitting || aiResponse || submissionError) && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in-20">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center flex-none">
              <h2 className="text-xl font-bold text-foreground">AI Sales Assistant</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setAiResponse(null)
                  setSubmissionError(null)
                }}
                className="text-gray-500 hover:text-gray-900 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {isSubmitting && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
                  <h3 className="text-2xl font-semibold text-foreground mb-2">Analyzing Request...</h3>
                  <p className="text-muted-foreground max-w-md">
                    Our AI is researching the company and crafting a personalized email. This might take up to 30 seconds.
                  </p>
                </div>
              )}

              {submissionError && (
                 <div className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertCircle className="w-12 h-12 text-destructive mb-6" />
                  <h3 className="text-2xl font-semibold text-destructive mb-2">An Error Occurred</h3>
                  <p className="text-muted-foreground max-w-md bg-destructive/10 p-4 rounded-lg">
                    {submissionError}
                  </p>
                </div>
              )}

              {aiResponse && (
                <div className="space-y-8 animate-in fade-in-50">
                  <div>
                    <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3 text-foreground">
                      <span className="bg-blue-100 p-2 rounded-lg">🔍</span>
                      <span>Company Research Summary</span>
                    </h3>
                    <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap bg-muted/30 rounded-lg p-4 border">
                      {aiResponse.research}
                    </div>
                  </div>

                  <div>
                     <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3 text-foreground">
                      <span className="bg-green-100 p-2 rounded-lg">✉️</span>
                      <span>Personalized Email Draft</span>
                    </h3>
                    <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap bg-muted/30 rounded-lg p-4 border">
                      {aiResponse.response}
                    </div>
                  </div>
                </div>
              )}
            </div>

             <div className="p-4 bg-muted/50 border-t flex-none">
              <p className="text-xs text-center text-muted-foreground">
                This is an AI-generated response. Review for accuracy before sending.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Testing Panel */}
      {showTesting && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold">AI Workflow Testing</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTesting(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Test Scenarios</h3>
                <p className="text-sm text-gray-600 mb-4">Click any button to test the AI workflow with different scenarios</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {testScenarios.map((scenario) => (
                  <Card key={scenario.name} className="border border-primary/10">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-sm">
                        {scenario.name}
                        {loading === scenario.name && (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        )}
                        {results[scenario.name]?.success && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        {results[scenario.name]?.success === false && (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">{scenario.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-xs space-y-1">
                        <div><strong>Name:</strong> {scenario.data.name}</div>
                        <div><strong>Email:</strong> {scenario.data.email}</div>
                        <div><strong>Country:</strong> {scenario.data.country}</div>
                        <div><strong>Needs:</strong> {scenario.data.organizationNeeds.join(', ')}</div>
                        <div><strong>Help:</strong> {scenario.data.help}</div>
                      </div>
                      
                      <Button 
                        onClick={() => testAIWorkflow(scenario.name, scenario.data)}
                        disabled={loading === scenario.name}
                        size="sm"
                        className="w-full"
                      >
                        {loading === scenario.name ? 'Testing...' : 'Test AI Workflow'}
                      </Button>

                      {results[scenario.name] && (
                        <div className="mt-3 p-2 rounded-lg bg-muted/50">
                          {results[scenario.name]?.success ? (
                            <div className="space-y-2">
                              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                Success
                              </Badge>
                              <div className="text-xs max-h-20 overflow-y-auto">
                                {results[scenario.name]?.response?.substring(0, 150)}...
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">
                                Error
                              </Badge>
                              <div className="text-xs text-red-600">
                                {results[scenario.name]?.error}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold mb-2 text-sm">Testing Instructions:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Use the form on the main page to test with real data</li>
                  <li>• Or click any test button to send prefilled form data to the AI workflow</li>
                  <li>• Each scenario tests different use cases and complexity levels</li>
                  <li>• Check the webhook dashboard to see all results</li>
                  <li>• Results show success/error status and a preview of the AI response</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <main className="container mx-auto px-1 py-16 lg:py-24 max-w-[1080px]">
          {/* 12 Grid Squares to show the grid system */}
          <div className="grid-cols-12 gap-0 border border-gray-200 relative hidden sm:grid">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="aspect-square border-r border-gray-200 last:border-r-0 flex items-center justify-center text-xs text-gray-400">
              </div>
            ))}
            
            {/* Decorative cross/plus in bottom-left of first grid square */}
            <div className="absolute bottom-[-12px] left-[-12px] w-6 h-6 pointer-events-none">
              <div className="absolute top-1/2 left-0 w-full h-px bg-gray-400 transform -translate-y-1/2"></div>
              <div className="absolute left-1/2 top-0 w-px h-full bg-gray-400 transform -translate-x-1/2"></div>
            </div>
          </div>
        
        {/* 12-Column CSS Grid with visible borders */}
        <div className="grid grid-cols-12 gap-0 border border-y-transparent border-gray-200">
          {/* Content spans 6 columns */}
          <div className="col-span-12 lg:col-span-6 border-r border-gray-200">
            <div className="flex flex-col">
              {/* Header section - always shows first */}
              <div className="p-12 border-b border-gray-200 order-1">
                <div className="mb-6">
                  <h1 className="text-3xl md:text-3xl font-semibold tracking-tight">Talk to our Sales team.</h1>
                </div>
                <div className="flex flex-col gap-6 text-lg text-gray-700">
                  <div className="flex items-start gap-4 text-base">
                    <Phone className="w-6 h-6 mt-1 text-gray-600 shrink-0" />
                    <p className="text-gray-500">
                      <span className="font-medium text-black">Get a custom demo.</span> Discover the value of Vercel for your
                      enterprise and explore our custom plans and pricing.
                    </p>
                  </div>
                  <div className="flex items-start gap-4 text-base">
                    <Clock className="w-6 h-6 mt-1 text-gray-600 shrink-0" />
                    <p className="text-gray-500">
                      <span className="font-medium text-black">Set up your Enterprise trial.</span> See for yourself how
                      Vercel Enterprise speeds up your workflow & impact.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile only: Form goes here */}
              <div className="lg:hidden order-2 p-12 bg-white border-b border-gray-200">
                {useMultiStep ? <MultiStepSalesForm onSubmit={handleFormSubmit} /> : <SalesForm onSubmit={handleFormSubmit} />}
              </div>

              {/* Stats and testimonials - shows after form on mobile, stays in left column on desktop */}
              <div className="order-3">
                <div className="flex flex-row border-b border-gray-200">
                  <div className="flex flex-col w-full p-12 border-r border-gray-200">
                    <p className="text-xl font-semibold mb-4">
                      6x faster <span className="font-normal text-gray-700">to build and deploy.</span>
                    </p>
                    <EbayLogo className="h-4 w-auto text-gray-500" />
                  </div>
                  <div className="flex flex-col w-full p-12">
                    <p className="text-xl font-semibold mb-4">
                      98% faster <span className="font-normal text-gray-700">time to market.</span>
                    </p>
                    <TripadvisorLogo className="h-4 w-auto text-gray-500" />
                  </div>
                </div>
                <div className="p-12">
                  <blockquote className="text-xl italic text-gray-700">
                    &quot;Vercel makes <span className="font-bold text-black">our developers happier</span> and lets us{" "}
                    <span className="font-bold text-black">go to market quicker</span>.&quot;
                  </blockquote>
                  <SonosLogo className="mt-4 h-4 w-auto text-gray-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Desktop only: Form in right column */}
          <div className="hidden lg:block col-span-12 bg-white lg:col-span-6 p-12">
            {useMultiStep ? <MultiStepSalesForm onSubmit={handleFormSubmit} /> : <SalesForm onSubmit={handleFormSubmit} />}
          </div>
        </div>
        <div className="grid grid-cols-12 gap-0 border border-gray-200 relative">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="aspect-square border-r border-gray-200 last:border-r-0 flex items-center justify-center text-xs text-gray-400">
              </div>
            ))}
            
            {/* Decorative cross/plus in bottom-left of first grid square */}
            <div className="absolute top-[-12px] right-[-12px] w-6 h-6 pointer-events-none">
              <div className="absolute top-1/2 left-0 w-full h-px bg-gray-400 transform -translate-y-1/2"></div>
              <div className="absolute left-1/2 top-0 w-px h-full bg-gray-400 transform -translate-x-1/2"></div>
                      </div>
        </div>
      </main>
      
      {/* Dev mode testing button - only visible in development */}
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={() => setShowTesting(true)}
          className="fixed bottom-4 left-4 flex items-center gap-1 px-2 py-1 text-xs text-black rounded transition-colors  z-10"
          title="Open AI Workflow Testing"
        >
          <CheckCircle className="w-3 h-3" />
          Test
        </button>
      )}
    </div>
  )
}
