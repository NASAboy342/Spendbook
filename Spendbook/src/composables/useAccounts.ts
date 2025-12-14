// Accounts composable - manages account data and operations
import { ref, computed, onMounted } from 'vue'
import { accountService } from '@/services/account'
import { authService } from '@/services/auth'
import type { Account, CreateAccountRequest, UpdateAccountRequest } from '@/types'

export function useAccounts() {
  const accounts = ref<Account[]>([])
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const error = ref<string | null>(null)

  const sortedAccounts = computed(() => {
    return accounts.value
      .slice()
      .sort((a, b) => new Date(b.utcCreatedOn || '').getTime() - new Date(a.utcCreatedOn || '').getTime())
  })

  const totalBalance = computed(() => {
    return accounts.value.reduce((sum, account) => sum + account.balance, 0)
  })

  const fetchAccounts = async () => {
    const username = authService.getUsername()
    if (!username) {
      error.value = 'Not authenticated'
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await accountService.getAccounts(username)
      if (response.errorCode === 0 && response.data) {
        accounts.value = response.data.accounts
      } else {
        error.value = response.errorMessage || 'Failed to load accounts'
      }
    } catch (err) {
      error.value = 'Failed to load accounts'
    } finally {
      isLoading.value = false
    }
  }

  const createAccount = async (data: CreateAccountRequest) => {
    const username = authService.getUsername()
    if (!username) {
      error.value = 'Not authenticated'
      return false
    }

    isSubmitting.value = true
    error.value = null

    try {
      const response = await accountService.createAccount(username, data)
      if (response.errorCode === 0 && response.data) {
        await fetchAccounts()
        return true
      } else {
        error.value = response.errorMessage || 'Failed to create account'
        return false
      }
    } catch (err) {
      error.value = 'Failed to create account'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  const updateAccount = async (id: number, data: UpdateAccountRequest) => {
    const username = authService.getUsername()
    if (!username) {
      error.value = 'Not authenticated'
      return false
    }

    isSubmitting.value = true
    error.value = null

    try {
      const response = await accountService.updateAccount(username, id, data)
      if (response.errorCode === 0 && response.data) {
        await fetchAccounts()
        return true
      } else {
        error.value = response.errorMessage || 'Failed to update account'
        return false
      }
    } catch (err) {
      error.value = 'Failed to update account'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  const deleteAccount = async () => {
    error.value = 'Delete account is not supported by the API'
    return false
  }

  const getAccountById = (id: number | string) => {
    const numId = typeof id === 'string' ? Number(id) : id
    return accounts.value.find(account => account.id === numId)
  }

  const clearError = () => {
    error.value = null
  }

  onMounted(() => {
    fetchAccounts()
  })

  return {
    accounts: sortedAccounts,
    totalBalance,
    isLoading,
    isSubmitting,
    error,
    createAccount,
    updateAccount,
    deleteAccount,
    fetchAccounts,
    getAccountById,
    clearError,
  }
}
