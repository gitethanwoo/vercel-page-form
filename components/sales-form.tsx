"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useActionState, useState, useEffect } from "react"
import { submitSalesForm, type FormState } from "@/lib/actions"

const initialState: FormState = {
  message: '',
  errors: {},
}

export function SalesForm() {
  const [state, formAction, pending] = useActionState(submitSalesForm, initialState)
  const [country, setCountry] = useState(state?.data?.country || "")
  const [interest, setInterest] = useState(state?.data?.interest || "")

  // Update local state when server state changes
  useEffect(() => {
    if (state?.data) {
      setCountry(state.data.country || "")
      setInterest(state.data.interest || "")
    }
  }, [state?.data])

  return (
    <Card className="border-transparent p-0">
      <CardContent className="p-0">
        <form action={formAction} className="grid gap-[2rem]">
          {state?.message && (
            <div className={`p-4 rounded-md ${state.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {state.message}
            </div>
          )}
          
          <div className="grid gap-4">
            <Label className="text-md" htmlFor="email">Company email</Label>
            <Input 
              id="email" 
              name="email"
              type="email" 
              placeholder="Email address" 
              defaultValue={state?.data?.email || ""}
              className={state?.errors?.email ? "border-red-500" : ""}
              disabled={pending}
            />
            {state?.errors?.email && (
              <p className="text-sm text-red-500 mt-1">{state.errors.email[0]}</p>
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
