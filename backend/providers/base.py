from abc import ABC, abstractmethod
from typing import Optional, Dict, Any

class AIProvider(ABC):
    """AI提供商基类"""
    
    @abstractmethod
    def ask(self, query: str, conversation_id: Optional[str] = None, variables: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        调用AI API进行问答
        
        Args:
            query: 用户查询
            conversation_id: 对话ID，用于多轮对话
            variables: 额外变量
        
        Returns:
            包含answer、conversation_id和raw的字典
        """
        pass

class DeepSeekProvider(AIProvider):
    """DeepSeek AI提供商"""
    
    def ask(self, query: str, conversation_id: Optional[str] = None, variables: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        from .deepseek import ask_deepseek
        return ask_deepseek(query, conversation_id, variables)

class MaxKBProvider(AIProvider):
    """MaxKB AI提供商"""
    
    def ask(self, query: str, conversation_id: Optional[str] = None, variables: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        from .maxkb import ask_maxkb
        return ask_maxkb(query, conversation_id, variables)

def get_ai_provider(provider_name: str = None) -> AIProvider:
    """
    获取AI提供商实例
    
    Args:
        provider_name: 提供商名称 ('deepseek' 或 'maxkb')
    
    Returns:
        AI提供商实例
    """
    import os
    
    # 从环境变量读取默认提供商，如果没有则使用maxkb
    if not provider_name:
        provider_name = os.getenv('AI_PROVIDER', 'maxkb')
    
    if provider_name.lower() == 'deepseek':
        return DeepSeekProvider()
    elif provider_name.lower() == 'maxkb':
        return MaxKBProvider()
    else:
        raise ValueError(f"不支持的AI提供商: {provider_name}")
