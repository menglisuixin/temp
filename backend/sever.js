const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// 加载环境变量
dotenv.config();

// 连接数据库
connectDB();

// 创建Express应用
const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use("/api/ask", require("./routes/ask"));
app.use("/api/history", require("./routes/history"));

// 健康检查路由
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// 端口设置
const PORT = process.env.PORT || 3000;

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
