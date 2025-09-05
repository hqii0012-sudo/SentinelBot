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
