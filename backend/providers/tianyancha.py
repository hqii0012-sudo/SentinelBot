# TODO: 后续把此函数替换为真实的天眼查 API 调用，从环境变量 TIANYANCHA_BASE、TIANYANCHA_KEY 读取配置

def company_basic(name: str) -> dict:
    """
    获取公司基本信息（当前为假数据版本）
    
    Args:
        name: 公司名称
    
    Returns:
        包含公司基本信息的字典
    """
    # 模拟不同公司的假数据
    fake_data = {
        "ok": True,
        "company": name,
        "legalPersonName": "张某某",
        "regStatus": "在业",
        "shareholders": [
            {"name": "张三", "ratio": 0.25},
            {"name": "某投资公司", "ratio": 0.75}
        ]
    }
    
    # 根据公司名称返回不同的假数据
    if "科技" in name:
        fake_data.update({
            "legalPersonName": "李科技",
            "shareholders": [
                {"name": "李科技", "ratio": 0.60},
                {"name": "创新投资", "ratio": 0.40}
            ]
        })
    elif "建筑" in name:
        fake_data.update({
            "legalPersonName": "王建筑",
            "shareholders": [
                {"name": "王建筑", "ratio": 0.80},
                {"name": "建设集团", "ratio": 0.20}
            ]
        })
    elif "工程" in name:
        fake_data.update({
            "legalPersonName": "赵工程",
            "regStatus": "存续",
            "shareholders": [
                {"name": "赵工程", "ratio": 0.45},
                {"name": "工程控股", "ratio": 0.35},
                {"name": "其他股东", "ratio": 0.20}
            ]
        })
    
    return fake_data
