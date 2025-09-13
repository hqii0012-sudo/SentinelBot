# MaxKB浮窗嵌入配置说明

## 🚀 **MaxKB嵌入代码集成完成**

你的工程监督平台现在已经集成了MaxKB的嵌入代码，包括：
1. **浮窗模式** - 在主页右下角显示悬浮按钮
2. **全屏模式** - 在AI问答页面显示完整的聊天界面

## ⚙️ **配置说明**

### 1. MaxKB浮窗嵌入代码已集成

在 `frontend/index.html` 文件中，已经添加了MaxKB的浮窗嵌入代码：

```html
<!-- MaxKB第三方嵌入代码 - 浮窗模式 -->
<script
    async
    defer
    src="http://62.234.162.112:6002/chat/api/embed?protocol=http&host=62.234.162.112:6002&token=ef85a1c2cc251df3">
</script>
```

**这个脚本会自动创建悬浮按钮和聊天窗口，无需额外配置。**

### 2. MaxKB全屏模式已集成（支持桌面端和移动端）

在 `frontend/qna.html` 文件中，已经添加了MaxKB的智能全屏模式嵌入代码：

```html
<!-- MaxKB智能全屏模式嵌入 -->
<iframe
    id="maxkbIframe"
    class="maxkb-iframe"
    frameborder="0"
    allow="microphone"
    onload="hideLoading()">
</iframe>
```

**智能模式切换**：
- **桌面端**：`http://62.234.162.112:6002/chat/ef85a1c2cc251df3`
- **移动端**：`http://62.234.162.112:6002/chat/ef85a1c2cc251df3?mode=mobile`

**当用户点击导航栏的"AI问答"时，会根据设备类型自动选择最适合的MaxKB界面模式。**

### 3. 如何获取MaxKB嵌入代码

1. 登录你的MaxKB管理后台
2. 找到"第三方嵌入"或"嵌入代码"选项
3. 复制提供的iframe代码或URL
4. 将URL替换到上面的配置中

### 3. 常见的MaxKB嵌入URL格式

```javascript
// 格式1: 直接聊天URL
const MAXKB_EMBED_URL = "http://your-maxkb-server:6002/chat/api/your-chat-id";

// 格式2: 带参数的嵌入URL
const MAXKB_EMBED_URL = "http://your-maxkb-server:6002/chat/api/your-chat-id?embed=true";

// 格式3: 完整的iframe嵌入代码
// 如果MaxKB提供的是完整的iframe代码，请提取src属性
```

## 🎯 **功能特性**

### ✅ **已实现的功能**
- **浮窗模式**：MaxKB自动创建悬浮按钮和聊天窗口
- **智能全屏模式**：AI问答页面根据设备类型自动选择最佳界面
  - 桌面端：标准MaxKB聊天界面
  - 移动端：优化的移动端MaxKB界面（`?mode=mobile`）
- **无缝集成**：所有模式都完全由MaxKB处理聊天逻辑
- **智能适配**：自动检测设备类型和屏幕尺寸
- **动态切换**：窗口大小变化时自动重新适配
- **语音支持**：支持语音输入（如果MaxKB配置了语音功能）

### 🔧 **技术实现**
- **浮窗模式**：使用MaxKB的JavaScript嵌入脚本
- **智能全屏模式**：
  - 使用JavaScript检测设备类型（User Agent + 屏幕宽度）
  - 动态设置iframe的src属性
  - 桌面端：标准URL
  - 移动端：URL + `?mode=mobile` 参数
- **响应式适配**：监听窗口大小变化，动态重新加载
- **加载优化**：添加加载提示和错误处理
- **触摸优化**：移动端CSS优化（`-webkit-overflow-scrolling: touch`）
- **完全托管**：所有聊天功能由MaxKB服务器处理

## 🧪 **测试步骤**

1. **启动服务**：
   ```bash
   cd backend
   python app.py
   ```

2. **测试浮窗模式**：
   - 打开 `http://localhost:8000/`
   - 等待页面加载完成
   - MaxKB会自动在右下角创建悬浮按钮
   - 点击按钮可以打开聊天窗口

3. **测试智能全屏模式**：
   - 在主页点击导航栏的"AI问答"
   - 页面会跳转到 `http://localhost:8000/qna`
   - 自动检测设备类型并显示对应的MaxKB界面

4. **测试移动端适配**：
   - 在桌面浏览器中调整窗口宽度到768px以下
   - 或使用浏览器的移动端模拟器
   - 页面会自动切换到移动端模式（URL包含`?mode=mobile`）

5. **验证功能**：
   - 桌面端和移动端都能正常加载对应的MaxKB界面
   - 可以正常进行AI对话
   - 支持语音输入（如果MaxKB配置了语音功能）
   - 窗口大小变化时能自动重新适配

## 🚨 **故障排除**

### 问题1: iframe无法加载
- 检查MaxKB服务是否正常运行
- 确认嵌入URL是否正确
- 检查网络连接

### 问题2: 聊天窗口无法展开
- 检查浏览器控制台是否有JavaScript错误
- 确认悬浮按钮事件绑定正常

### 问题3: 样式显示异常
- 检查CSS样式是否正确加载
- 确认iframe样式设置

## 📝 **注意事项**

1. **跨域问题**：如果遇到跨域问题，需要在MaxKB服务端配置CORS
2. **HTTPS**：如果网站使用HTTPS，MaxKB服务也需要支持HTTPS
3. **移动端适配**：MaxKB嵌入界面会自动适配移动端

## 🔄 **切换回API模式**

如果将来需要切换回API调用模式，可以：

1. 恢复 `frontend/index.html` 中的聊天界面HTML
2. 恢复 `frontend/app.js` 中的消息发送函数
3. 恢复 `frontend/style.css` 中的聊天样式
4. 配置后端API服务

---

**配置完成后，你的AI智能助手将完全由MaxKB提供服务！** 🎉
