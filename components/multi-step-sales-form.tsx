"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react"

interface FormData {
  email: string
  name: string
  phone: string
  country: string
  organizationNeeds: string[]
  help: string
}

interface FormErrors {
  email?: string
  name?: string
  country?: string
  organizationNeeds?: string
  help?: string
}

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

const organizationNeedsOptions = [
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
]


export function MultiStepSalesForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    email: "",
    name: "",
    phone: "",
    country: "",
    organizationNeeds: [],
    help: ""
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  const totalSteps = 5

  const validateEmail = (email: string): string | undefined => {
    if (!email) return "Email is required"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address"
    
    const commonPersonalDomains = [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
      'icloud.com', 'live.com', 'msn.com', 'protonmail.com', 'mail.com'
    ]
    
    const domain = email.split('@')[1]?.toLowerCase()
    if (commonPersonalDomains.includes(domain)) {
      return "Please use your company email address"
    }
    
    return undefined
  }

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {}
    
    switch (step) {
      case 1:
        const emailError = validateEmail(formData.email)
        if (emailError) newErrors.email = emailError
        break
      case 2:
        if (!formData.name.trim()) newErrors.name = "Name is required"
        break
      case 3:
        if (!formData.country) newErrors.country = "Country is required"
        break
      case 4:
        if (formData.organizationNeeds.length === 0) newErrors.organizationNeeds = "Please select at least one option"
        break
      case 5:
        if (!formData.help.trim()) newErrors.help = "Please tell us how we can help"
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleNeedsChange = (needId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      organizationNeeds: checked 
        ? [...prev.organizationNeeds, needId]
        : prev.organizationNeeds.filter(id => id !== needId)
    }))
  }

  const handleSubmit = async () => {
    if (validateStep(5)) {
      console.log("Form submitted:", formData)
      
      // Fire-and-forget AI workflow
      fetch('/api/ai-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData }),
      }).catch(error => {
        console.error("AI workflow error (non-blocking):", error)
      })
      
      setIsSubmitted(true)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-[600px] flex flex-col items-center justify-center text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-6"/>
        <h2 className="text-3xl font-semibold text-foreground mb-3">Thank you!</h2>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto">
          We've received your submission and will be in touch shortly.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-[600px] h-full flex flex-col">
      {/* Progress indicator */}
      <div className="flex items-center justify-between flex-none mb-6">
        <div className="flex space-x-3">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i + 1 <= currentStep 
                  ? 'bg-primary scale-125' 
                  : i + 1 === currentStep + 1 
                    ? 'bg-primary/20 scale-110' 
                    : 'bg-border'
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-medium text-muted-foreground tracking-wide">{currentStep} of {totalSteps}</span>
      </div>

      {/* Main content area - flex-1 to fill available space */}
      <div className="flex-1 flex flex-col">
        <div className="w-full max-w-xl mx-auto h-[500px]">

          {/* Step 1: Company Email */}
          {currentStep === 1 && (
            <div className="flex flex-col justify-center h-full animate-in fade-in-50 slide-in-from-right-5 duration-300">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-foreground tracking-tight mb-2">What's your company email?</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">We'll use this to understand your company better.</p>
              </div>
              <div>
                <Input
                  type="email"
                  name="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={`text-xl py-7 px-6 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-primary/10 ${
                    errors.email 
                      ? "border-destructive/50 focus:border-destructive" 
                      : "border-border focus:border-primary hover:border-border/80"
                  }`}
                />
                {errors.email && (
                  <p className="text-sm text-destructive font-medium mt-3">{errors.email}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Name and Phone */}
          {currentStep === 2 && (
            <div className="flex flex-col justify-center h-full animate-in fade-in-50 slide-in-from-right-5 duration-300">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-foreground tracking-tight mb-2">What's your name?</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">And optionally, your phone number.</p>
              </div>
              <div className="space-y-6">
                <div>
                  <Input
                    name="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`text-xl py-7 px-6 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-primary/10 ${
                      errors.name 
                        ? "border-destructive/50 focus:border-destructive" 
                        : "border-border focus:border-primary hover:border-border/80"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive font-medium mt-2">{errors.name}</p>
                  )}
                </div>
                <Input
                  type="tel"
                  name="phone"
                  placeholder="Phone number (optional)"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="text-xl py-7 px-6 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-primary/10 border-border focus:border-primary hover:border-border/80"
                />
              </div>
            </div>
          )}

          {/* Step 3: Country */}
          {currentStep === 3 && (
            <div className="flex flex-col justify-center h-full animate-in fade-in-50 slide-in-from-right-5 duration-300">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-foreground tracking-tight mb-2">Which country are you in?</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">This helps us provide relevant information.</p>
              </div>
              <div>
                <Select 
                  value={formData.country} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
                >
                  <SelectTrigger className={`text-xl py-7 px-6 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-primary/10 ${
                    errors.country 
                      ? "border-destructive/50 focus:border-destructive" 
                      : "border-border focus:border-primary hover:border-border/80"
                  }`}>
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2 border-border">
                    {countries.map((country) => (
                      <SelectItem key={country.value} value={country.value} className="text-lg py-3 px-4">
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.country && (
                  <p className="text-sm text-destructive font-medium mt-3">{errors.country}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Organization Needs */}
          {currentStep === 4 && (
            <div className="flex flex-col justify-center h-full animate-in fade-in-50 slide-in-from-right-5 duration-300">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-foreground tracking-tight mb-2">What are your organization's needs?</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">Choose all that apply.</p>
              </div>
              <div className="relative">
                <div className="min-h-[300px] max-h-[400px] overflow-y-auto pr-4">
                  <div className="space-y-4 pb-12">
                    {organizationNeedsOptions.map((option) => (
                      <label 
                        key={option.id} 
                        htmlFor={option.id}
                        className={`flex items-start space-x-4 p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                          formData.organizationNeeds.includes(option.id)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-border/80 hover:bg-muted/50"
                        }`}
                      >
                        <Checkbox
                          id={option.id}
                          checked={formData.organizationNeeds.includes(option.id)}
                          onCheckedChange={(checked) => handleNeedsChange(option.id, checked as boolean)}
                          className="w-5 h-5 mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <div className="flex-1 space-y-1">
                          <span className="text-base font-semibold text-foreground leading-tight block">{option.label}</span>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                {/* Fade-out gradient overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
              </div>
              {errors.organizationNeeds && (
                <p className="text-sm text-destructive font-medium mt-3">{errors.organizationNeeds}</p>
              )}
            </div>
          )}

          {/* Step 5: How can we help */}
          {currentStep === 5 && (
            <div className="flex flex-col justify-center h-full animate-in fade-in-50 slide-in-from-right-5 duration-300">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-foreground tracking-tight mb-2">How can we help?</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">Tell us about your needs and goals.</p>
              </div>
              <div>
                <Textarea
                  name="help"
                  placeholder="Describe how Vercel can help your company..."
                  value={formData.help}
                  onChange={(e) => setFormData(prev => ({ ...prev, help: e.target.value }))}
                  className={`min-h-[200px] text-lg py-6 px-6 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-primary/10 resize-none ${
                    errors.help 
                      ? "border-destructive/50 focus:border-destructive" 
                      : "border-border focus:border-primary hover:border-border/80"
                  }`}
                />
                {errors.help && (
                  <p className="text-sm text-destructive font-medium mt-3">{errors.help}</p>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-center flex-none mt-6 gap-4 sm:gap-0">
        {currentStep > 1 ? (
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-lg border-2 rounded-xl transition-all duration-200 hover:bg-muted/50"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </Button>
        ) : (
          <div className="hidden sm:block" />
        )}

        {currentStep < totalSteps ? (
          <Button
            onClick={handleNext}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 text-lg bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            className="w-full sm:w-auto px-8 py-3 text-lg bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
          >
            Talk to Vercel
          </Button>
        )}
      </div>
    </div>
  )
}