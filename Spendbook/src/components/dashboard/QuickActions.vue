<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const quickActions = [
  {
    title: 'Pay In',
    icon: '💵',
    description: 'Add money to account',
    action: () => router.push('/transactions?type=pay-in'),
    color: 'btn-success',
  },
  {
    title: 'Pay Out',
    icon: '💸',
    description: 'Withdraw from account',
    action: () => router.push('/transactions?type=pay-out'),
    color: 'btn-error',
  },
  {
    title: 'View Accounts',
    icon: '🏦',
    description: 'Manage your accounts',
    action: () => router.push('/accounts'),
    color: 'btn-info',
  },
  {
    title: 'Track Topics',
    icon: '🎯',
    description: 'Manage payment goals',
    action: () => router.push('/topics'),
    color: 'btn-warning',
  },
]
</script>

<template>
  <div class="card bg-base-100 shadow-lg">
    <div class="card-body">
      <h2 class="card-title">Quick Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <button
          v-for="action in quickActions"
          :key="action.title"
          @click="action.action"
          class="btn btn-lg flex-col h-auto py-6 gap-2"
          :class="action.color"
        >
          <span class="text-3xl">{{ action.icon }}</span>
          <span class="font-bold">{{ action.title }}</span>
          <span class="text-xs opacity-80">{{ action.description }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
