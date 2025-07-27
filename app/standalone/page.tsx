"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { MultiStepSalesForm } from "@/components/multi-step-sales-form"

const testScenarios = [
  {
    name: "The Weather Channel",
    description: "Enterprise re-platforming for performance",
    data: {
      name: "Jane Doe",
      email: "jane.doe@weather.com",
      phone: "555-0101",
      country: "us",
      interests: ["vercel", "other"],
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
      interests: ["vercel", "other"],
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
      interests: ["v0"],
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
      interests: ["vercel"],
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
      interests: ["vercel", "other"],
      help: "We need to get much better at testing different headlines and subscription offers to see what works best. Our current system is too slow and rigid to run these kinds of experiments effectively. We're looking for a way to quickly target content to different audiences and measure the results without slowing down the site for everyone."
    }
  }
]

export default function StandalonePage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, { success: boolean; response?: string; error?: string }>>({})

  const testAIWorkflow = async (scenarioName: string, formData: any) => {
    setLoading(scenarioName)
    setResults(prev => ({ ...prev, [scenarioName]: { success: false } }))

    try {
      const response = await fetch('/api/ai-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData }),
      })

      const result = await response.json()

      if (response.ok) {
        setResults(prev => ({
          ...prev,
          [scenarioName]: { success: true, response: result.response }
        }))
      } else {
        setResults(prev => ({
          ...prev,
          [scenarioName]: { success: false, error: result.error || 'Request failed' }
        }))
      }
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [scenarioName]: { success: false, error: 'Network error' }
      }))
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">AI Workflow Testing</h1>
          <p className="text-muted-foreground">Test the AI workflow with the interactive form or prefilled scenarios</p>
        </div>

        {/* Multi-step Form Section */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Interactive Form</h2>
            <p className="text-muted-foreground">Fill out the multi-step form to test the AI workflow with real data</p>
          </div>
          <div className="flex justify-center">
            <MultiStepSalesForm />
          </div>
        </div>

        {/* Test Scenarios Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Prefilled Test Scenarios</h2>
          <p className="text-muted-foreground mb-6">Click any button to test the AI workflow with different scenarios</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testScenarios.map((scenario) => (
            <Card key={scenario.name} className="border border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
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
                <p className="text-sm text-muted-foreground">{scenario.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-xs space-y-1">
                  <div><strong>Name:</strong> {scenario.data.name}</div>
                  <div><strong>Email:</strong> {scenario.data.email}</div>
                  <div><strong>Country:</strong> {scenario.data.country}</div>
                  <div><strong>Interests:</strong> {scenario.data.interests.join(', ')}</div>
                  <div><strong>Help:</strong> {scenario.data.help.substring(0, 100)}...</div>
                </div>
                
                <Button 
                  onClick={() => testAIWorkflow(scenario.name, scenario.data)}
                  disabled={loading === scenario.name}
                  className="w-full"
                >
                  {loading === scenario.name ? 'Testing...' : 'Test AI Workflow'}
                </Button>

                {results[scenario.name] && (
                  <div className="mt-4 p-3 rounded-lg bg-muted/50">
                    {results[scenario.name]?.success ? (
                      <div className="space-y-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Success
                        </Badge>
                        <div className="text-sm max-h-32 overflow-y-auto">
                          {results[scenario.name]?.response?.substring(0, 200)}...
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Badge variant="secondary" className="bg-red-100 text-red-800">
                          Error
                        </Badge>
                        <div className="text-sm text-red-600">
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

        <div className="mt-8 p-4 bg-muted/30 rounded-lg">
          <h3 className="font-semibold mb-2">Testing Instructions:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Use the interactive form above to test with real data</li>
            <li>• Or click any test button to send prefilled form data to the AI workflow</li>
            <li>• Each scenario tests different use cases and complexity levels</li>
            <li>• Check the webhook dashboard to see all results</li>
            <li>• Results show success/error status and a preview of the AI response</li>
          </ul>
        </div>
      </div>
    </div>
  )
}