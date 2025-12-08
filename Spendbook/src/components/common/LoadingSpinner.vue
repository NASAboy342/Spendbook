<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const sizeClass = computed(() => {
  const sizes = {
    sm: 'loading-sm',
    md: 'loading-md',
    lg: 'loading-lg',
  }
  return sizes[props.size]
})
</script>

<template>
  <div class="flex justify-center items-center">
    <span class="loading loading-spinner" :class="sizeClass"></span>
  </div>
</template>
