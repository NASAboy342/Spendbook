// Account API service
import { apiService } from './api'
import type {
  Account,
  CreateAccountRequest,
  UpdateAccountRequest,
  ApiResponse,
  UserSummaryStatus,
} from '@/types'

export const accountService = {
  /**
   * Get all accounts (via user summary status)
   * POST /api/spendbook/get-user-summary-status
   */
  async getAccounts(username: string): Promise<ApiResponse<UserSummaryStatus>> {
    const response = await apiService.post<UserSummaryStatus>('/api/spendbook/get-user-summary-status', { username });
    return response
  },

  /**
   * Create new account
   * POST /api/spendbook/create-account
   */
  async createAccount(username: string, data: CreateAccountRequest): Promise<ApiResponse<Account>> {
    return apiService.post<Account>('/api/spendbook/create-account', {
      username,
      accountName: data.name,
      initialBalance: data.initialBalance,
      currency: 'USD'
    })
  },

  /**
   * Update account
   * POST /api/spendbook/update-account
   */
  async updateAccount(
    username: string,
    accountId: number,
    data: UpdateAccountRequest
  ): Promise<ApiResponse<Account>> {
    return apiService.post<Account>('/api/spendbook/update-account', {
      username,
      accountId,
      newAccountName: data.name
    })
  },

  /**
   * Delete account - not supported by API
   */
  async deleteAccount(): Promise<ApiResponse<void>> {
    return {
      errorCode: 1,
      errorMessage: 'Delete account is not supported by the API' 
    }
  },
}
