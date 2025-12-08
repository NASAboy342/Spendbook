// Topic API service
import { apiService } from './api'
import type {
  Topic,
  CreateTopicRequest,
  UpdateTopicRequest,
  ApiResponse,
} from '@/types'

export const topicService = {
  /**
   * Get all topics
   * POST /topics/list
   */
  async getTopics(): Promise<ApiResponse<Topic[]>> {
    return apiService.post<Topic[]>('/topics/list')
  },

  /**
   * Create new topic
   * POST /topics/create
   */
  async createTopic(data: CreateTopicRequest): Promise<ApiResponse<Topic>> {
    return apiService.post<Topic>('/topics/create', data)
  },

  /**
   * Update topic
   * POST /topics/update
   */
  async updateTopic(
    id: string,
    data: UpdateTopicRequest
  ): Promise<ApiResponse<Topic>> {
    return apiService.post<Topic>('/topics/update', { id, ...data })
  },

  /**
   * Delete topic
   * POST /topics/delete
   */
  async deleteTopic(id: string): Promise<ApiResponse<void>> {
    return apiService.post<void>('/topics/delete', { id })
  },
}
