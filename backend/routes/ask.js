const express = require("express");
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");
const QARecord = require("../models/qa-record");

// 配置 OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  basePath: "http://localhost:3000/openai", // 修改为代理地址
});
const openai = new OpenAIApi(configuration);

// 获取LLM回答
async function getLLMResponse(question) {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "你是一个能回答问题的助手。" },
      { role: "user", content: question },
    ],
  });
  return response.data.choices[0].message.content;
}

// 提问接口
router.post("/", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ success: false, error: "问题不能为空" });
    }
    // 获取回答
    const answer = await getLLMResponse(question);
    // 保存到数据库
    const qaRecord = new QARecord({
      question,
      answer,
      created_at: new Date(),
    });
    await qaRecord.save();
    res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error("提问处理错误:", error);
    res.status(500).json({
      success: false,
      error: "服务器内部错误",
    });
  }
});

module.exports = router;
