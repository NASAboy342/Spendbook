// API service for HTTP requests
import axios, { type AxiosInstance, type AxiosError } from 'axios'
import type { ApiError, ApiResponse } from '@/types'

class ApiService {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'https://apini.ppiinn.net',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor to add auth token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error))
      }
    )
  }

  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      // Server responded with error status
      return {
        message: (error.response.data as any)?.message || 'Server error occurred',
        code: error.response.status.toString(),
      }
    } else if (error.request) {
      // Request made but no response
      return {
        message: 'No response from server',
        code: 'NETWORK_ERROR',
      }
    } else {
      // Error setting up request
      return {
        message: error.message || 'Request failed',
        code: 'REQUEST_ERROR',
      }
    }
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post(endpoint, data)
      return response.data
    } catch (error) {
      console.log('API POST error:', error)
      return {
        errorCode: 1,
        errorMessage: (this.handleError(error as AxiosError)).message,
      }
    }
  }
  async get<T>(endpoint: string, params?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get(endpoint, { params })
      console.log('API GET response:', response.data)
      // API returns: { data: {...}, errorCode: 0, errorMessage: null }
      return response.data
    } catch (error) {
      console.log('API GET error:', error)
      return {
        errorCode: 1,
        errorMessage: (this.handleError(error as AxiosError)).message,
      }
    }
  } 
}

export const apiService = new ApiService()
