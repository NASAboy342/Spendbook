<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { formatCurrency } from '@/utils/format'
import { formatDate } from '@/utils/date'
import { TransactionType, getTransactionType, type Transaction } from '@/types'

interface Props {
  transactions: Transaction[]
}

const props = defineProps<Props>()
const router = useRouter()

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

const viewAllTransactions = () => {
  router.push('/transactions')
}
</script>

<template>
  <div class="card bg-base-100 shadow-lg">
    <div class="card-body">
      <div class="flex justify-between items-center mb-4">
        <h2 class="card-title">Recent Transactions</h2>
        <button @click="viewAllTransactions" class="btn btn-sm btn-ghost">
          View All →
        </button>
      </div>

      <div v-if="!hasTransactions" class="text-center py-8 text-base-content/60">
        <p class="text-4xl mb-2">📋</p>
        <p>No transactions yet</p>
        <p class="text-sm mt-2">Start by adding a transaction</p>
      </div>

      <div v-else class="space-y-2">
        <div
          v-for="transaction in transactions"
          :key="transaction.id"
          class="flex items-center justify-between p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
        >
          <div class="flex items-center gap-3">
            <span class="text-2xl">{{ getTransactionIcon(transaction.amount) }}</span>
            <div>
              <p class="font-medium">{{ transaction.remarks || 'No description' }}</p>
              <p class="text-sm text-base-content/60">
                {{ formatDate(transaction.timeStamp, 'datetime') }}
              </p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-bold" :class="getTransactionColor(transaction.amount)">
              {{ getAmountDisplay(transaction) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
