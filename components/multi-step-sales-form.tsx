"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface FormData {
  email: string
  name: string
  phone: string
  country: string
  interests: string[]
  help: string
}

interface FormErrors {
  email?: string
  name?: string
  country?: string
  interests?: string
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

const interestOptions = [
  { id: "vercel", label: "Vercel" },
  { id: "v0", label: "v0" },
  { id: "other", label: "Something else" }
]

export function MultiStepSalesForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    email: "",
    name: "",
    phone: "",
    country: "",
    interests: [],
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
        if (formData.interests.length === 0) newErrors.interests = "Please select at least one interest"
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

  const handleInterestChange = (interestId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      interests: checked 
        ? [...prev.interests, interestId]
        : prev.interests.filter(id => id !== interestId)
    }))
  }

  const handleSubmit = async () => {
    if (validateStep(5)) {
      console.log("Form submitted:", formData)
      setIsSubmitted(true)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="border-0 shadow-2xl shadow-black/5 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-semibold text-foreground mb-3">Thank you!</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">We've received your information and will be in touch soon.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-primary/5 shadow-2xl shadow-black/5 bg-card/80 backdrop-blur-sm">
      <CardContent className="p-12 h-[600px] flex flex-col">
        <div className="flex flex-col h-full">
          {/* Progress indicator */}
          <div className="flex items-center justify-between flex-none">
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

          {/* Main content area with fixed height */}
          <div className="flex-1 flex items-center justify-center min-h-0">
            <div className="w-full max-h-full overflow-y-auto p-1">

          {/* Step 1: Company Email */}
          {currentStep === 1 && (
            <div className="space-y-8 animate-in fade-in-50 slide-in-from-right-5 duration-300">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold text-foreground tracking-tight">What's your company email?</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">We'll use this to understand your company better.</p>
              </div>
              <div className="space-y-4">
                <Input
                  type="email"
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
                  <p className="text-sm text-destructive font-medium">{errors.email}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Name and Phone */}
          {currentStep === 2 && (
            <div className="space-y-8 animate-in fade-in-50 slide-in-from-right-5 duration-300">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold text-foreground tracking-tight">What's your name?</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">And optionally, your phone number.</p>
              </div>
              <div className="space-y-6">
                <div>
                  <Input
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
            <div className="space-y-8 animate-in fade-in-50 slide-in-from-right-5 duration-300">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold text-foreground tracking-tight">Which country are you in?</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">This helps us provide relevant information.</p>
              </div>
              <div className="space-y-4">
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
                  <p className="text-sm text-destructive font-medium">{errors.country}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Interests */}
          {currentStep === 4 && (
            <div className="space-y-8 animate-in fade-in-50 slide-in-from-right-5 duration-300">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold text-foreground tracking-tight">What are you interested in?</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">Select all that apply.</p>
              </div>
              <div className="space-y-4">
                {interestOptions.map((option) => (
                  <div key={option.id} className="group">
                    <div className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      formData.interests.includes(option.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-border/80 hover:bg-muted/50"
                    }`}>
                      <Checkbox
                        id={option.id}
                        checked={formData.interests.includes(option.id)}
                        onCheckedChange={(checked) => handleInterestChange(option.id, checked as boolean)}
                        className="w-5 h-5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <Label htmlFor={option.id} className="text-xl cursor-pointer font-medium flex-1 text-foreground">
                        {option.label}
                      </Label>
                    </div>
                  </div>
                ))}
                {errors.interests && (
                  <p className="text-sm text-destructive font-medium">{errors.interests}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 5: How can we help */}
          {currentStep === 5 && (
            <div className="space-y-8 animate-in fade-in-50 slide-in-from-right-5 duration-300">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold text-foreground tracking-tight">How can we help?</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">Tell us about your needs and goals.</p>
              </div>
              <div className="space-y-4">
                <Textarea
                  placeholder="Describe how Vercel can help your company..."
                  value={formData.help}
                  onChange={(e) => setFormData(prev => ({ ...prev, help: e.target.value }))}
                  className={`min-h-[180px] text-lg py-6 px-6 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-primary/10 resize-none ${
                    errors.help 
                      ? "border-destructive/50 focus:border-destructive" 
                      : "border-border focus:border-primary hover:border-border/80"
                  }`}
                />
                {errors.help && (
                  <p className="text-sm text-destructive font-medium">{errors.help}</p>
                )}
              </div>
            </div>
          )}

            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8 flex-none">
            {currentStep > 1 ? (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="flex items-center gap-2 px-6 py-3 text-lg border-2 rounded-xl transition-all duration-200 hover:bg-muted/50"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </Button>
            ) : (
              <div />
            )}

            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                className="flex items-center gap-2 px-8 py-3 text-lg bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="px-8 py-3 text-lg bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
              >
                Submit
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}