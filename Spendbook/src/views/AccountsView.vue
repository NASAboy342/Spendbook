<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAccounts } from '@/composables/useAccounts'
import AppLayout from '@/components/layout/AppLayout.vue'
import AccountList from '@/components/accounts/AccountList.vue'
import AccountFormModal from '@/components/accounts/AccountFormModal.vue'
import AccountFilters from '@/components/accounts/AccountFilters.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import SuccessMessage from '@/components/common/SuccessMessage.vue'
import type { Account } from '@/types'

const {
  accounts,
  totalBalance,
  isLoading,
  isSubmitting,
  error,
  createAccount,
  updateAccount,
  deleteAccount,
  fetchAccounts,
  clearError,
} = useAccounts()

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteDialog = ref(false)
const editingAccount = ref<Account | null>(null)
const deletingAccount = ref<Account | null>(null)
const searchQuery = ref('')
const successMessage = ref('')
const accountFormRef = ref()

const filteredAccounts = computed(() => {
  if (!searchQuery.value.trim()) {
    return accounts.value
  }

  const query = searchQuery.value.toLowerCase()
  return accounts.value.filter(account =>
    account.name.toLowerCase().includes(query)
  )
})

const handleSearch = (query: string) => {
  searchQuery.value = query
}

const openCreateModal = () => {
  clearError()
  successMessage.value = ''
  showCreateModal.value = true
}

const openEditModal = (account: Account) => {
  clearError()
  successMessage.value = ''
  editingAccount.value = account
  showEditModal.value = true
}

const openDeleteDialog = (account: Account) => {
  clearError()
  successMessage.value = ''
  deletingAccount.value = account
  showDeleteDialog.value = true
}

const handleCreateAccount = async (data: any) => {
  const success = await createAccount(data)
  if (success) {
    successMessage.value = 'Account created successfully!'
    showCreateModal.value = false
    accountFormRef.value?.resetForm()
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  }
}

const handleUpdateAccount = async (data: any) => {
  if (!editingAccount.value) return

  const success = await updateAccount(editingAccount.value.id, data)
  if (success) {
    successMessage.value = 'Account updated successfully!'
    showEditModal.value = false
    editingAccount.value = null
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  }
}

const handleDeleteAccount = async () => {
  if (!deletingAccount.value) return

  const success = await deleteAccount(deletingAccount.value.id)
  if (success) {
    successMessage.value = 'Account deleted successfully!'
    showDeleteDialog.value = false
    deletingAccount.value = null
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  }
}

const cancelCreate = () => {
  showCreateModal.value = false
  accountFormRef.value?.resetForm()
  clearError()
}

const cancelEdit = () => {
  showEditModal.value = false
  editingAccount.value = null
  clearError()
}

const cancelDelete = () => {
  showDeleteDialog.value = false
  deletingAccount.value = null
  clearError()
}
</script>

<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold">Accounts</h1>
        <button
          @click="openCreateModal"
          class="btn btn-primary"
        >
          ➕ New Account
        </button>
      </div>

      <!-- Success Message -->
      <SuccessMessage v-if="successMessage" :message="successMessage" />

      <!-- Error Message -->
      <ErrorMessage v-if="error" :message="error" />

      <!-- Filters -->
      <AccountFilters
        :search-query="searchQuery"
        :total-balance="totalBalance"
        :account-count="accounts.length"
        @search="handleSearch"
      />

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>

      <!-- Accounts List -->
      <div v-else>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">
            {{ filteredAccounts.length }} Account{{ filteredAccounts.length !== 1 ? 's' : '' }}
          </h2>
          <button
            @click="fetchAccounts"
            class="btn btn-ghost btn-sm"
          >
            🔄 Refresh
          </button>
        </div>

        <AccountList
          :accounts="filteredAccounts"
          @edit="openEditModal"
          @delete="openDeleteDialog"
        />
      </div>

      <!-- Create Account Modal -->
      <AccountFormModal
        v-if="showCreateModal"
        ref="accountFormRef"
        mode="create"
        :is-submitting="isSubmitting"
        @submit="handleCreateAccount"
        @cancel="cancelCreate"
      />

      <!-- Edit Account Modal -->
      <AccountFormModal
        v-if="showEditModal && editingAccount"
        mode="edit"
        :initial-data="{ name: editingAccount.name }"
        :is-submitting="isSubmitting"
        @submit="handleUpdateAccount"
        @cancel="cancelEdit"
      />

      <!-- Delete Confirmation Dialog -->
      <ConfirmDialog
        v-if="showDeleteDialog && deletingAccount"
        title="Delete Account"
        :message="`Are you sure you want to delete '${deletingAccount.name}'? This action cannot be undone.`"
        confirm-text="Delete"
        cancel-text="Cancel"
        @confirm="handleDeleteAccount"
        @cancel="cancelDelete"
      />
    </div>
  </AppLayout>
</template>
