<script setup lang="ts">
import { useDashboard } from '@/composables/useDashboard'
import AppLayout from '@/components/layout/AppLayout.vue'
import BalanceCard from '@/components/dashboard/BalanceCard.vue'
import QuickActions from '@/components/dashboard/QuickActions.vue'
import RecentTransactions from '@/components/dashboard/RecentTransactions.vue'
import ActiveTopics from '@/components/dashboard/ActiveTopics.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

const {
  totalBalance,
  recentTransactions,
  activeTopics,
  accountsCount,
  topicsCount,
  isLoading,
  error,
  refresh,
} = useDashboard()
</script>

<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h1 class="text-3xl font-bold">Dashboard</h1>
        <button
          @click="refresh"
          class="btn btn-ghost btn-sm"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">🔄 Refresh</span>
          <LoadingSpinner v-else size="sm" />
        </button>
      </div>

      <!-- Error Message -->
      <ErrorMessage v-if="error" :message="error" />

      <!-- Loading State -->
      <div v-if="isLoading && !error" class="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>

      <!-- Dashboard Content -->
      <div v-else class="space-y-6">
        <!-- Balance & Stats Row -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BalanceCard
            title="Total Balance"
            :value="totalBalance"
            icon="💰"
          />
          <StatCard
            :count="accountsCount"
            label="Accounts"
            icon="🏦"
          />
          <StatCard
            :count="topicsCount"
            label="Active Topics"
            icon="🎯"
          />
        </div>

        <!-- Quick Actions -->
        <QuickActions />

        <!-- Recent Activity Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Recent Transactions -->
          <RecentTransactions :transactions="recentTransactions" />

          <!-- Active Topics -->
          <ActiveTopics :topics="activeTopics" />
        </div>
      </div>
    </div>
  </AppLayout>
</template>
