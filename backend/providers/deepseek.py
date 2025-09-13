import os
import requests
import json
from typing import Optional, Dict, Any
from .formatter import format_ai_response, add_response_enhancements

def ask_deepseek(query: str, conversation_id: Optional[str] = None, variables: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    调用火山引擎Ark平台的DeepSeek模型进行问答
    
    Args:
        query: 用户查询
        conversation_id: 对话ID，用于多轮对话（暂不支持，但保留接口兼容性）
        variables: 额外变量（暂不支持，但保留接口兼容性）
    
    Returns:
        包含answer、conversation_id和raw的字典
    """
    # 从环境变量读取配置
    api_key = os.getenv('ARK_API_KEY')
    model_name = os.getenv('ARK_MODEL', 'deepseek-r1-250528')
    
    if not api_key:
        raise ValueError("ARK_API_KEY 环境变量必须设置")
    
    # 火山引擎Ark API端点
    url = "https://ark.cn-beijing.volces.com/api/v3/chat/completions"
    
    # 请求头
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    
    # 构建消息历史（如果有conversation_id，可以在这里添加历史消息）
    messages = [
        {
            "role": "system",
            "content": "你是一个专业的工程监督平台AI助手，名字是纪廉2号，专门帮助用户解答工程监督、合规管理、风险控制等相关问题。请用专业、准确、友好的语言回答用户的问题。"
        },
        {
            "role": "user",
            "content": query
        }
    ]
    
    # 请求体
    payload = {
        "model": model_name,
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 2000,
        "stream": False
    }
    
    try:
        # 发送请求，设置30秒超时
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        
        # 解析响应
        result = response.json()
        
        # 提取答案
        answer = ""
        if 'choices' in result and len(result['choices']) > 0:
            raw_answer = result['choices'][0]['message']['content']
            # 格式化回答
            answer = format_ai_response(raw_answer)
            # 添加增强元素
            answer = add_response_enhancements(answer)
        else:
            raise Exception("API响应格式异常：未找到choices字段或choices为空")
        
        # 如果没有提供conversation_id，生成一个简单的ID
        if not conversation_id:
            conversation_id = f"ark_{hash(query) % 1000000}"
        
        return {
            'answer': answer,
            'conversation_id': conversation_id,
            'raw': result
        }
        
    except requests.exceptions.RequestException as e:
        raise Exception(f"火山引擎Ark API调用失败: {str(e)}")
    except json.JSONDecodeError as e:
        raise Exception(f"解析Ark API响应JSON失败: {str(e)}")
    except Exception as e:
        raise Exception(f"处理Ark响应时出错: {str(e)}")
