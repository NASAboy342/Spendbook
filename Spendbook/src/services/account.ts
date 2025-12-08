// Account API service
import { apiService } from './api'
import type {
  Account,
  CreateAccountRequest,
  UpdateAccountRequest,
  ApiResponse,
} from '@/types'

export const accountService = {
  /**
   * Get all accounts
   * POST /accounts/list
   */
  async getAccounts(): Promise<ApiResponse<Account[]>> {
    return apiService.post<Account[]>('/accounts/list')
  },

  /**
   * Create new account
   * POST /accounts/create
   */
  async createAccount(data: CreateAccountRequest): Promise<ApiResponse<Account>> {
    return apiService.post<Account>('/accounts/create', data)
  },

  /**
   * Update account
   * POST /accounts/update
   */
  async updateAccount(
    id: string,
    data: UpdateAccountRequest
  ): Promise<ApiResponse<Account>> {
    return apiService.post<Account>('/accounts/update', { id, ...data })
  },

  /**
   * Delete account
   * POST /accounts/delete
   */
  async deleteAccount(id: string): Promise<ApiResponse<void>> {
    return apiService.post<void>('/accounts/delete', { id })
  },
}
