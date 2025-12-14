// Authentication composable
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/auth'
import type { User, LoginRequest, RegisterRequest, ApiResponse } from '@/types'

const currentUser = ref<User | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

export function useAuth() {
  const router = useRouter()

  const isAuthenticated = computed(() => !!currentUser.value)

  const login = async (credentials: LoginRequest) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await authService.login(credentials);
      
      if (response.errorCode === 0 && response.data) {
        const user: User = {
          username: response.data.username || credentials.username,
          utcCreateOn: response.data.utcCreateOn || new Date().toISOString()
        }
        currentUser.value = user
        authService.setToken(credentials.username) // Use username as token
        localStorage.setItem('user', JSON.stringify(user))
        router.push('/')
      } else {
        error.value = response.errorMessage || 'Login failed'
      }
    } catch (err) {
      error.value = 'An unexpected error occurred'
    } finally {
      isLoading.value = false
    }
  }

  const register = async (data: RegisterRequest) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await authService.register(data)
      
      if (response.errorCode === 0 && response.data) {
        const user: User = {
          username: response.data.username || data.username,
          utcCreateOn: response.data.utcCreateOn || new Date().toISOString()
        }
        currentUser.value = user
        authService.setToken(data.username) // Use username as token
        localStorage.setItem('user', JSON.stringify(user))
        router.push('/')
      } else {
        error.value = response.errorMessage || 'Registration failed'
      }
    } catch (err) {
      error.value = 'An unexpected error occurred'
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    authService.logout()
    currentUser.value = null
    localStorage.removeItem('user')
    router.push('/login')
  }

  const initAuth = () => {
    const storedUser = localStorage.getItem('user')
    const token = authService.getToken()
    
    if (storedUser && token) {
      try {
        currentUser.value = JSON.parse(storedUser)
      } catch {
        // Invalid stored data, clear it
        authService.logout()
        localStorage.removeItem('user')
      }
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    currentUser,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    initAuth,
    clearError,
  }
}
