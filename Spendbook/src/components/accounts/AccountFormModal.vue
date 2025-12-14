<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { isValidAmount } from '@/utils/validation'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

interface Props {
  isSubmitting: boolean
  mode?: 'create' | 'edit'
  initialData?: {
    name: string
    initialBalance?: number
  }
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create',
})

const emit = defineEmits<{
  submit: [data: { name: string; initialBalance?: number }]
  cancel: []
}>()

const name = ref('')
const initialBalance = ref<number | ''>('')
const validationError = ref('')

// Initialize form with existing data when editing
watch(() => props.initialData, (data) => {
  if (data) {
    name.value = data.name
    initialBalance.value = data.initialBalance || ''
  }
}, { immediate: true })

const canSubmit = computed(() => {
  return name.value.trim() && !props.isSubmitting
})

const isCreateMode = computed(() => props.mode === 'create')

const validateForm = (): boolean => {
  validationError.value = ''

  if (!name.value.trim()) {
    validationError.value = 'Account name is required'
    return false
  }

  if (name.value.trim().length < 2) {
    validationError.value = 'Account name must be at least 2 characters'
    return false
  }

  if (isCreateMode.value && initialBalance.value !== '' && !isValidAmount(Number(initialBalance.value))) {
    validationError.value = 'Initial balance must be greater than or equal to 0'
    return false
  }

  return true
}

const handleSubmit = () => {
  if (!validateForm()) return

  const data: any = {
    name: name.value.trim(),
  }

  if (isCreateMode.value) {
    data.initialBalance = initialBalance.value ? Number(initialBalance.value) : 0
  }

  emit('submit', data)
}

const handleCancel = () => {
  name.value = ''
  initialBalance.value = ''
  validationError.value = ''
  emit('cancel')
}

const resetForm = () => {
  name.value = ''
  initialBalance.value = ''
  validationError.value = ''
}

defineExpose({ resetForm })
</script>

<template>
  <dialog class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">
        {{ isCreateMode ? '➕ Create Account' : '✏️ Edit Account' }}
      </h3>

      <ErrorMessage v-if="validationError" :message="validationError" />

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Account Name -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Account Name *</span>
          </label>
          <input
            v-model="name"
            type="text"
            placeholder="e.g., Main Checking, Savings"
            class="input input-bordered"
            :disabled="isSubmitting"
            required
          />
        </div>

        <!-- Initial Balance (only for create mode) -->
        <div v-if="isCreateMode" class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Initial Balance</span>
          </label>
          <input
            v-model.number="initialBalance"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            class="input input-bordered"
            :disabled="isSubmitting"
          />
          <label class="label">
            <span class="label-text-alt">Leave empty for $0.00</span>
          </label>
        </div>

        <!-- Actions -->
        <div class="modal-action">
          <button
            type="button"
            @click="handleCancel"
            class="btn btn-ghost"
            :disabled="isSubmitting"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="!canSubmit"
          >
            <LoadingSpinner v-if="isSubmitting" size="sm" />
            <span v-else>{{ isCreateMode ? 'Create' : 'Save' }}</span>
          </button>
        </div>
      </form>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="handleCancel" :disabled="isSubmitting">close</button>
    </form>
  </dialog>
</template>
