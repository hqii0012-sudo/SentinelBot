# 部署说明

## 前端部署到 GitHub Pages

1. 将 `frontend/` 目录下的所有文件推送到 GitHub 仓库
2. 在 GitHub 仓库设置中启用 GitHub Pages
3. 选择 `main` 分支的 `frontend/` 文件夹作为源

## 后端部署到 Render

1. 将整个项目推送到 GitHub 仓库
2. 在 Render 上创建新的 Web Service
3. 连接 GitHub 仓库
4. 设置配置：
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app --bind 0.0.0.0:$PORT --workers 2`

## 配置 API 地址

部署完成后，需要修改前端的 API 地址：

1. 打开 `frontend/app.js` 文件
2. 找到第4行的 `API_BASE` 常量
3. 将 `https://your-app.onrender.com` 替换为您的实际 Render 后端地址
4. 重新部署前端

## 验证部署

1. 访问前端地址，检查页面是否正常加载
2. 访问 `https://your-backend-url.onrender.com/health`，应该返回 `{"status":"ok"}`
3. 在前端页面测试API调用功能

## 注意事项

- 确保 Render 后端已成功部署并运行
- 前端和后端都需要支持 CORS
- 如果遇到跨域问题，检查后端的 CORS 配置
