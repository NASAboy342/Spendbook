<script setup lang="ts">
import { computed } from 'vue'
import { formatCurrency } from '@/utils/format'
import { formatDate } from '@/utils/date'
import { TransactionType, type Transaction } from '@/types'

interface Props {
  transactions: Transaction[]
  getAccountName?: (id: string) => string
  getTopicName?: (id: string) => string
}

const props = withDefaults(defineProps<Props>(), {
  getAccountName: () => 'Unknown Account',
  getTopicName: () => 'Unknown Topic',
})

const hasTransactions = computed(() => props.transactions.length > 0)

const getTransactionIcon = (type: string) => {
  return type === TransactionType.PayIn ? '💵' : '💸'
}

const getTransactionColor = (type: string) => {
  return type === TransactionType.PayIn ? 'text-success' : 'text-error'
}

const getAmountDisplay = (transaction: Transaction) => {
  const formatted = formatCurrency(transaction.amount)
  return transaction.type === TransactionType.PayIn ? `+${formatted}` : `-${formatted}`
}
</script>

<template>
  <div class="space-y-3">
    <div v-if="!hasTransactions" class="text-center py-12 text-base-content/60">
      <p class="text-5xl mb-4">📋</p>
      <p class="text-lg">No transactions found</p>
      <p class="text-sm mt-2">Create your first transaction to get started</p>
    </div>

    <div
      v-for="transaction in transactions"
      :key="transaction.id"
      class="card bg-base-100 shadow hover:shadow-lg transition-shadow"
    >
      <div class="card-body p-4">
        <div class="flex items-center justify-between">
          <!-- Left Side: Icon and Details -->
          <div class="flex items-center gap-4">
            <span class="text-3xl">{{ getTransactionIcon(transaction.type) }}</span>
            <div>
              <h3 class="font-bold text-lg">{{ transaction.description }}</h3>
              <div class="text-sm text-base-content/60 space-y-1">
                <p>Account: {{ getAccountName(transaction.accountId) }}</p>
                <p v-if="transaction.topicId">
                  Topic: {{ getTopicName(transaction.topicId) }}
                </p>
                <p>{{ formatDate(transaction.timestamp, 'datetime') }}</p>
              </div>
            </div>
          </div>

          <!-- Right Side: Amount -->
          <div class="text-right">
            <p class="text-2xl font-bold" :class="getTransactionColor(transaction.type)">
              {{ getAmountDisplay(transaction) }}
            </p>
            <div class="badge badge-sm mt-2" :class="transaction.type === TransactionType.PayIn ? 'badge-success' : 'badge-error'">
              {{ transaction.type === TransactionType.PayIn ? 'Pay In' : 'Pay Out' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
