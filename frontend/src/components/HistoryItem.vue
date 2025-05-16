<template>
  <div class="history-item" @click="$emit('select')">
    <div class="history-meta">
      <span class="history-time">{{ formattedDate }}</span>
    </div>
    <div class="history-question">{{ item.question }}</div>
    <div class="history-answer-preview">{{ truncatedAnswer }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

defineEmits(['select'])

const formattedDate = computed(() => {
  const date = new Date(props.item.created_at)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
})

const truncatedAnswer = computed(() => {
  const maxLength = 50
  if (props.item.answer.length <= maxLength) return props.item.answer
  return props.item.answer.substring(0, maxLength) + '...'
})
</script>

<style scoped>
.history-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;
}

.history-item:hover {
  background-color: #f0f0f0;
}

.history-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 0.8em;
  color: #666;
}

.history-question {
  font-weight: bold;
  margin-bottom: 5px;
}

.history-answer-preview {
  color: #666;
  font-size: 0.9em;
}
</style>