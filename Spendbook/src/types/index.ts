// Core type definitions for Spendbook v1

export interface User {
  id: string
  username: string
  email: string
}

export interface Account {
  id: string
  name: string
  balance: number
  createdAt: string
  updatedAt: string
}

export const TopicStatus = {
  Active: 0,
  Completed: 1,
  Failed: 2,
  Cancelled: 3,
  Unknown: 4,
} as const

export type TopicStatus = typeof TopicStatus[keyof typeof TopicStatus]

export interface Topic {
  id: string
  name: string
  targetAmount: number
  targetDate: string
  currentAmount: number
  status: TopicStatus
  createdAt: string
  updatedAt: string
}

export const TransactionType = {
  PayIn: 'pay-in',
  PayOut: 'pay-out',
} as const

export type TransactionType = typeof TransactionType[keyof typeof TransactionType]

export interface Transaction {
  id: string
  accountId: string
  topicId?: string
  type: TransactionType
  amount: number
  description: string
  timestamp: string
  createdAt: string
}

// API Request/Response types
export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface CreateAccountRequest {
  name: string
  initialBalance: number
}

export interface UpdateAccountRequest {
  name: string
}

export interface CreateTopicRequest {
  name: string
  targetAmount: number
  targetDate: string
}

export interface UpdateTopicRequest {
  name?: string
  targetAmount?: number
  targetDate?: string
  status?: TopicStatus
}

export interface CreateTransactionRequest {
  accountId: string
  topicId?: string
  type: TransactionType
  amount: number
  description: string
}

export interface TransactionReportRequest {
  startDate: string
  endDate: string
  topicId?: string
}

export interface ApiError {
  message: string
  code?: string
}

export interface ApiResponse<T> {
  data?: T
  error?: ApiError
  success: boolean
}
