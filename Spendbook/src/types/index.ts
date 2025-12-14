// Core type definitions for Spendbook v1

export interface User {
  username: string
  utcCreateOn: string
}

export interface Account {
  id: number
  userId: number
  name: string
  balance: number
  currency: string
  usdRate: number
  utcCreatedOn: string | null
  utcModifiedOn: string | null
  utcLastAccessedOn: string | null
}

export interface UserSummaryStatus {
  accounts: Account[]
  trackingTopics: Topic[]
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
  id: number
  topic: string
  userId: number
  utcTargetDate: string
  targetAmount: number
  currency: string
  utcCreatedOn: string
  utcModifiedOn: string
  status: string
  statusCode: TopicStatus
}

export interface GetTopicResponse {
  topics: Topic[]
}

export const TransactionType = {
  PayIn: 'pay-in',
  PayOut: 'pay-out',
} as const

export type TransactionType = typeof TransactionType[keyof typeof TransactionType]

/**
 * Determine transaction type based on amount
 * Positive amount = PayIn, Negative amount = PayOut
 */
export function getTransactionType(amount: number): TransactionType {
  return amount >= 0 ? TransactionType.PayIn : TransactionType.PayOut
}

export interface Transaction {
  id: number
  accountId: number
  amount: number
  balanceBefore: number
  receiptUrl: string | null
  remarks: string | null
  balanceAfter: number
  timeStamp: string
  trackingTopicId: number | null
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
}

export interface AuthResponse {
  username: string
  utcCreateOn: string
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
  accountId: number
  topicId?: number
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
  errorCode?: number
  errorMessage?: string
}
