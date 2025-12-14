<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTransactions } from '@/composables/useTransactions'
import AppLayout from '@/components/layout/AppLayout.vue'
import TransactionList from '@/components/transactions/TransactionList.vue'
import TransactionForm from '@/components/transactions/TransactionForm.vue'
import TransactionFilters from '@/components/transactions/TransactionFilters.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import SuccessMessage from '@/components/common/SuccessMessage.vue'
import { getTransactionType } from '@/types'

const route = useRoute()
const {
  transactions,
  accounts,
  topics,
  isLoading,
  isSubmitting,
  error,
  createTransaction,
  fetchTransactions,
  getAccountById,
  getTopicById,
  clearError,
} = useTransactions()

const showForm = ref(false)
const selectedType = ref<string | null>(null)
const searchQuery = ref('')
const successMessage = ref('')
const transactionFormRef = ref()

// Auto-show form if coming from quick action
if (route.query.type) {
  showForm.value = true
}

const filteredTransactions = computed(() => {
  let filtered = transactions.value

  // Filter by type
  if (selectedType.value) {
    filtered = filtered.filter(t => getTransactionType(t.amount) === selectedType.value)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(t =>
      t.remarks?.toLowerCase().includes(query) ||
      getAccountById(t.accountId)?.name.toLowerCase().includes(query) ||
      (t.trackingTopicId && getTopicById(t.trackingTopicId)?.topic.toLowerCase().includes(query))
    )
  }

  return filtered
})

const getAccountName = (id: number) => {
  return getAccountById(id)?.name || 'Unknown Account'
}

const getTopicName = (id: number) => {
  return getTopicById(id)?.topic || 'Unknown Topic'
}

const handleCreateTransaction = async (data: any) => {
  clearError()
  successMessage.value = ''

  const success = await createTransaction(data)
   successMessage.value = error.value || '';
  if (success) {
    successMessage.value = 'Transaction created successfully!'
    showForm.value = false
    transactionFormRef.value?.resetForm()
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  }
}

const handleTypeChange = (type: string | null) => {
  selectedType.value = type
}

const handleSearch = (query: string) => {
  searchQuery.value = query
}

const toggleForm = () => {
  showForm.value = !showForm.value
  if (!showForm.value) {
    transactionFormRef.value?.resetForm()
    clearError()
  }
}
</script>

<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold">Transactions</h1>
        <button
          @click="toggleForm"
          class="btn btn-primary"
        >
          {{ showForm ? '✕ Cancel' : '➕ New Transaction' }}
        </button>
      </div>

      <!-- Success Message -->
      <SuccessMessage v-if="successMessage" :message="successMessage" />

      <!-- Error Message -->
      <ErrorMessage v-if="error && !showForm" :message="error" />

      <!-- Transaction Form -->
      <TransactionForm
        v-if="showForm"
        ref="transactionFormRef"
        :accounts="accounts"
        :topics="topics"
        :is-submitting="isSubmitting"
        @submit="handleCreateTransaction"
        @cancel="toggleForm"
      />

      <!-- Filters -->
      <TransactionFilters
        :accounts-count="accounts.length"
        :topics-count="topics.length"
        @type-change="handleTypeChange"
        @search="handleSearch"
      />

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>

      <!-- Transactions List -->
      <div v-else>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">
            {{ filteredTransactions.length }} Transaction{{ filteredTransactions.length !== 1 ? 's' : '' }}
          </h2>
          <button
            @click="fetchTransactions()"
            class="btn btn-ghost btn-sm"
          >
            🔄 Refresh
          </button>
        </div>

        <TransactionList
          :transactions="filteredTransactions"
          :get-account-name="getAccountName"
          :get-topic-name="getTopicName"
        />
      </div>
    </div>
  </AppLayout>
</template>
