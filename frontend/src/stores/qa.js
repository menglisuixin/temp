import { defineStore } from "pinia";
import axios from "axios";

// 定义API基础URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const useQAStore = defineStore("qa", {
  state: () => ({
    currentAnswer: "",
    history: [],
    loading: false,
    error: null,
  }),

  actions: {
    // 设置当前回答
    setCurrentAnswer(answer) {
      this.currentAnswer = answer;
    },

    // 清除当前回答
    clearCurrentAnswer() {
      this.currentAnswer = "";
    },

    // 提问并获取回答
    async askQuestion(question) {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post(`${API_BASE_URL}/ask`, { question });
        this.currentAnswer = response.data.answer;

        // 更新历史记录
        await this.fetchHistory();
        return true;
      } catch (error) {
        console.error("提问失败:", error);
        this.error = "提问过程中出现错误，请稍后再试";
        return false;
      } finally {
        this.loading = false;
      }
    },

    // 获取历史记录
    async fetchHistory() {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get(`${API_BASE_URL}/history`);
        this.history = response.data;
      } catch (error) {
        console.error("获取历史记录失败:", error);
        this.error = "获取历史记录失败，请稍后再试";
      } finally {
        this.loading = false;
      }
    },

    // 搜索历史记录
    async searchHistory(query) {
      if (!query) {
        return this.fetchHistory();
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get(`${API_BASE_URL}/history/search`, {
          params: { query },
        });
        this.history = response.data;
      } catch (error) {
        console.error("搜索历史记录失败:", error);
        this.error = "搜索历史记录失败，请稍后再试";
      } finally {
        this.loading = false;
      }
    },
  },
});
