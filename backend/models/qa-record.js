const mongoose = require("mongoose");

const qaSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "问题不能为空"],
    trim: true,
  },
  answer: {
    type: String,
    required: [true, "回答不能为空"],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// 添加索引以提高查询性能
qaSchema.index({ created_at: -1 });
qaSchema.index({ question: "text", answer: "text" });

module.exports = mongoose.model("QARecord", qaSchema);
