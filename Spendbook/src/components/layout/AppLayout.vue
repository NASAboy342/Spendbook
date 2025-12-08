<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { logout, currentUser } = useAuth()

const displayName = computed(() => {
  return currentUser.value?.username || 'User'
})
</script>

<template>
  <div class="min-h-screen bg-base-200">
    <!-- Navbar -->
    <div class="navbar bg-base-100 shadow-lg">
      <div class="flex-1">
        <router-link to="/" class="btn btn-ghost text-xl">
          💰 Spendbook
        </router-link>
      </div>
      <div class="flex-none">
        <ul class="menu menu-horizontal px-1">
          <li>
            <router-link to="/" active-class="active">Dashboard</router-link>
          </li>
          <li>
            <router-link to="/transactions" active-class="active">Transactions</router-link>
          </li>
          <li>
            <router-link to="/accounts" active-class="active">Accounts</router-link>
          </li>
          <li>
            <router-link to="/topics" active-class="active">Topics</router-link>
          </li>
          <li>
            <router-link to="/reports" active-class="active">Reports</router-link>
          </li>
          <li>
            <div class="dropdown dropdown-end">
              <div tabindex="0" role="button" class="btn btn-ghost">
                <span>{{ displayName }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-4 h-4 stroke-current ml-1">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><button @click="logout">Logout</button></li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Main Content -->
    <main class="container mx-auto p-4">
      <slot />
    </main>
  </div>
</template>
