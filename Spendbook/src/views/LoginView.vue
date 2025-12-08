<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { isValidUsername, isValidPassword } from '@/utils/validation'
import AuthLayout from '@/components/layout/AuthLayout.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const router = useRouter()
const { login, isLoading, error, clearError } = useAuth()

const username = ref('')
const password = ref('')
const validationError = ref('')

const handleSubmit = async () => {
  validationError.value = ''
  clearError()

  // Client-side validation
  if (!username.value || !password.value) {
    validationError.value = 'Username and password are required'
    return
  }

  if (!isValidUsername(username.value)) {
    validationError.value = 'Invalid username format (3-20 alphanumeric characters)'
    return
  }

  if (!isValidPassword(password.value)) {
    validationError.value = 'Password must be at least 8 characters'
    return
  }

  await login({
    username: username.value,
    password: password.value,
  })
}

const goToRegister = () => {
  router.push('/register')
}

onMounted(() => {
  clearError()
})
</script>

<template>
  <AuthLayout>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <ErrorMessage v-if="validationError" :message="validationError" />
      <ErrorMessage v-if="error" :message="error" />

      <div class="form-control">
        <label class="label">
          <span class="label-text">Username</span>
        </label>
        <input
          v-model="username"
          type="text"
          placeholder="Enter username"
          class="input input-bordered"
          :disabled="isLoading"
          required
        />
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Password</span>
        </label>
        <input
          v-model="password"
          type="password"
          placeholder="Enter password"
          class="input input-bordered"
          :disabled="isLoading"
          required
        />
      </div>

      <div class="form-control mt-6">
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="isLoading"
        >
          <LoadingSpinner v-if="isLoading" size="sm" />
          <span v-else>Login</span>
        </button>
      </div>

      <div class="divider">OR</div>

      <div class="form-control">
        <button
          type="button"
          @click="goToRegister"
          class="btn btn-outline"
          :disabled="isLoading"
        >
          Create Account
        </button>
      </div>
    </form>
  </AuthLayout>
</template>
