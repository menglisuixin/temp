const express = require("express");
const router = express.Router();
const QARecord = require("../models/qa-record");

// 获取历史记录接口
router.get("/", async (req, res) => {
  try {
    const history = await QARecord.find()
      .sort({ created_at: -1 })
      .select("question answer created_at");

    res.status(200).json(history);
  } catch (error) {
    console.error("获取历史记录错误:", error);
    res.status(500).json({
      success: false,
      error: "服务器内部错误",
    });
  }
});

// 搜索历史记录
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: "搜索关键词不能为空",
      });
    }

    const history = await QARecord.find({
      $or: [
        { question: { $regex: query, $options: "i" } },
        { answer: { $regex: query, $options: "i" } },
      ],
    })
      .sort({ created_at: -1 })
      .select("question answer created_at");

    res.status(200).json(history);
  } catch (error) {
    console.error("搜索历史记录错误:", error);
    res.status(500).json({
      success: false,
      error: "服务器内部错误",
    });
  }
});

module.exports = router;
