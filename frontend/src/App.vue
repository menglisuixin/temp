<template>
  <div class="app-container">
    <header>
      <h1>AI问答系统</h1>
    </header>

    <main>
      <div class="content-container">
        <div class="qa-section">
          <h2>提问区域</h2>
          <div class="question-input">
            <textarea
              v-model="question"
              placeholder="请输入您的问题..."
              :disabled="qaStore.loading"
            ></textarea>
            <button @click="submitQuestion" :disabled="!question || qaStore.loading">
              {{ qaStore.loading ? '提问中...' : '提交问题' }}
            </button>
          </div>

          <div v-if="qaStore.currentAnswer" class="answer-display">
            <h3>回答结果</h3>
            <div class="answer-content">
              <p>{{ qaStore.currentAnswer }}</p>
            </div>
          </div>

          <div v-if="qaStore.error" class="error-message">
            {{ qaStore.error }}
          </div>
        </div>

        <div class="history-section">
          <h2>历史记录</h2>
          <div class="history-filter">
            <input
              v-model="searchQuery"
              placeholder="搜索历史记录..."
              @input="handleSearch"
            />
          </div>

          <div class="history-list">
            <HistoryItem
              v-for="(item, index) in qaStore.history"
              :key="index"
              :item="item"
              @select="selectHistoryItem(item)"
            />

            <div v-if="qaStore.history.length === 0" class="no-history">
              暂无历史记录
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQAStore } from './stores/qa'
import HistoryItem from './components/HistoryItem.vue'

// 使用Pinia store
const qaStore = useQAStore()

// 本地状态
const question = ref('')
const searchQuery = ref('')
let searchTimeout = null

// 提交问题
const submitQuestion = async () => {
  if (!question.value || qaStore.loading) return

  const success = await qaStore.askQuestion(question.value)

  // 如果成功，清空问题输入
  if (success) {
    question.value = ''
  }
}

// 处理搜索输入
const handleSearch = () => {
  // 防抖处理
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    qaStore.searchHistory(searchQuery.value)
  }, 300)
}

// 选择历史记录项
const selectHistoryItem = (item) => {
  question.value = item.question
  qaStore.setCurrentAnswer(item.answer)
}

// 组件挂载时获取历史记录
onMounted(() => {
  qaStore.fetchHistory()
})
</script>

<style scoped>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

header {
  margin-bottom: 30px;
  text-align: center;
}

.content-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

@media (max-width: 768px) {
  .content-container {
    grid-template-columns: 1fr;
  }
}

.qa-section, .history-section {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.question-input {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

textarea {
  min-height: 120px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  font-family: inherit;
}

button {
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.answer-display {
  margin-top: 20px;
  padding: 15px;
  background-color: #e9f7ef;
  border-radius: 4px;
}

.error-message {
  margin-top: 20px;
  padding: 15px;
  background-color: #ffebee;
  color: #c62828;
  border-radius: 4px;
}

.history-filter {
  margin-bottom: 15px;
}

.history-filter input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.history-list {
  max-height: 500px;
  overflow-y: auto;
}

.no-history {
  text-align: center;
  padding: 20px;
  color: #666;
}
</style>