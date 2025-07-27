"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function SalesForm() {
  const [country, setCountry] = useState("")
  const [interest, setInterest] = useState("")
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validate email before submission
    const emailValidationError = validateEmail(email)
    if (emailValidationError) {
      setEmailError(emailValidationError)
      return
    }
    
    // This form intentionally does nothing.
    console.log("Form submission is disabled.")
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)
    
    // Clear error when user starts typing
    if (emailError) {
      setEmailError("")
    }
    
    // Validate on blur or when email is complete
    if (newEmail.includes('@') && newEmail.includes('.')) {
      const error = validateEmail(newEmail)
      setEmailError(error || "")
    }
  }

  return (
    <Card className="border-transparent p-0">
      <CardContent className="p-0">
        <form onSubmit={handleSubmit} className="grid gap-[2rem]">
          <div className="grid gap-4">
            <Label className="text-md" htmlFor="email">Company email</Label>
            <Input 
              id="email" 
              name="email"
              type="email" 
              placeholder="Email address" 
              value={email}
              onChange={handleEmailChange}
              className={emailError ? "border-destructive focus:border-destructive" : ""}
            />
            {emailError && (
              <p className="text-sm text-destructive font-medium">{emailError}</p>
            )}
          </div>
          
          <div className="grid gap-4">
            <Label className="text-md" htmlFor="country">Country</Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger id="country">
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
          </div>
          
          <div className="grid gap-4">
            <Label className="text-md" htmlFor="interest">Primary Product Interest</Label>
            <Select value={interest} onValueChange={setInterest}>
              <SelectTrigger id="interest">
                <SelectValue placeholder="Select a value" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="v0">v0</SelectItem>
                <SelectItem value="vercel">Vercel</SelectItem>
                <SelectItem value="vercel-v0">Vercel & v0</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-4">
            <Label className="text-md" htmlFor="help">How can we help?</Label>
            <Textarea 
              id="help" 
              name="help"
              placeholder="Your company needs" 
              className={`min-h-[200px]`}
            />
          </div>
          
          <Button 
            type="submit" 
            size="lg" 
            className="w-full rounded-full bg-[#0070f3] hover:bg-[#0063d1] text-white text-base py-6"
          >
            Talk to Vercel
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
