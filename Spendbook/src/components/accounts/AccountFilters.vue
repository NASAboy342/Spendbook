<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  searchQuery: string
  totalBalance: number
  accountCount: number
}

defineProps<Props>()
const emit = defineEmits<{
  search: [query: string]
}>()

const localSearchQuery = ref('')

const handleSearch = () => {
  emit('search', localSearchQuery.value)
}

const clearSearch = () => {
  localSearchQuery.value = ''
  emit('search', '')
}
</script>

<template>
  <div class="card bg-base-100 shadow-lg">
    <div class="card-body p-4">
      <div class="flex flex-col md:flex-row gap-4 items-center">
        <!-- Search -->
        <div class="flex-1 w-full">
          <label class="label py-0">
            <span class="label-text font-semibold">Search Accounts</span>
          </label>
          <div class="join w-full">
            <input
              v-model="localSearchQuery"
              type="text"
              placeholder="Search by account name..."
              class="input input-bordered input-sm join-item flex-1"
              @keyup.enter="handleSearch"
            />
            <button
              v-if="localSearchQuery"
              @click="clearSearch"
              class="btn btn-sm join-item"
            >
              ✕
            </button>
            <button
              @click="handleSearch"
              class="btn btn-sm btn-primary join-item"
            >
              🔍
            </button>
          </div>
        </div>

        <!-- Summary Stats -->
        <div class="stats stats-horizontal shadow">
          <div class="stat py-2 px-4">
            <div class="stat-title text-xs">Total Balance</div>
            <div class="stat-value text-xl">${{ totalBalance.toFixed(2) }}</div>
          </div>
          <div class="stat py-2 px-4">
            <div class="stat-title text-xs">Accounts</div>
            <div class="stat-value text-xl">{{ accountCount }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
