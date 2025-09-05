import os
import requests
from typing import Optional, Dict, Any

def ask_maxkb(query: str, conversation_id: Optional[str] = None, variables: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    调用MaxKB API进行问答
    
    Args:
        query: 用户查询
        conversation_id: 对话ID，用于多轮对话
        variables: 额外变量
    
    Returns:
        包含answer、conversation_id和raw的字典
    """
    # 从环境变量读取配置
    base_url = os.getenv('MAXKB_BASE_URL')
    api_key = os.getenv('MAXKB_API_KEY')
    
    if not base_url or not api_key:
        raise ValueError("MAXKB_BASE_URL 和 MAXKB_API_KEY 环境变量必须设置")
    
    # 构建请求URL
    url = f"{base_url.rstrip('/')}/conversation"
    
    # 请求头
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    
    # 请求体
    payload = {
        'query': query,
        'conversation_id': conversation_id,
        'user_id': 'web_user',
        'stream': False,
        'variables': variables or {}
    }
    
    try:
        # 发送请求，设置30秒超时
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        
        # 解析响应
        result = response.json()
        
        # 提取答案和对话ID
        answer = result.get('answer', '')
        returned_conversation_id = result.get('conversation_id', conversation_id)
        
        return {
            'answer': answer,
            'conversation_id': returned_conversation_id,
            'raw': result
        }
        
    except requests.exceptions.RequestException as e:
        raise Exception(f"MaxKB API调用失败: {str(e)}")
    except Exception as e:
        raise Exception(f"处理MaxKB响应时出错: {str(e)}")
