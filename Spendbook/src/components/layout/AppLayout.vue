<script setup lang="ts">
import { useRouter } from 'vue-router'
import { authService } from '@/services/auth'

const router = useRouter()

const handleLogout = () => {
  authService.logout()
  router.push('/login')
}
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
            <button @click="handleLogout" class="btn btn-ghost btn-sm">
              Logout
            </button>
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
