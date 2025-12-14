// Topic API service
import { apiService } from './api'
import type {
  Topic,
  CreateTopicRequest,
  UpdateTopicRequest,
  ApiResponse,
  GetTopicResponse,
} from '@/types'

export const topicService = {
  /**
   * Get all topics
   * POST /api/spendbook/get-tracking-topic
   */
  async getTopics(username: string): Promise<ApiResponse<GetTopicResponse>> {
    const response = await apiService.post<GetTopicResponse>('/api/spendbook/get-tracking-topic', { username })
    return response
  },

  /**
   * Create new topic
   * POST /api/spendbook/create-tracking-topic
   */
  async createTopic(username: string, data: CreateTopicRequest): Promise<ApiResponse<Topic>> {
    return apiService.post<Topic>('/api/spendbook/create-tracking-topic', {
      username,
      topicName: data.name,
      utcTargetDate: data.targetDate,
      targetAmount: data.targetAmount,
      currency: 'USD'
    })
  },

  /**
   * Update topic
   * POST /api/spendbook/update-tracking-topic
   */
  async updateTopic(
    username: string,
    trackingTopicId: number,
    data: UpdateTopicRequest
  ): Promise<ApiResponse<Topic>> {
    return apiService.post<Topic>('/api/spendbook/update-tracking-topic', {
      username,
      trackingTopicId,
      newName: data.name,
      newStatus: data.status
    })
  },

  /**
   * Delete topic - not supported, use update status instead
   */
  async deleteTopic(username: string, trackingTopicId: number): Promise<ApiResponse<void>> {
    // Delete is done by setting status to Cancelled (3)
    return apiService.post<void>('/api/spendbook/update-tracking-topic', {
      username,
      trackingTopicId,
      newStatus: 3 // Cancelled
    })
  },
}
