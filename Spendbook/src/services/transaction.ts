// Transaction API service
import { apiService } from './api'
import type {
  Transaction,
  CreateTransactionRequest,
  TransactionReportRequest,
  ApiResponse,
} from '@/types'

export const transactionService = {
  /**
   * Get transactions
   * POST /api/spendbook/get-transaction
   */
  async getTransactions(username: string, accountId: number, fromUtcDate?: string, toUtcDate?: string): Promise<ApiResponse<Transaction[]>> {
    const response = await apiService.post<any>('/api/spendbook/get-transaction', {
      username,
      accountId,
      fromUtcDate,
      toUtcDate
    })
    return response
  },

  /**
   * Create new transaction (payin or payout)
   */
  async createTransaction(
    username: string,
    data: CreateTransactionRequest
  ): Promise<ApiResponse<Transaction>> {
    const endpoint = data.type === 'pay-in' ? '/api/spendbook/payin' : '/api/spendbook/payout'
    return apiService.post<Transaction>(endpoint, {
      username,
      accountId: Number(data.accountId),
      amount: data.amount,
      receiptUrl: '',
      remarks: data.description,
      trackingTopicId: data.topicId ? Number(data.topicId) : 0
    })
  },

  /**
   * Get transaction report filtered by date range and optional topic
   * POST /api/spendbook/get-transaction
   */
  async getReport(
    username: string,
    filters: TransactionReportRequest
  ): Promise<ApiResponse<Transaction[]>> {
    const response = await apiService.post<any>('/api/spendbook/get-transaction', {
      username,
      accountId: 0, // Get all accounts
      fromUtcDate: filters.startDate,
      toUtcDate: filters.endDate,
      trackingTopicId: filters.topicId ? Number(filters.topicId) : null
    })
    return response
  },
}
