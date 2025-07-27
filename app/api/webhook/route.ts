import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for demo (use a database in production)
let webhookData: any[] = []

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Add timestamp and ID for tracking
    const entry = {
      id: Date.now().toString(),
      receivedAt: new Date().toISOString(),
      ...data
    }
    
    // Store the webhook data
    webhookData.unshift(entry) // Add to beginning
    
    // Keep only last 50 entries
    if (webhookData.length > 50) {
      webhookData = webhookData.slice(0, 50)
    }
    
    console.log('Webhook received:', entry)
    
    return NextResponse.json({ success: true, id: entry.id })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Invalid webhook data' }, { status: 400 })
  }
}

export async function GET() {
  return NextResponse.json({ data: webhookData })
}