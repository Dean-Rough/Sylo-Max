"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type Message = {
  id: string
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: 'Welcome to Sylo-Max! I\'m your AI assistant for design studio management. Ask me to create projects, manage tasks, or help with your workflow.',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI response - replace with actual API call
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `I understand you want to: "${input}". I'm working on implementing this feature. For now, I can help you navigate to the relevant section or provide guidance on your request.`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-full w-full flex-col bg-white shadow-2xl shadow-gray-100 dark:!bg-navy-800 dark:shadow-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-navy-700">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-navy-700 dark:text-white">AI Assistant</h3>
            <p className="text-xs text-gray-500 dark:text-gray-300">Always here to help</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex max-w-[80%] items-start space-x-2">
              {message.type === 'assistant' && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 mt-1">
                  <Bot className="h-3 w-3 text-white" />
                </div>
              )}
              
              <Card className={`p-3 ${
                message.type === 'user' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                  : message.type === 'system'
                  ? 'bg-gray-100 dark:bg-navy-700 border-dashed'
                  : 'bg-gray-50 dark:bg-navy-900'
              }`}>
                <p className={`text-sm ${
                  message.type === 'user' 
                    ? 'text-white' 
                    : 'text-navy-700 dark:text-white'
                }`}>
                  {message.content}
                </p>
                <p className={`text-xs mt-1 ${
                  message.type === 'user' 
                    ? 'text-white/70' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </Card>

              {message.type === 'user' && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-navy-700 dark:bg-white mt-1">
                  <User className="h-3 w-3 text-white dark:text-navy-700" />
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600">
                <Bot className="h-3 w-3 text-white" />
              </div>
              <Card className="p-3 bg-gray-50 dark:bg-navy-900">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </Card>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4 dark:border-navy-700">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your projects..."
              className="w-full resize-none rounded-xl border border-gray-200 bg-white p-3 pr-12 text-sm text-navy-700 outline-none focus:border-blue-500 dark:border-navy-700 dark:bg-navy-900 dark:text-white dark:placeholder-gray-400"
              rows={2}
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="flex h-auto items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 text-white hover:from-blue-600 hover:to-blue-700 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}