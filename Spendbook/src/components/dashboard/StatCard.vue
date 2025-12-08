<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  count: number
  label: string
  icon: string
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'bg-primary',
})

const displayCount = computed(() => {
  return props.count.toString().padStart(2, '0')
})
</script>

<template>
  <div class="card bg-base-100 shadow-lg">
    <div class="card-body items-center text-center">
      <div class="text-5xl mb-2">{{ icon }}</div>
      <div class="text-4xl font-bold">{{ displayCount }}</div>
      <div class="text-sm text-base-content/60">{{ label }}</div>
    </div>
  </div>
</template>
