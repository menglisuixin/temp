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

qaSchema.index({ created_at: -1 });
qaSchema.index({ question: "text", answer: "text" });

module.exports = mongoose.model("QARecord", qaSchema);
