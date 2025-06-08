import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import type { ApiResponse, User } from '@/types'

// Error codes as defined in system architecture
export enum ErrorCodes {
  // Authentication & Authorization (1000-1999)
  INVALID_TOKEN = 1001,
  TOKEN_EXPIRED = 1002,
  INSUFFICIENT_PERMISSIONS = 1003,
  FIRM_ACCESS_DENIED = 1004,
  
  // Validation Errors (2000-2999)
  INVALID_INPUT = 2001,
  MISSING_REQUIRED_FIELD = 2002,
  INVALID_EMAIL_FORMAT = 2003,
  INVALID_DATE_RANGE = 2004,
  BUDGET_EXCEEDS_LIMIT = 2005,
  
  // Resource Errors (3000-3999)
  RESOURCE_NOT_FOUND = 3001,
  PROJECT_NOT_FOUND = 3002,
  CLIENT_NOT_FOUND = 3003,
  TASK_NOT_FOUND = 3004,
  SUPPLIER_NOT_FOUND = 3005,
  
  // Business Logic Errors (4000-4999)
  PROJECT_ALREADY_COMPLETED = 4001,
  TASK_DEPENDENCY_CYCLE = 4002,
  BUDGET_EXCEEDED = 4003,
  TIMELINE_CONFLICT = 4004,
  STAGE_PROGRESSION_INVALID = 4005,
  
  // External Service Errors (5000-5999)
  OPENAI_API_ERROR = 5001,
  GOOGLE_CALENDAR_ERROR = 5002,
  XERO_API_ERROR = 5003,
  EMAIL_SERVICE_ERROR = 5004,
  FILE_STORAGE_ERROR = 5005,
  
  // System Errors (6000-6999)
  DATABASE_CONNECTION_ERROR = 6001,
  REDIS_CONNECTION_ERROR = 6002,
  WEBSOCKET_CONNECTION_ERROR = 6003,
  RATE_LIMIT_EXCEEDED = 6004,
  INTERNAL_SERVER_ERROR = 6999
}

export class AppError extends Error {
  constructor(
    public code: ErrorCodes,
    message: string,
    public details?: any,
    public statusCode: number = 500
  ) {
    super(message)
    this.name = 'AppError'
  }
}

// Error response formatter
export function formatErrorResponse(error: Error | AppError, requestId?: string): ApiResponse {
  const isAppError = error instanceof AppError
  
  return {
    success: false,
    error: {
      code: isAppError ? ErrorCodes[error.code] : 'INTERNAL_SERVER_ERROR',
      message: error.message,
      details: isAppError ? error.details : undefined,
      timestamp: new Date().toISOString(),
      requestId: requestId || generateRequestId()
    }
  }
}

// Success response formatter
export function formatSuccessResponse<T>(data: T, meta?: any): ApiResponse<T> {
  return {
    success: true,
    data,
    meta
  }
}

// HTTP status code mapping
export function getStatusCode(error: AppError): number {
  if (error.statusCode) return error.statusCode
  
  switch (error.code) {
    case ErrorCodes.INVALID_TOKEN:
    case ErrorCodes.TOKEN_EXPIRED:
      return 401
    case ErrorCodes.INSUFFICIENT_PERMISSIONS:
    case ErrorCodes.FIRM_ACCESS_DENIED:
      return 403
    case ErrorCodes.RESOURCE_NOT_FOUND:
    case ErrorCodes.PROJECT_NOT_FOUND:
    case ErrorCodes.CLIENT_NOT_FOUND:
    case ErrorCodes.TASK_NOT_FOUND:
    case ErrorCodes.SUPPLIER_NOT_FOUND:
      return 404
    case ErrorCodes.INVALID_INPUT:
    case ErrorCodes.MISSING_REQUIRED_FIELD:
    case ErrorCodes.INVALID_EMAIL_FORMAT:
    case ErrorCodes.INVALID_DATE_RANGE:
    case ErrorCodes.BUDGET_EXCEEDS_LIMIT:
      return 400
    case ErrorCodes.RATE_LIMIT_EXCEEDED:
      return 429
    default:
      return 500
  }
}

// Error handler for API routes
export function handleApiError(error: Error | AppError): NextResponse {
  console.error('API Error:', error)
  
  const appError = error instanceof AppError ? error : new AppError(
    ErrorCodes.INTERNAL_SERVER_ERROR,
    'An unexpected error occurred',
    process.env.NODE_ENV === 'development' ? error.stack : undefined
  )
  
  const statusCode = getStatusCode(appError)
  const response = formatErrorResponse(appError)
  
  return NextResponse.json(response, { status: statusCode })
}

// Success response helper
export function successResponse<T>(data: T, meta?: any): NextResponse {
  return NextResponse.json(formatSuccessResponse(data, meta))
}

// Validation helpers
export function validateRequired(value: any, fieldName: string): void {
  if (value === undefined || value === null || value === '') {
    throw new AppError(
      ErrorCodes.MISSING_REQUIRED_FIELD,
      `${fieldName} is required`,
      { field: fieldName },
      400
    )
  }
}

export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new AppError(
      ErrorCodes.INVALID_EMAIL_FORMAT,
      'Invalid email format',
      { email },
      400
    )
  }
}

export function validateDateRange(startDate: Date, endDate: Date): void {
  if (startDate >= endDate) {
    throw new AppError(
      ErrorCodes.INVALID_DATE_RANGE,
      'Start date must be before end date',
      { startDate, endDate },
      400
    )
  }
}

// Request ID generator
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Retryable error checker
export function isRetryableError(code: ErrorCodes): boolean {
  const retryableCodes = [
    ErrorCodes.DATABASE_CONNECTION_ERROR,
    ErrorCodes.REDIS_CONNECTION_ERROR,
    ErrorCodes.OPENAI_API_ERROR,
    ErrorCodes.RATE_LIMIT_EXCEEDED
  ]
  return retryableCodes.includes(code)
}

// Mock authentication for development
export async function requireAuth(request: NextRequest): Promise<User> {
  // In a real app, this would validate JWT tokens, session cookies, etc.
  // For development, we'll return a mock user
  return {
    id: 'user_1',
    firmId: 'firm_1',
    email: 'dean@sylo-max.com',
    firstName: 'Dean',
    lastName: 'Newton',
    role: 'owner',
    avatarUrl: null,
    firm: {
      id: 'firm_1',
      name: 'Newton Design Studio',
      slug: 'newton-design',
      subscriptionTier: 'free'
    }
  }
}