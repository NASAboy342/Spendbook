<script setup lang="ts">
interface Props {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Confirm',
  cancelText: 'Cancel',
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <dialog class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg">{{ title }}</h3>
      <p class="py-4">{{ message }}</p>
      <div class="modal-action">
        <button @click="emit('cancel')" class="btn">{{ cancelText }}</button>
        <button @click="emit('confirm')" class="btn btn-primary">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </dialog>
</template>
