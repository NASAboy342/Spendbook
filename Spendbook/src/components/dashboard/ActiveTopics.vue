<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Topic } from '@/types'

interface Props {
  topics: Topic[]
}

const props = defineProps<Props>()
const router = useRouter()

const hasTopics = computed(() => props.topics.length > 0)

const getProgress = (topic: Topic) => {
  if (topic.targetAmount === 0) return 0
  return Math.min((topic.currentAmount / topic.targetAmount) * 100, 100)
}

const getProgressColor = (progress: number) => {
  if (progress >= 80) return 'progress-success'
  if (progress >= 50) return 'progress-warning'
  return 'progress-info'
}

const viewAllTopics = () => {
  router.push('/topics')
}
</script>

<template>
  <div class="card bg-base-100 shadow-lg">
    <div class="card-body">
      <div class="flex justify-between items-center mb-4">
        <h2 class="card-title">Active Topics</h2>
        <button @click="viewAllTopics" class="btn btn-sm btn-ghost">
          View All →
        </button>
      </div>

      <div v-if="!hasTopics" class="text-center py-8 text-base-content/60">
        <p class="text-4xl mb-2">🎯</p>
        <p>No active topics</p>
        <p class="text-sm mt-2">Create a topic to track payment goals</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="topic in topics.slice(0, 3)"
          :key="topic.id"
          class="p-3 bg-base-200 rounded-lg"
        >
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-medium">{{ topic.name }}</h3>
            <span class="text-sm text-base-content/60">
              {{ Math.round(getProgress(topic)) }}%
            </span>
          </div>
          <progress
            class="progress w-full"
            :class="getProgressColor(getProgress(topic))"
            :value="getProgress(topic)"
            max="100"
          ></progress>
          <div class="flex justify-between text-sm text-base-content/60 mt-2">
            <span>${{ topic.currentAmount.toFixed(2) }}</span>
            <span>${{ topic.targetAmount.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
