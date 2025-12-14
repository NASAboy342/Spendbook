<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { TransactionType, type Account, type Topic } from '@/types'
import { isValidAmount, hasSufficientBalance } from '@/utils/validation'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import SuccessMessage from '@/components/common/SuccessMessage.vue'

interface TransactionData {
  accountId: number
  topicId: number
  type: string
  amount: number
  description: string
}

interface Props {
  accounts: Account[]
  topics: Topic[]
  isSubmitting: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'submit', data: TransactionData): void
  (e: 'cancel'): void
}>()

const route = useRoute()

// Form fields
const accountId = ref(0)
const topicId = ref(0)
const transactionType = ref<string>(TransactionType.PayIn)
const amount = ref<number | ''>('')
const description = ref('')

// State
const validationError = ref('')
const successMessage = ref('')

// Computed
const selectedAccount = computed(() => {
  return props.accounts.find(a => a.id === accountId.value)
})

const activeTopics = computed(() => {
  return props.topics.filter(t => t.statusCode === 0) // Active status
})

const canSubmit = computed(() => {
  return accountId.value && amount.value && description.value && !props.isSubmitting
})

// Initialize from URL params
watch(() => route.query.type, (type) => {
  if (type === 'pay-in' || type === 'pay-out') {
    transactionType.value = type === 'pay-in' ? TransactionType.PayIn : TransactionType.PayOut
  }
}, { immediate: true })

// Validation
const validateForm = (): boolean => {
  validationError.value = ''

  if (!accountId.value) {
    validationError.value = 'Please select an account'
    return false
  }

  if (!amount.value || !isValidAmount(Number(amount.value))) {
    validationError.value = 'Please enter a valid amount greater than 0'
    return false
  }

  if (!description.value.trim()) {
    validationError.value = 'Please enter a description'
    return false
  }

  // Check sufficient balance for pay-out
  if (transactionType.value === TransactionType.PayOut && selectedAccount.value) {
    if (!hasSufficientBalance(selectedAccount.value.balance, Number(amount.value))) {
      validationError.value = `Insufficient balance. Available: $${selectedAccount.value.balance.toFixed(2)}`
      return false
    }
  }

  return true
}

const handleSubmit = () => {
  if (!validateForm()) return

  emit('submit', {
    accountId: accountId.value,
    topicId: topicId.value,
    type: transactionType.value,
    amount: Number(amount.value),
    description: description.value.trim(),
  })
}

const resetForm = () => {
  accountId.value = 0
  topicId.value = 0
  amount.value = ''
  description.value = ''
  validationError.value = ''
  successMessage.value = ''
}

const handleCancel = () => {
  resetForm()
  emit('cancel')
}

defineExpose({ resetForm })
</script>

<template>
  <div class="card bg-base-100 shadow-lg">
    <div class="card-body">
      <h2 class="card-title">New Transaction</h2>

      <ErrorMessage v-if="validationError" :message="validationError" />
      <SuccessMessage v-if="successMessage" :message="successMessage" />

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Transaction Type -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Transaction Type</span>
          </label>
          <div class="flex gap-2">
            <button
              type="button"
              @click="transactionType = TransactionType.PayIn"
              class="btn flex-1"
              :class="transactionType === TransactionType.PayIn ? 'btn-success' : 'btn-outline'"
              :disabled="isSubmitting"
            >
              💵 Pay In
            </button>
            <button
              type="button"
              @click="transactionType = TransactionType.PayOut"
              class="btn flex-1"
              :class="transactionType === TransactionType.PayOut ? 'btn-error' : 'btn-outline'"
              :disabled="isSubmitting"
            >
              💸 Pay Out
            </button>
          </div>
        </div>

        <!-- Account Selection -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Account *</span>
          </label>
          <select
            v-model="accountId"
            class="select select-bordered"
            :disabled="isSubmitting"
            required
          >
            <option value="" disabled>Select an account</option>
            <option v-for="account in accounts" :key="account.id" :value="account.id">
              {{ account.name }} - ${{ account.balance.toFixed(2) }}
            </option>
          </select>
        </div>

        <!-- Topic Selection (Optional) -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Topic (Optional)</span>
          </label>
          <select
            v-model="topicId"
            class="select select-bordered"
            :disabled="isSubmitting"
          >
            <option value="">No topic</option>
            <option v-for="topic in activeTopics" :key="topic.id" :value="topic.id">
              {{ topic.topic }}
            </option>
          </select>
        </div>

        <!-- Amount -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Amount *</span>
          </label>
          <input
            v-model.number="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            class="input input-bordered"
            :disabled="isSubmitting"
            required
          />
          <label v-if="selectedAccount && transactionType === TransactionType.PayOut" class="label">
            <span class="label-text-alt">Available: ${{ selectedAccount.balance.toFixed(2) }}</span>
          </label>
        </div>

        <!-- Description -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Description *</span>
          </label>
          <textarea
            v-model="description"
            placeholder="Enter transaction description"
            class="textarea textarea-bordered"
            rows="3"
            :disabled="isSubmitting"
            required
          ></textarea>
        </div>

        <!-- Actions -->
        <div class="flex gap-2 pt-4">
          <button
            type="submit"
            class="btn btn-primary flex-1"
            :disabled="!canSubmit"
          >
            <LoadingSpinner v-if="isSubmitting" size="sm" />
            <span v-else>Create Transaction</span>
          </button>
          <button
            type="button"
            @click="handleCancel"
            class="btn btn-ghost"
            :disabled="isSubmitting"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
