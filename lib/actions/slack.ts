interface FormData {
  email: string
  name: string
  phone?: string
  country: string
  organizationNeeds: string[]
  help: string
}

interface SlackNotificationData {
  formData: FormData
  researchResult?: string
  aiResponse?: string
  timestamp?: string
}

export async function sendSlackNotification(data: SlackNotificationData): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  if (!webhookUrl) {
    console.error('SLACK_WEBHOOK_URL not configured')
    return
  }

  try {
    const interestsText = data.formData.organizationNeeds && data.formData.organizationNeeds.length > 0 
      ? data.formData.organizationNeeds.join(', ')
      : 'None specified'

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
            text: `*Organization Needs:*\n${interestsText}`
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
          text: `*🔍 Company Research Summary:*\n${data.researchResult ? data.researchResult.substring(0, 2000) + (data.researchResult.length > 2000 ? '...' : '') : 'No research available'}`
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
            text: `Submitted: ${data.timestamp ? new Date(data.timestamp).toLocaleString() : new Date().toLocaleString()}`
          }
        ]
      }
    ]

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
  } catch (error) {
    console.error('Slack notification failed:', error)
  }
}