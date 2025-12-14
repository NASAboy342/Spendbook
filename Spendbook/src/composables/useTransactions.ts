// Transactions composable - manages transaction data and operations
import { ref, computed, onMounted } from 'vue'
import { transactionService } from '@/services/transaction'
import { accountService } from '@/services/account'
import { topicService } from '@/services/topic'
import { authService } from '@/services/auth'
import { getTransactionType } from '@/types'
import type { Transaction, Account, Topic, CreateTransactionRequest, TransactionType } from '@/types'

export function useTransactions() {
  const transactions = ref<Transaction[]>([])
  const accounts = ref<Account[]>([])
  const topics = ref<Topic[]>([])
  const isLoading = ref(false)
  const isSubmitting = ref(false)
  const error = ref<string | null>(null)

  const sortedTransactions = computed(() => {
    return transactions.value
      .slice()
      .sort((a, b) => new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime())
  })

  const fetchTransactions = async (accountId?: number, fromUtcDate?: string, toUtcDate?: string) => {
    isLoading.value = true
    error.value = null

    try {
      const username = authService.getUsername()
      if (!username) {
        error.value = 'Not authenticated'
        return
      }

      if (!accountId) {
        // If no account specified, just clear transactions
        transactions.value = []
        return
      }

      const response = await transactionService.getTransactions(username, accountId, fromUtcDate, toUtcDate)
      if (response.errorCode === 0 && response.data) {
        transactions.value = response.data
      } else {
        error.value = response.errorMessage || 'Failed to load transactions'
      }
    } catch (err) {
      error.value = 'Failed to load transactions'
    } finally {
      isLoading.value = false
    }
  }

  const fetchAccounts = async () => {
    const username = authService.getUsername()
    if (!username) return

    const response = await accountService.getAccounts(username)
    if (response.errorCode === 0 && response.data) {
      accounts.value = response.data.accounts
    }
  }

  const fetchTopics = async () => {
    const username = authService.getUsername()
    if (!username) return

    const response = await topicService.getTopics(username)
    if (response.errorCode === 0 && response.data) {
      topics.value = response.data.topics
    }
  }

  const createTransaction = async (data: CreateTransactionRequest) => {
    isSubmitting.value = true
    error.value = null

    try {
      const username = authService.getUsername()
      if (!username) {
        error.value = 'Not authenticated'
        return false
      }

      const response = await transactionService.createTransaction(username, data)
      if (response.errorCode === 0 && response.data) {
        await fetchTransactions(data.accountId)
        await fetchAccounts() // Refresh accounts to update balances
        return true
      } else {
        error.value = response.errorMessage || 'Failed to create transaction'
        return false
      }
    } catch (err) {
      error.value = 'Failed to create transaction'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  const getAccountById = (id: number) => {
    return accounts.value.find(account => account.id === id)
  }

  const getTopicById = (id: number) => {
    return topics.value.find(topic => topic.id === id)
  }

  const filterByType = (type: TransactionType | null) => {
    if (!type) return sortedTransactions.value
    return sortedTransactions.value.filter(t => getTransactionType(t.amount) === type)
  }

  const filterByAccount = (accountId: number | null) => {
    if (!accountId) return sortedTransactions.value
    return sortedTransactions.value.filter(t => t.accountId === accountId)
  }

  const clearError = () => {
    error.value = null
  }

  onMounted(() => {
    fetchTransactions()
    fetchAccounts()
    fetchTopics()
  })

  return {
    transactions: sortedTransactions,
    accounts,
    topics,
    isLoading,
    isSubmitting,
    error,
    createTransaction,
    fetchTransactions,
    getAccountById,
    getTopicById,
    filterByType,
    filterByAccount,
    clearError,
  }
}
