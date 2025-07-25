'use server'

import { z } from 'zod'

const personalDomains = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
  'icloud.com', 'me.com', 'mac.com', 'live.com', 'msn.com',
  'ymail.com', 'rocketmail.com', 'protonmail.com', 'mail.com'
]

const salesFormSchema = z.object({
  email: z.string()
    .email("Please enter a valid email address")
    .refine((email) => {
      const domain = email.toLowerCase().split('@')[1]
      return !personalDomains.includes(domain)
    }, "Please use a company email address"),
  country: z.string().min(1, "Please select a country"),
  interest: z.string().min(1, "Please select your primary interest"),
  help: z.string().min(10, "Please describe your needs (minimum 10 characters)")
})

export type FormState = {
  message?: string
  errors?: {
    email?: string[]
    country?: string[]
    interest?: string[]
    help?: string[]
  }
  success?: boolean
  data?: {
    email?: string
    country?: string
    interest?: string
    help?: string
  }
  intelligentResponse?: string
}

export async function submitSalesForm(prevState: FormState, formData: FormData): Promise<FormState> {
  const rawFormData = {
    email: formData.get('email') as string,
    country: formData.get('country') as string,
    interest: formData.get('interest') as string,
    help: formData.get('help') as string,
  }

  const companyResearchData = formData.get('companyResearch') as string
  let companyResearch = null
  try {
    companyResearch = companyResearchData ? JSON.parse(companyResearchData) : null
  } catch (error) {
    console.error('Failed to parse company research data:', error)
  }

  const validatedFields = salesFormSchema.safeParse(rawFormData)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing or invalid fields. Please correct the errors above.',
      data: rawFormData,
    }
  }

  const { email, country, interest, help } = validatedFields.data

  try {
    // Log the form submission
    console.log('Sales form submission:', { email, country, interest, help })
    
    // Generate intelligent response if we have company research
    let intelligentResponse = ''
    if (companyResearch) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/intelligent-response`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            companyResearch,
            userInput: help,
            userEmail: email,
            country,
            interest
          })
        })

        if (response.ok) {
          const data = await response.json()
          intelligentResponse = data.response
        } else {
          console.error('Failed to generate intelligent response:', response.statusText)
        }
      } catch (error) {
        console.error('Error calling intelligent response API:', error)
      }
    }
    
    return {
      message: intelligentResponse ? 
        'Thank you for reaching out! Here\'s a personalized response based on your company and needs:' :
        'Thank you! We\'ll be in touch soon.',
      success: true,
      intelligentResponse: intelligentResponse || undefined
    }
  } catch (error) {
    return {
      message: 'Something went wrong. Please try again.',
      data: rawFormData,
    }
  }
}

