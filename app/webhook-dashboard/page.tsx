"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Clock, User, Mail, MessageSquare } from 'lucide-react'

// Simple markdown renderer for basic formatting
const MarkdownRenderer = ({ content }: { content: string }) => {
  const formatMarkdown = (text: string) => {
    return text
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic text
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-2 rounded text-sm overflow-x-auto"><code>$1</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>')
      // Line breaks
      .replace(/\n/g, '<br />')
  }

  return (
    <div 
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }}
    />
  )
}

interface WebhookEntry {
  id: string
  receivedAt: string
  formData: {
    email?: string
    name?: string
    phone?: string
    company?: string
    message?: string
    country?: string
    interests?: string[]
    help?: string
    [key: string]: any // Allow for additional fields
  }
  aiResponse: string
  timestamp: string
}

export default function WebhookDashboard() {
  const [data, setData] = useState<WebhookEntry[]>([])
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/webhook')
      const result = await response.json()
      setData(result.data || [])
    } catch (error) {
      console.error('Failed to fetch webhook data:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const getInterestColor = (interest: string) => {
    const colors: Record<string, string> = {
      vercel: 'bg-blue-100 text-blue-800',
      v0: 'bg-purple-100 text-purple-800',
      other: 'bg-gray-100 text-gray-800'
    }
    return colors[interest] || colors.other
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Webhook Dashboard</h1>
            <p className="text-muted-foreground">Real-time AI workflow results</p>
          </div>
          <Button 
            onClick={fetchData} 
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="grid gap-6">
          {data.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No webhook data yet</h3>
                <p className="text-muted-foreground">
                  Submit a form to see AI workflow results appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            data.map((entry) => (
              <Card key={entry.id} className="border border-primary/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      {entry.formData.name || 'N/A'}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {formatTime(entry.receivedAt)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Form Data */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{entry.formData.email || 'N/A'}</span>
                      </div>
                      {entry.formData.company && (
                        <div>
                          <span className="text-sm text-muted-foreground">Company: </span>
                          <span>{entry.formData.company}</span>
                        </div>
                      )}
                      {entry.formData.country && (
                        <div>
                          <span className="text-sm text-muted-foreground">Country: </span>
                          <span>{entry.formData.country}</span>
                        </div>
                      )}
                      {entry.formData.phone && (
                        <div>
                          <span className="text-sm text-muted-foreground">Phone: </span>
                          <span>{entry.formData.phone}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      {entry.formData.interests && entry.formData.interests.length > 0 && (
                        <div>
                          <span className="text-sm text-muted-foreground block mb-1">Interests:</span>
                          <div className="flex gap-1 flex-wrap">
                            {entry.formData.interests.map((interest: string) => (
                              <Badge 
                                key={interest} 
                                variant="secondary"
                                className={getInterestColor(interest)}
                              >
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* User's Message */}
                  {entry.formData.message && (
                    <div>
                      <h4 className="font-medium mb-2">Message:</h4>
                      <p className="text-sm bg-muted/50 p-3 rounded-lg">
                        {entry.formData.message}
                      </p>
                    </div>
                  )}

                  {/* User's Help Request */}
                  {entry.formData.help && (
                    <div>
                      <h4 className="font-medium mb-2">How can we help?</h4>
                      <p className="text-sm bg-muted/50 p-3 rounded-lg">
                        {entry.formData.help}
                      </p>
                    </div>
                  )}

                  {/* AI Response */}
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      AI Response
                    </h4>
                    <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                      <MarkdownRenderer content={entry.aiResponse} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}