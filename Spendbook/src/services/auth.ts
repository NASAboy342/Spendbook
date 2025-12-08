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
   * POST /auth/login
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return apiService.post<AuthResponse>('/auth/login', credentials)
  },

  /**
   * User registration
   * POST /auth/register
   */
  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return apiService.post<AuthResponse>('/auth/register', data)
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
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken()
  },
}
