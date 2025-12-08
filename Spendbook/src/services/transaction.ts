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
   * Get all transactions
   * POST /transactions/list
   */
  async getTransactions(): Promise<ApiResponse<Transaction[]>> {
    return apiService.post<Transaction[]>('/transactions/list')
  },

  /**
   * Create new transaction
   * POST /transactions/create
   */
  async createTransaction(
    data: CreateTransactionRequest
  ): Promise<ApiResponse<Transaction>> {
    return apiService.post<Transaction>('/transactions/create', data)
  },

  /**
   * Get transaction report filtered by date range and optional topic
   * POST /transactions/report
   */
  async getReport(
    filters: TransactionReportRequest
  ): Promise<ApiResponse<Transaction[]>> {
    return apiService.post<Transaction[]>('/transactions/report', filters)
  },
}
