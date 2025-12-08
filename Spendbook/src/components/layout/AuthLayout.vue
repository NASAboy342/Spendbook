<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const title = computed(() => {
  return route.name === 'Login' ? 'Login' : 'Create Account'
})
</script>

<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
    <div class="card w-full max-w-md bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="text-center mb-6">
          <h1 class="text-4xl font-bold mb-2">💰 Spendbook</h1>
          <h2 class="text-2xl font-semibold">{{ title }}</h2>
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>
