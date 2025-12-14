// Dashboard composable - manages dashboard data and state
import { ref, computed, onMounted } from 'vue'
import { accountService } from '@/services/account'
import { topicService } from '@/services/topic'
import { authService } from '@/services/auth'
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
      .sort((a, b) => new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime())
      .slice(0, 5)
  })

  const activeTopics = computed(() => {
    return topics.value.filter(topic => topic.statusCode === 0) // Active status
  })

  const accountsCount = computed(() => accounts.value.length)

  const topicsCount = computed(() => activeTopics.value.length)

  const fetchDashboardData = async () => {
    isLoading.value = true
    error.value = null

    try {
      const username = authService.getUsername()
      if (!username) {
        error.value = 'Not authenticated'
        return
      }

      // Fetch accounts first to get account IDs
      const accountsRes = await accountService.getAccounts(username)
      if (accountsRes.errorCode === 0 && accountsRes.data) {
        accounts.value = accountsRes.data.accounts;
      }

      // Fetch topics
      const topicsRes = await topicService.getTopics(username)
      if (topicsRes.errorCode === 0 && topicsRes.data) {
        topics.value = topicsRes.data.topics;
      }

      // For dashboard, we'll show empty transactions since API requires specific account and date range
      // Components can fetch specific transactions as needed
      transactions.value = []

      if (accountsRes.errorCode !== 0 || topicsRes.errorCode !== 0) {
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
