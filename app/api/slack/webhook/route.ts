import { NextRequest, NextResponse } from 'next/server'

interface SlackData {
  formData: {
    email: string
    name: string
    phone?: string
    country: string
    interests?: string[]
    help: string
  }
  researchResult?: string
  aiResponse?: string
  timestamp: string
}

export async function POST(req: NextRequest) {
  try {
    const data: SlackData = await req.json()
    
    const webhookUrl = process.env.SLACK_WEBHOOK_URL
    if (!webhookUrl) {
      console.error('SLACK_WEBHOOK_URL not configured')
      return NextResponse.json({ error: 'Slack webhook URL not configured' }, { status: 500 })
    }

    // Format interests for display
    const interestsText = data.formData.interests && data.formData.interests.length > 0 
      ? data.formData.interests.join(', ')
      : 'None specified'

    // Create rich Slack message with blocks
    const blocks = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🎯 New Sales Lead'
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Name:*\n${data.formData.name}`
          },
          {
            type: 'mrkdwn',
            text: `*Email:*\n${data.formData.email}`
          },
          {
            type: 'mrkdwn',
            text: `*Country:*\n${data.formData.country}`
          },
          {
            type: 'mrkdwn',
            text: `*Phone:*\n${data.formData.phone || 'Not provided'}`
          }
        ]
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Interests:*\n${interestsText}`
          }
        ]
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*How we can help:*\n${data.formData.help}`
        }
      },
      {
        type: 'divider'
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*🔍 AI Research Summary:*\n${data.researchResult ? data.researchResult.substring(0, 2000) + (data.researchResult.length > 2000 ? '...' : '') : 'No research available'}`
        }
      },
      {
        type: 'divider'
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*✉️ Suggested Response:*\n${data.aiResponse ? data.aiResponse.substring(0, 2000) + (data.aiResponse.length > 2000 ? '...' : '') : 'No response generated'}`
        }
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `Submitted: ${new Date(data.timestamp).toLocaleString()}`
          }
        ]
      }
    ]

    // Send to Slack via incoming webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        blocks,
        text: `New sales lead from ${data.formData.name} (${data.formData.email})`
      })
    })

    if (!response.ok) {
      throw new Error(`Slack webhook failed: ${response.statusText}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Slack webhook error:', error)
    return NextResponse.json({ error: 'Failed to send to Slack' }, { status: 500 })
  }
}