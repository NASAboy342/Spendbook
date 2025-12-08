<script setup lang="ts">
import { ref } from 'vue'
import { TransactionType } from '@/types'

interface Props {
  accountsCount: number
  topicsCount: number
}

defineProps<Props>()

const emit = defineEmits<{
  typeChange: [type: string | null]
  accountChange: [accountId: string | null]
  search: [query: string]
}>()

const selectedType = ref<string | null>(null)
const searchQuery = ref('')

const handleTypeFilter = (type: string | null) => {
  selectedType.value = type
  emit('typeChange', type)
}

const handleSearch = () => {
  emit('search', searchQuery.value)
}

const clearSearch = () => {
  searchQuery.value = ''
  emit('search', '')
}
</script>

<template>
  <div class="card bg-base-100 shadow-lg">
    <div class="card-body p-4">
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Type Filter -->
        <div class="flex-1">
          <label class="label py-0">
            <span class="label-text font-semibold">Filter by Type</span>
          </label>
          <div class="btn-group w-full">
            <button
              @click="handleTypeFilter(null)"
              class="btn btn-sm flex-1"
              :class="selectedType === null ? 'btn-active' : ''"
            >
              All
            </button>
            <button
              @click="handleTypeFilter(TransactionType.PayIn)"
              class="btn btn-sm flex-1"
              :class="selectedType === TransactionType.PayIn ? 'btn-active btn-success' : ''"
            >
              💵 Pay In
            </button>
            <button
              @click="handleTypeFilter(TransactionType.PayOut)"
              class="btn btn-sm flex-1"
              :class="selectedType === TransactionType.PayOut ? 'btn-active btn-error' : ''"
            >
              💸 Pay Out
            </button>
          </div>
        </div>

        <!-- Search -->
        <div class="flex-1">
          <label class="label py-0">
            <span class="label-text font-semibold">Search</span>
          </label>
          <div class="join w-full">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search description..."
              class="input input-bordered input-sm join-item flex-1"
              @keyup.enter="handleSearch"
            />
            <button
              v-if="searchQuery"
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
      </div>

      <!-- Summary Stats -->
      <div class="stats stats-horizontal shadow mt-4 w-full">
        <div class="stat py-2 px-4">
          <div class="stat-title text-xs">Accounts</div>
          <div class="stat-value text-2xl">{{ accountsCount }}</div>
        </div>
        <div class="stat py-2 px-4">
          <div class="stat-title text-xs">Topics</div>
          <div class="stat-value text-2xl">{{ topicsCount }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
