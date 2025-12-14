<script setup lang="ts">
import { computed } from 'vue'
import { formatCurrency } from '@/utils/format'
import { formatDate } from '@/utils/date'
import type { Account } from '@/types'

interface Props {
  accounts: Account[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  edit: [account: Account]
  delete: [account: Account]
}>()

const hasAccounts = computed(() => props.accounts.length > 0)

const getBalanceColor = (balance: number) => {
  if (balance > 1000) return 'text-success'
  if (balance > 0) return 'text-warning'
  return 'text-error'
}
</script>

<template>
  <div class="space-y-4">
    <div v-if="!hasAccounts" class="text-center py-12 text-base-content/60">
      <p class="text-5xl mb-4">🏦</p>
      <p class="text-lg">No accounts found</p>
      <p class="text-sm mt-2">Create your first account to get started</p>
    </div>

    <div
      v-for="account in accounts"
      :key="account.id"
      class="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow"
    >
      <div class="card-body">
        <div class="flex items-center justify-between">
          <!-- Left Side: Account Info -->
          <div class="flex items-center gap-4">
            <div class="text-4xl">🏦</div>
            <div>
              <h3 class="text-xl font-bold">{{ account.name }}</h3>
              <p class="text-sm text-base-content/60">
                Created {{ account.utcCreatedOn ? formatDate(account.utcCreatedOn, 'date') : 'N/A' }}
              </p>
              <p class="text-xs text-base-content/40">
                Updated {{ account.utcModifiedOn ? formatDate(account.utcModifiedOn, 'datetime') : 'N/A' }}
              </p>
            </div>
          </div>

          <!-- Right Side: Balance and Actions -->
          <div class="text-right">
            <div class="mb-3">
              <p class="text-sm text-base-content/60 mb-1">Balance</p>
              <p class="text-3xl font-bold" :class="getBalanceColor(account.balance)">
                {{ formatCurrency(account.balance) }}
              </p>
            </div>
            <div class="flex gap-2 justify-end">
              <button
                @click="emit('edit', account)"
                class="btn btn-sm btn-info"
              >
                ✏️ Edit
              </button>
              <button
                @click="emit('delete', account)"
                class="btn btn-sm btn-error"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
