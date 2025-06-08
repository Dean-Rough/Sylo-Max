import OpenAI from 'openai'
import type { ChatMessage, Intent, Entity, ParsedIntent } from '@/types'

// Lazy initialization of OpenAI client
let openai: OpenAI | null = null

function getOpenAIClient(): OpenAI {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured')
    }
    openai = new OpenAI({ apiKey })
  }
  return openai
}

// Design studio specific system prompt
const SYSTEM_PROMPT = `You are an AI assistant for Sylo-Max, a design studio management platform. You help interior designers, architects, and creative professionals manage their projects, clients, and tasks through natural conversation.

Your capabilities include:
- Creating and managing projects, tasks, and clients
- Scheduling meetings and deadlines
- Providing project status updates
- Managing supplier and product information
- Generating reports and analytics
- Coordinating team workflows

You understand design industry terminology and workflows including:
- RIBA work stages and creative project phases
- Interior design and architecture processes
- Material and product specifications
- Client presentation and approval cycles
- Design team collaboration patterns

Always respond in a professional, helpful tone appropriate for design professionals. When creating or updating entities, confirm details with the user before proceeding.`

// Function definitions for OpenAI function calling
const FUNCTION_DEFINITIONS = [
  {
    name: 'create_project',
    description: 'Create a new design project',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Project name' },
        clientName: { type: 'string', description: 'Client name' },
        projectType: { 
          type: 'string', 
          enum: ['interior', 'architecture', 'branding', 'web'],
          description: 'Type of design project'
        },
        budget: { type: 'number', description: 'Project budget' },
        description: { type: 'string', description: 'Project description' },
        deadline: { type: 'string', description: 'Project deadline (ISO date)' }
      },
      required: ['name', 'clientName', 'projectType']
    }
  },
  {
    name: 'create_task',
    description: 'Create a new task within a project',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Task title' },
        projectId: { type: 'string', description: 'Project ID' },
        description: { type: 'string', description: 'Task description' },
        priority: {
          type: 'string',
          enum: ['low', 'medium', 'high', 'urgent'],
          description: 'Task priority level'
        },
        dueDate: { type: 'string', description: 'Due date (ISO date)' },
        assigneeEmail: { type: 'string', description: 'Assignee email address' }
      },
      required: ['title', 'projectId']
    }
  },
  {
    name: 'create_client',
    description: 'Create a new client record',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Client name' },
        email: { type: 'string', description: 'Client email' },
        phone: { type: 'string', description: 'Client phone number' },
        company: { type: 'string', description: 'Client company name' }
      },
      required: ['name']
    }
  },
  {
    name: 'get_project_status',
    description: 'Get status and progress of projects',
    parameters: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'Specific project ID (optional)' },
        clientName: { type: 'string', description: 'Filter by client name (optional)' }
      }
    }
  },
  {
    name: 'schedule_meeting',
    description: 'Schedule a meeting or deadline',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Meeting title' },
        dateTime: { type: 'string', description: 'Meeting date and time (ISO)' },
        attendees: { 
          type: 'array', 
          items: { type: 'string' }, 
          description: 'Attendee email addresses' 
        },
        projectId: { type: 'string', description: 'Related project ID (optional)' }
      },
      required: ['title', 'dateTime']
    }
  },
  {
    name: 'search_entities',
    description: 'Search for projects, clients, tasks, or products',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        type: {
          type: 'string',
          enum: ['projects', 'clients', 'tasks', 'products', 'all'],
          description: 'Type of entity to search'
        }
      },
      required: ['query']
    }
  }
]

export class AIService {
  async parseIntent(message: string, context?: any): Promise<ParsedIntent> {
    try {
      const completion = await getOpenAIClient().chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message }
        ],
        functions: FUNCTION_DEFINITIONS,
        function_call: 'auto',
        temperature: 0.3
      })

      const choice = completion.choices[0]
      
      if (choice.message.function_call) {
        const functionName = choice.message.function_call.name as Intent
        const functionArgs = JSON.parse(choice.message.function_call.arguments || '{}')
        
        return {
          intent: functionName as Intent,
          confidence: 0.9, // High confidence for function calls
          entities: this.extractEntitiesFromArgs(functionArgs),
          originalText: message
        }
      }

      // If no function call, classify as general query
      return {
        intent: 'unknown',
        confidence: 0.5,
        entities: [],
        originalText: message
      }
    } catch (error) {
      console.error('OpenAI API error:', error)
      throw new Error('Failed to parse intent')
    }
  }

  async generateResponse(
    intent: ParsedIntent, 
    context: any, 
    actionResults?: any[]
  ): Promise<string> {
    try {
      let prompt = `Based on the user's intent "${intent.intent}" and the following context, generate a helpful response:`
      
      if (context.currentProject) {
        prompt += `\nCurrent project context: ${context.currentProject}`
      }
      
      if (actionResults && actionResults.length > 0) {
        prompt += `\nActions performed: ${JSON.stringify(actionResults)}`
      }
      
      prompt += `\nOriginal user message: "${intent.originalText}"`
      prompt += `\nPlease provide a clear, professional response appropriate for a design studio context.`

      const completion = await getOpenAIClient().chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      })

      return completion.choices[0].message.content || 'I apologize, but I encountered an issue generating a response.'
    } catch (error) {
      console.error('Response generation error:', error)
      return 'I apologize, but I encountered an issue processing your request. Please try again.'
    }
  }

  private extractEntitiesFromArgs(args: any): Entity[] {
    const entities: Entity[] = []
    
    for (const [key, value] of Object.entries(args)) {
      if (value) {
        entities.push({
          type: key,
          value: String(value),
          confidence: 0.9
        })
      }
    }
    
    return entities
  }

  async generateSuggestions(context: any): Promise<string[]> {
    const suggestions = [
      "Show me today's tasks",
      "Create a new project",
      "Schedule a client meeting",
      "What's the status of my projects?"
    ]

    // Add context-specific suggestions
    if (context.currentProject) {
      suggestions.unshift(
        `Add a task to ${context.currentProject}`,
        `Update project status`,
        `Schedule project meeting`
      )
    }

    return suggestions.slice(0, 4) // Return top 4 suggestions
  }
}

export const aiService = new AIService()