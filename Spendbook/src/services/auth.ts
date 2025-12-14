// Authentication API service
import { apiService } from './api'
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ApiResponse,
} from '@/types'

export const authService = {
  /**
   * User login
   * POST /api/spendbook/login
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return apiService.post<AuthResponse>('/api/spendbook/login', credentials)
  },

  /**
   * User registration
   * POST /api/spendbook/create-user
   */
  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return apiService.post<AuthResponse>('/api/spendbook/create-user', data)
  },

  /**
   * User logout (client-side token removal)
   */
  logout(): void {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  },

  /**
   * Store authentication token
   */
  setToken(token: string): void {
    localStorage.setItem('auth_token', token)
  },

  /**
   * Get stored authentication token
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token')
  },

  /**
   * Get current username
   */
  getUsername(): string | null {
    return this.getToken() // Token is username
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken()
  },
}
