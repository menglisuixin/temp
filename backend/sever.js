const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// 加载环境变量
dotenv.config();

// 连接数据库
connectDB();

const app = express();

app.use(
  "/openai",
  createProxyMiddleware({
    target: "https://api.openai.com",
    changeOrigin: true,
    pathRewrite: { "^/openai": "" },
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
  })
);
// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use("/api/ask", require("./routes/ask"));
app.use("/api/history", require("./routes/history"));

// 端口设置
const PORT = process.env.PORT || 3000;

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
