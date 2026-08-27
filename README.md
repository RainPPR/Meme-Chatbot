# Meme Chatbot

一个外观极简、功能完整的极简现代 AI Chat Assistant 对话 Web 应用，内置经典 AI 作梗响应引擎与逼真的打字机流式输出动效。

## 🌟 项目特点

- **沉浸式 AI 对话界面**：采用类似主流现代大模型产品的清爽设计，支持暗色 / 亮色主题切换。
- **作梗响应引擎与流式打字动效**：
  - 无论用户提问任何内容，均随机从预设的经典梗回复列表中抽取回答。
  - 拟真展示「思考中...」动画（随机 0.5s ～ 1.5s 延迟）。
  - **极速流式打字动效**：思考完成后，以每 20ms～30ms 吐出 2～3 个字符的高频节奏进行平滑流式输出，纯粹模拟大模型 Token 生成流，无多余人类停顿；打字过程附带光标闪烁提示，并支持随时点击停止生成。
  - 动态日期计算：对未成年人实名失效提示，自动获取用户本地日期并计算 `>= 8 天` 后的第一个周五进行精准替换。
  - **零外置 AI 依赖**：纯前端算法驱动，移除了 `@google/genai` 等多余 SDK，体积轻巧且无 API 费用或网络依赖。
- **多会话管理与本地持久化**：
  - 支持创建新对话、快速切换会话、重命名会话标题、删除会话、清空所有记录。
  - 会话数据保存在用户浏览器 `localStorage` 中，刷新与关闭页面不丢失。
  - 支持将对话记录导出为 Markdown 文件。
- **静态导出与 GitHub Pages 兼容**：
  - 支持 Next.js 纯静态 SSG 导出（Pure Static HTML）。
  - 包含 `package-lock.json` 与 `.github/workflows/deploy.yml` 官方工作流，直接 `git push` 到 GitHub 仓库即可由 GitHub Actions 自动构建并发布到 GitHub Pages。
  - 同时完全兼容 Google AI Studio / Cloud Run 容器运行环境。

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动本地开发服务器
npm run dev
```

浏览器访问 `http://localhost:3000` 即可开始使用。

### 生产构建与静态导出

```bash
# 静态 HTML 导出 (输出到 out/ 目录)
OUTPUT_EXPORT=true npm run build
```

## 🚢 部署到 GitHub Pages

项目已在 `.github/workflows/deploy.yml` 配置了全自动部署流水线：

1. 在 GitHub 仓库设置中的 **Settings -> Pages** 页面：
   - **Source** 选择 **GitHub Actions**。
2. 提交并将代码推送（`git push`）至 `main` 或 `master` 分支。
3. GitHub Actions 将自动执行依赖缓存、静态编译并部署到 GitHub Pages。

## 📁 目录结构

- `app/` - Next.js 15 App Router 页面与布局
- `components/` - 聊天视图、输入框、侧边栏、头部等组件
- `lib/` - 响应池逻辑 (`responses.ts`) 与 本地会话管理 (`chat-store.ts`)
- `docs/` - 详细设计与技术说明文档
- `.github/workflows/` - GitHub Pages 自动构建与部署工作流
