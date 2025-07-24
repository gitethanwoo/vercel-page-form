"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export function SalesForm() {
  return (
    <Card className="border-transparent p-0">
      <CardContent className="p-0">
        <form className="grid gap-[2rem]">
          <div className="grid gap-4">
            <Label className="text-md" htmlFor="email">Company email</Label>
            <Input id="email" type="email" placeholder="Email address" />
          </div>
          <div className="grid gap-4">
            <Label className="text-md" htmlFor="country">Country</Label>
            <Select>
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
            <Select>
              <SelectTrigger id="interest">
                <SelectValue placeholder="Select a value" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enterprise">Vercel for Enterprise</SelectItem>
                <SelectItem value="pro">Vercel Pro</SelectItem>
                <SelectItem value="security">Security & Compliance</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4">
            <Label className="text-md" htmlFor="help">How can we help?</Label>
            <Textarea id="help" placeholder="Your company needs" className="min-h-[200px]" />
          </div>
          <Button type="submit" size="lg" className="w-full rounded-full bg-[#0070f3] hover:bg-[#0063d1] text-white text-base py-6">
            Talk to Vercel
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
