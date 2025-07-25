"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useActionState, useState, useEffect, useCallback } from "react"
import { submitSalesForm, type FormState } from "@/lib/actions"

interface CompanyResearch {
  companySummary: string;
  techInsights: string;
  vercelConnection: string[];
  keyQuestions: string[];
}

const initialState: FormState = {
  message: '',
  errors: {},
}

export function SalesForm() {
  const [state, formAction, pending] = useActionState(submitSalesForm, initialState)
  const [country, setCountry] = useState(state?.data?.country || "")
  const [interest, setInterest] = useState(state?.data?.interest || "")
  const [companyResearch, setCompanyResearch] = useState<CompanyResearch | null>(null)
  const [isResearching, setIsResearching] = useState(false)
  const [email, setEmail] = useState(state?.data?.email || "")

  // Update local state when server state changes
  useEffect(() => {
    if (state?.data) {
      setCountry(state.data.country || "")
      setInterest(state.data.interest || "")
      setEmail(state.data.email || "")
    }
  }, [state?.data])

  const conductCompanyResearch = useCallback(async (email: string) => {
    if (!email || !email.includes('@')) return
    
    setIsResearching(true)
    try {
      const response = await fetch('/api/company-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      if (response.ok) {
        const data = await response.json()
        setCompanyResearch(data)
      }
    } catch (error) {
      console.error('Failed to conduct company research:', error)
    } finally {
      setIsResearching(false)
    }
  }, [])

  // Debounced effect for conducting company research
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (email && email.includes('@') && email.includes('.')) {
        conductCompanyResearch(email)
      } else {
        setCompanyResearch(null)
      }
    }, 1000) // 1 second debounce

    return () => clearTimeout(timeoutId)
  }, [email, conductCompanyResearch])

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)
  }

  return (
    <Card className="border-transparent p-0">
      <CardContent className="p-0">
        <form action={formAction} className="grid gap-[2rem]">
          {/* Hidden field to pass company research data */}
          <input 
            type="hidden" 
            name="companyResearch" 
            value={companyResearch ? JSON.stringify(companyResearch) : ''} 
          />
          
          {state?.message && (
            <div className={`p-4 rounded-md ${state.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {state.message}
            </div>
          )}

          {state?.intelligentResponse && state.success && (
            <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
              <h3 className="font-medium text-blue-800 mb-2">Personalized Response:</h3>
              <div className="text-blue-700 whitespace-pre-wrap">{state.intelligentResponse}</div>
            </div>
          )}
          
          <div className="grid gap-4">
            <Label className="text-md" htmlFor="email">Company email</Label>
            <Input 
              id="email" 
              name="email"
              type="email" 
              placeholder="Email address" 
              value={email}
              onChange={handleEmailChange}
              className={state?.errors?.email ? "border-red-500" : ""}
              disabled={pending}
            />
            {state?.errors?.email && (
              <p className="text-sm text-red-500 mt-1">{state.errors.email[0]}</p>
            )}
            {isResearching && (
              <p className="text-sm text-gray-500 mt-1">Researching your company...</p>
            )}
            {companyResearch && !isResearching && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-800">
                <p className="font-medium mb-2">{companyResearch.companySummary}</p>
                
                {companyResearch.techInsights && (
                  <p className="mb-3 text-blue-700">{companyResearch.techInsights}</p>
                )}

                {companyResearch.vercelConnection && companyResearch.vercelConnection.length > 0 && (
                  <div>
                    <p className="font-medium text-blue-700">Potential reasons for your interest:</p>
                    <ul className="list-disc list-inside mt-1 text-blue-600">
                      {companyResearch.vercelConnection.slice(0, 3).map((reason, index) => (
                        <li key={index}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="grid gap-4">
            <Label className="text-md" htmlFor="country">Country</Label>
            <Select value={country} onValueChange={setCountry} disabled={pending}>
              <SelectTrigger id="country" className={state?.errors?.country ? "border-red-500" : ""}>
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="gb">United Kingdom</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" name="country" value={country} />
            {state?.errors?.country && (
              <p className="text-sm text-red-500 mt-1">{state.errors.country[0]}</p>
            )}
          </div>
          
          <div className="grid gap-4">
            <Label className="text-md" htmlFor="interest">Primary Product Interest</Label>
            <Select value={interest} onValueChange={setInterest} disabled={pending}>
              <SelectTrigger id="interest" className={state?.errors?.interest ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a value" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="v0">v0</SelectItem>
                <SelectItem value="vercel">Vercel</SelectItem>
                <SelectItem value="vercel-v0">Vercel & v0</SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" name="interest" value={interest} />
            {state?.errors?.interest && (
              <p className="text-sm text-red-500 mt-1">{state.errors.interest[0]}</p>
            )}
          </div>
          
          <div className="grid gap-4">
            <Label className="text-md" htmlFor="help">How can we help?</Label>
            <Textarea 
              id="help" 
              name="help"
              placeholder="Your company needs" 
              defaultValue={state?.data?.help || ""}
              className={`min-h-[200px] ${state?.errors?.help ? "border-red-500" : ""}`}
              disabled={pending}
            />
            {state?.errors?.help && (
              <p className="text-sm text-red-500 mt-1">{state.errors.help[0]}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            size="lg" 
            className="w-full rounded-full bg-[#0070f3] hover:bg-[#0063d1] text-white text-base py-6"
            disabled={pending}
          >
            {pending ? 'Submitting...' : 'Talk to Vercel'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
