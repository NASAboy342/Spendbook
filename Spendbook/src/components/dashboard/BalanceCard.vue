<script setup lang="ts">
import { computed } from 'vue'
import { formatCurrency } from '@/utils/format'

interface Props {
  title: string
  value: number
  icon?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: '💰',
  trend: 'neutral',
})

const formattedValue = computed(() => formatCurrency(props.value))

const trendColor = computed(() => {
  if (props.trend === 'up') return 'text-success'
  if (props.trend === 'down') return 'text-error'
  return 'text-base-content'
})
</script>

<template>
  <div class="stat bg-base-100 shadow-lg rounded-lg">
    <div class="stat-figure text-4xl">
      {{ icon }}
    </div>
    <div class="stat-title">{{ title }}</div>
    <div class="stat-value text-2xl lg:text-3xl">{{ formattedValue }}</div>
    <div v-if="trendValue" class="stat-desc" :class="trendColor">
      {{ trendValue }}
    </div>
  </div>
</template>
