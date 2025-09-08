/**
 * 通用的API调用封装
 * @param {string} path - API路径
 * @param {object} body - 请求体数据
 * @returns {Promise<object>} 返回JSON响应或错误信息
 */
async function api(path, body) {
    try {
        const response = await fetch(path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body || {})
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API调用失败:', error);
        return { error: error.message };
    }
}

/**
 * GET请求封装
 * @param {string} path - API路径
 * @returns {Promise<object>} 返回JSON响应或错误信息
 */
async function apiGet(path) {
    try {
        const response = await fetch(path);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API调用失败:', error);
        return { error: error.message };
    }
}

// 导出到全局作用域，供页面使用
window.api = api;
window.apiGet = apiGet;

// MaxKB浮窗模式 - 不需要自定义的悬浮按钮逻辑
// MaxKB会自动创建和管理悬浮按钮和聊天窗口

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成，MaxKB浮窗模式已启用');
    
    // 可以在这里添加其他页面初始化逻辑
    // MaxKB的浮窗会自动加载，无需手动初始化
});
