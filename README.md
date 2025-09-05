# 工程监督平台 MVP

一个基于静态前端 + Flask 后端的工程监督平台最小可行产品。

## 功能特性

- **仪表盘**: 显示系统统计数据（供应商总数、高风险企业、进行中招标、合规率）
- **规则检测**: 企业风险评估和合规性检查
- **AI问答**: 智能问答系统，支持多轮对话

## 技术栈

- **前端**: 原生 HTML/CSS/JavaScript
- **后端**: Flask + Python
- **AI服务**: MaxKB
- **数据源**: 天眼查（当前为假数据）

## 快速开始

### 1. 安装依赖

```bash
cd backend
pip install -r requirements.txt
```

### 2. 配置环境变量

在 `backend` 目录下创建 `.env` 文件：

```env
# 服务器配置
PORT=8000

# MaxKB配置
MAXKB_BASE_URL=http://localhost:8080
MAXKB_API_KEY=your_maxkb_api_key_here

# 天眼查配置（暂未使用，为后续扩展预留）
TIANYANCHA_BASE=https://api.tianyancha.com
TIANYANCHA_KEY=your_tianyancha_api_key_here
```

### 3. 启动后端服务

```bash
cd backend
python app.py
```

后端服务将在 `http://localhost:8000` 启动。

### 4. 访问前端页面

直接在浏览器中打开 `frontend` 目录下的 HTML 文件：

- `index.html` - 仪表盘
- `detect.html` - 规则检测
- `qna.html` - AI问答

## API 接口

### GET /api/stats
返回系统统计数据

### POST /api/ask
AI问答接口
- 请求体: `{"query": "问题", "conversation_id": "对话ID"}`
- 响应: `{"answer": "回答", "conversation_id": "对话ID"}`

### POST /api/detect
企业风险检测接口
- 请求体: `{"company": "企业名称"}`
- 响应: `{"company": "企业名称", "conclusion": "风险等级", "explanation": "分析说明", "evidence": "证据信息", "conversation_id": "对话ID"}`

## 项目结构

```
├── backend/
│   ├── app.py              # Flask 主应用
│   ├── providers/
│   │   ├── maxkb.py        # MaxKB 服务提供者
│   │   └── tianyancha.py   # 天眼查服务提供者（假数据）
│   ├── requirements.txt    # Python 依赖
│   └── .env               # 环境变量配置
├── frontend/
│   ├── index.html         # 仪表盘页面
│   ├── detect.html        # 规则检测页面
│   ├── qna.html          # AI问答页面
│   ├── app.js            # 前端 JavaScript
│   └── style.css         # 样式文件
└── README.md             # 项目说明
```

## 开发说明

- 当前天眼查数据为假数据，后续可替换为真实 API 调用
- 前端使用原生 JavaScript，无构建工具依赖
- 支持 CORS，前后端可分离部署
- 所有密钥配置在环境变量中，确保安全性

## 后续扩展

1. 集成真实的天眼查 API
2. 添加用户认证和权限管理
3. 实现数据持久化存储
4. 增加更多检测规则和分析维度
5. 优化 UI/UX 设计
