// Dashboard composable - manages dashboard data and state
import { ref, computed, onMounted } from 'vue'
import { accountService } from '@/services/account'
import { transactionService } from '@/services/transaction'
import { topicService } from '@/services/topic'
import type { Account, Transaction, Topic } from '@/types'

export function useDashboard() {
  const accounts = ref<Account[]>([])
  const transactions = ref<Transaction[]>([])
  const topics = ref<Topic[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const totalBalance = computed(() => {
    return accounts.value.reduce((sum, account) => sum + account.balance, 0)
  })

  const recentTransactions = computed(() => {
    return transactions.value
      .slice()
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5)
  })

  const activeTopics = computed(() => {
    return topics.value.filter(topic => topic.status === 0) // Active status
  })

  const accountsCount = computed(() => accounts.value.length)

  const topicsCount = computed(() => activeTopics.value.length)

  const fetchDashboardData = async () => {
    isLoading.value = true
    error.value = null

    try {
      const [accountsRes, transactionsRes, topicsRes] = await Promise.all([
        accountService.getAccounts(),
        transactionService.getTransactions(),
        topicService.getTopics(),
      ])

      if (accountsRes.success && accountsRes.data) {
        accounts.value = accountsRes.data
      }

      if (transactionsRes.success && transactionsRes.data) {
        transactions.value = transactionsRes.data
      }

      if (topicsRes.success && topicsRes.data) {
        topics.value = topicsRes.data
      }

      if (!accountsRes.success || !transactionsRes.success || !topicsRes.success) {
        error.value = 'Failed to load some dashboard data'
      }
    } catch (err) {
      error.value = 'Failed to load dashboard data'
    } finally {
      isLoading.value = false
    }
  }

  const refresh = () => {
    fetchDashboardData()
  }

  onMounted(() => {
    fetchDashboardData()
  })

  return {
    accounts,
    transactions,
    topics,
    totalBalance,
    recentTransactions,
    activeTopics,
    accountsCount,
    topicsCount,
    isLoading,
    error,
    refresh,
  }
}
