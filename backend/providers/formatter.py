import re
from typing import Dict, Any

def format_ai_response(response: str) -> str:
    """
    格式化AI回答，将原始回答转换为结构化的Markdown格式
    
    Args:
        response: AI的原始回答文本
    
    Returns:
        格式化后的Markdown文本
    """
    if not response or not response.strip():
        return response
    
    # 清理文本
    text = response.strip()
    
    # 如果已经是Markdown格式，直接返回
    if _is_markdown_formatted(text):
        return text
    
    # 格式化文本
    formatted = _format_text_structure(text)
    
    return formatted

def _is_markdown_formatted(text: str) -> bool:
    """检查文本是否已经是Markdown格式"""
    markdown_indicators = [
        r'^#{1,6}\s',  # 标题
        r'\*\*.*?\*\*',  # 粗体
        r'^\s*[-*+]\s',  # 列表
        r'^\s*\d+\.\s',  # 有序列表
        r'```',  # 代码块
        r'`.*?`',  # 行内代码
    ]
    
    for pattern in markdown_indicators:
        if re.search(pattern, text, re.MULTILINE):
            return True
    
    return False

def _format_text_structure(text: str) -> str:
    """格式化文本结构"""
    lines = text.split('\n')
    formatted_lines = []
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        if not line:
            formatted_lines.append('')
            i += 1
            continue
        
        # 检测标题模式
        if _is_title_line(line):
            formatted_lines.append(f"## {line}")
        
        # 检测列表模式
        elif _is_list_line(line):
            formatted_lines.append(f"- {line}")
        
        # 检测问答模式
        elif _is_qa_line(line):
            formatted_lines.append(f"**{line}**")
        
        # 检测要点模式
        elif _is_key_point_line(line):
            formatted_lines.append(f"**{line}**")
        
        # 检测段落模式
        else:
            # 检查是否是长段落，如果是则尝试分段
            if len(line) > 100:
                # 尝试在句号、问号、感叹号后分段
                sentences = re.split(r'([.!?。！？])\s*', line)
                if len(sentences) > 2:
                    formatted_sentences = []
                    for j in range(0, len(sentences), 2):
                        if j + 1 < len(sentences):
                            sentence = sentences[j] + sentences[j + 1]
                            if sentence.strip():
                                formatted_sentences.append(sentence.strip())
                        else:
                            if sentences[j].strip():
                                formatted_sentences.append(sentences[j].strip())
                    
                    formatted_lines.extend(formatted_sentences)
                else:
                    formatted_lines.append(line)
            else:
                formatted_lines.append(line)
        
        i += 1
    
    # 后处理：添加适当的空行
    result = []
    for i, line in enumerate(formatted_lines):
        result.append(line)
        
        # 在标题后添加空行
        if line.startswith('##'):
            if i + 1 < len(formatted_lines) and formatted_lines[i + 1].strip():
                result.append('')
        
        # 在列表后添加空行
        elif line.startswith('-') and i + 1 < len(formatted_lines):
            if not formatted_lines[i + 1].startswith('-') and formatted_lines[i + 1].strip():
                result.append('')
    
    return '\n'.join(result)

def _is_title_line(line: str) -> bool:
    """检测是否是标题行"""
    title_patterns = [
        r'^[一二三四五六七八九十\d]+[、.]',  # 数字标题
        r'^[A-Za-z][^。！？]*[：:]$',  # 冒号结尾的标题
        r'^[^。！？]*[：:]$',  # 中文冒号结尾
        r'^[^。！？]{2,20}$',  # 短标题（2-20字符）
    ]
    
    for pattern in title_patterns:
        if re.match(pattern, line):
            return True
    
    return False

def _is_list_line(line: str) -> bool:
    """检测是否是列表行"""
    list_patterns = [
        r'^[一二三四五六七八九十\d]+[、.]',  # 数字列表
        r'^[•·▪▫]\s',  # 特殊符号列表
        r'^[A-Za-z][、.]',  # 字母列表
        r'^[^。！？]{1,50}[：:]$',  # 短描述后跟冒号
    ]
    
    for pattern in list_patterns:
        if re.match(pattern, line):
            return True
    
    return False

def _is_qa_line(line: str) -> bool:
    """检测是否是问答行"""
    qa_patterns = [
        r'^[Qq]：',  # Q:
        r'^[Aa]：',  # A:
        r'^问：',  # 问:
        r'^答：',  # 答:
        r'^问题：',  # 问题:
        r'^回答：',  # 回答:
    ]
    
    for pattern in qa_patterns:
        if re.match(pattern, line):
            return True
    
    return False

def _is_key_point_line(line: str) -> bool:
    """检测是否是关键点行"""
    key_point_patterns = [
        r'^[^。！？]{1,30}[：:]$',  # 短描述后跟冒号
        r'^[^。！？]{1,20}$',  # 短关键点
    ]
    
    for pattern in key_point_patterns:
        if re.match(pattern, line):
            return True
    
    return False

def add_response_enhancements(text: str) -> str:
    """为回答添加增强元素"""
    if not text:
        return text
    
    # 添加结尾表情符号
    if not text.endswith(('✅', '📌', '🛠️', '💡', '🎯', '🚀')):
        # 根据内容类型添加合适的表情符号
        if '问题' in text or '疑问' in text:
            text += ' 💡'
        elif '建议' in text or '推荐' in text:
            text += ' 📌'
        elif '方法' in text or '步骤' in text:
            text += ' 🛠️'
        elif '重要' in text or '注意' in text:
            text += ' ⚠️'
        else:
            text += ' ✅'
    
    return text
