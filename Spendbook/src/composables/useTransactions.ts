// Transactions composable - manages transaction data and operations
import { ref, computed, onMounted } from 'vue'
import { transactionService } from '@/services/transaction'
import { accountService } from '@/services/account'
import { topicService } from '@/services/topic'
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
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  })

  const fetchTransactions = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await transactionService.getTransactions()
      if (response.success && response.data) {
        transactions.value = response.data
      } else {
        error.value = response.error?.message || 'Failed to load transactions'
      }
    } catch (err) {
      error.value = 'Failed to load transactions'
    } finally {
      isLoading.value = false
    }
  }

  const fetchAccounts = async () => {
    const response = await accountService.getAccounts()
    if (response.success && response.data) {
      accounts.value = response.data
    }
  }

  const fetchTopics = async () => {
    const response = await topicService.getTopics()
    if (response.success && response.data) {
      topics.value = response.data
    }
  }

  const createTransaction = async (data: CreateTransactionRequest) => {
    isSubmitting.value = true
    error.value = null

    try {
      const response = await transactionService.createTransaction(data)
      if (response.success && response.data) {
        await fetchTransactions()
        await fetchAccounts() // Refresh accounts to update balances
        return true
      } else {
        error.value = response.error?.message || 'Failed to create transaction'
        return false
      }
    } catch (err) {
      error.value = 'Failed to create transaction'
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  const getAccountById = (id: string) => {
    return accounts.value.find(account => account.id === id)
  }

  const getTopicById = (id: string) => {
    return topics.value.find(topic => topic.id === id)
  }

  const filterByType = (type: TransactionType | null) => {
    if (!type) return sortedTransactions.value
    return sortedTransactions.value.filter(t => t.type === type)
  }

  const filterByAccount = (accountId: string | null) => {
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
