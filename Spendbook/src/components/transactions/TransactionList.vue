<script setup lang="ts">
import { computed } from 'vue'
import { formatCurrency } from '@/utils/format'
import { formatDate } from '@/utils/date'
import { TransactionType, getTransactionType, type Transaction } from '@/types'

interface Props {
  transactions: Transaction[]
  getAccountName?: (id: number) => string
  getTopicName?: (id: number) => string
}

const props = withDefaults(defineProps<Props>(), {
  getAccountName: () => 'Unknown Account',
  getTopicName: () => 'Unknown Topic',
})

const hasTransactions = computed(() => props.transactions.length > 0)

const getTransactionIcon = (amount: number) => {
  return getTransactionType(amount) === TransactionType.PayIn ? '💵' : '💸'
}

const getTransactionColor = (amount: number) => {
  return getTransactionType(amount) === TransactionType.PayIn ? 'text-success' : 'text-error'
}

const getAmountDisplay = (transaction: Transaction) => {
  const formatted = formatCurrency(Math.abs(transaction.amount))
  return transaction.amount >= 0 ? `+${formatted}` : `-${formatted}`
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
            <span class="text-3xl">{{ getTransactionIcon(transaction.amount) }}</span>
            <div>
              <h3 class="font-bold text-lg">{{ transaction.remarks || 'No description' }}</h3>
              <div class="text-sm text-base-content/60 space-y-1">
                <p>Account: {{ getAccountName(transaction.accountId) }}</p>
                <p v-if="transaction.trackingTopicId">
                  Topic: {{ getTopicName(transaction.trackingTopicId) }}
                </p>
                <p>{{ formatDate(transaction.timeStamp, 'datetime') }}</p>
              </div>
            </div>
          </div>

          <!-- Right Side: Amount -->
          <div class="text-right">
            <p class="text-2xl font-bold" :class="getTransactionColor(transaction.amount)">
              {{ getAmountDisplay(transaction) }}
            </p>
            <div class="badge badge-sm mt-2" :class="getTransactionType(transaction.amount) === TransactionType.PayIn ? 'badge-success' : 'badge-error'">
              {{ getTransactionType(transaction.amount) === TransactionType.PayIn ? 'Pay In' : 'Pay Out' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
