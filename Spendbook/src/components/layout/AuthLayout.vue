<script setup lang="ts">
// Layout for authentication pages (login, register)
</script>

<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center">
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title justify-center text-2xl mb-4">
          💰 Spendbook
        </h2>
        <slot />
      </div>
    </div>
  </div>
</template>
