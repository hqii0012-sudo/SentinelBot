from flask import Flask, request, jsonify, send_from_directory, render_template_string
from flask_cors import CORS
from dotenv import load_dotenv
import os
from providers.maxkb import ask_maxkb
from providers.tianyancha import company_basic

# 加载环境变量
load_dotenv()

app = Flask(__name__)
CORS(app)

# 静态文件目录
FRONTEND_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'frontend')

@app.route('/')
def index():
    """返回首页"""
    return send_from_directory(FRONTEND_DIR, 'index.html')

@app.route('/detect')
def detect_page():
    """返回检测页面"""
    return send_from_directory(FRONTEND_DIR, 'detect.html')

@app.route('/qna')
def qna_page():
    """返回问答页面"""
    return send_from_directory(FRONTEND_DIR, 'qna.html')

@app.route('/kinship')
def kinship_page():
    """返回关系梳理页面"""
    return send_from_directory(FRONTEND_DIR, 'kinship.html')

@app.route('/<path:filename>')
def static_files(filename):
    """提供静态文件服务"""
    return send_from_directory(FRONTEND_DIR, filename)

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """返回首页统计数据"""
    return jsonify({
        "supplier_total": 2458,
        "high_risk": 18,
        "tenders_running": 42,
        "compliance_rate": 0.942
    })

@app.route('/api/ask', methods=['POST'])
def ask():
    """AI问答接口"""
    try:
        data = request.get_json()
        if not data or not data.get('query'):
            return jsonify({"error": "query字段不能为空"}), 400
        
        query = data['query']
        conversation_id = data.get('conversation_id')
        
        result = ask_maxkb(query, conversation_id)
        return jsonify({
            "answer": result["answer"],
            "conversation_id": result["conversation_id"]
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 502

@app.route('/api/detect', methods=['POST'])
def detect():
    """规则检测接口"""
    try:
        data = request.get_json()
        if not data or not data.get('company'):
            return jsonify({"error": "company字段不能为空"}), 400
        
        company = data['company']
        
        # 获取公司基本信息
        company_info = company_basic(company)
        
        # 构建检测prompt
        prompt = f"""
        请分析以下公司信息，给出风险评估结论：
        
        公司名称：{company_info['company']}
        法人代表：{company_info['legalPersonName']}
        经营状态：{company_info['regStatus']}
        股东信息：{company_info['shareholders']}
        
        请从工程监督角度分析该公司的风险等级和依据。
        """
        
        # 调用MaxKB生成分析
        result = ask_maxkb(prompt)
        
        return jsonify({
            "company": company,
            "conclusion": "中风险",  # 先固定，后续可从result中解析
            "explanation": result["answer"],
            "evidence": company_info['shareholders'],
            "conversation_id": result["conversation_id"]
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 502

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=True)
