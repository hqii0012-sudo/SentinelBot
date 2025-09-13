// 设计/变更追溯页面交互逻辑

// 占位数据
const mockData = {
    changes: [
        {
            id: 'CHG-2024-001',
            project: '项目A',
            section: '标段1',
            name: '混凝土强度等级调整',
            proposer: '设计院A',
            reason: '地质条件变化',
            amount: '¥120,000',
            status: 'approved',
            statusText: '已审批',
            lastUpdate: '2024-01-15',
            riskLevel: 'medium',
            rules: ['short-term-multiple', 'price-increase']
        },
        {
            id: 'CHG-2024-002',
            project: '项目B',
            section: '标段2',
            name: '钢结构材料变更',
            proposer: '供应商B',
            reason: '材料供应问题',
            amount: '¥280,000',
            status: 'executing',
            statusText: '执行中',
            lastUpdate: '2024-01-18',
            riskLevel: 'high',
            rules: ['same-supplier', 'price-increase']
        },
        {
            id: 'CHG-2024-003',
            project: '项目A',
            section: '标段3',
            name: '电气系统优化',
            proposer: '设计院A',
            reason: '技术升级',
            amount: '¥85,000',
            status: 'pending',
            statusText: '待审批',
            lastUpdate: '2024-01-20',
            riskLevel: 'low',
            rules: ['design-change']
        },
        {
            id: 'CHG-2024-004',
            project: '项目C',
            section: '标段1',
            name: '防水材料升级',
            proposer: '供应商C',
            reason: '质量要求提高',
            amount: '¥150,000',
            status: 'completed',
            statusText: '已完成',
            lastUpdate: '2024-01-22',
            riskLevel: 'medium',
            rules: ['same-supplier']
        },
        {
            id: 'CHG-2024-005',
            project: '项目B',
            section: '标段3',
            name: '管道规格调整',
            proposer: '设计院B',
            reason: '设计优化',
            amount: '¥95,000',
            status: 'rejected',
            statusText: '已拒绝',
            lastUpdate: '2024-01-25',
            riskLevel: 'low',
            rules: ['design-change']
        },
        {
            id: 'CHG-2024-006',
            project: '项目A',
            section: '标段2',
            name: '设备型号变更',
            proposer: '供应商A',
            reason: '设备停产',
            amount: '¥320,000',
            status: 'approved',
            statusText: '已审批',
            lastUpdate: '2024-01-28',
            riskLevel: 'high',
            rules: ['short-term-multiple', 'same-supplier', 'price-increase']
        }
    ],
    
    timeline: [
        {
            stage: '发起申请',
            handler: '张三',
            time: '2024-01-10 09:30',
            note: '提交变更申请，包含详细技术说明',
            status: 'completed'
        },
        {
            stage: '技术会签',
            handler: '李四',
            time: '2024-01-12 14:20',
            note: '技术部门会签通过，建议批准',
            status: 'completed'
        },
        {
            stage: '财务审核',
            handler: '王五',
            time: '2024-01-14 16:45',
            note: '财务审核通过，预算充足',
            status: 'completed'
        },
        {
            stage: '领导审批',
            handler: '赵六',
            time: '2024-01-15 10:15',
            note: '领导审批通过，同意执行',
            status: 'completed'
        },
        {
            stage: '执行实施',
            handler: '孙七',
            time: '2024-01-16 08:00',
            note: '开始执行变更，预计工期15天',
            status: 'current'
        },
        {
            stage: '结算验收',
            handler: '周八',
            time: '预计 2024-01-31',
            note: '待执行完成后进行结算验收',
            status: 'pending'
        }
    ],
    
    amounts: {
        original: '¥5,000,000',
        changes: '¥1,050,000',
        final: '¥6,050,000',
        ratio: '21%'
    },
    
    evidences: [
        {
            field: '设计文件',
            source: '设计院A',
            summary: '原设计图纸V1.2，变更后图纸V1.3',
            link: '查看文件'
        },
        {
            field: '合同条款',
            source: '合同管理系统',
            summary: '第3.2条材料规格变更记录',
            link: '查看条款'
        },
        {
            field: '审批记录',
            source: 'OA系统',
            summary: '审批流程完整，各环节签字确认',
            link: '查看记录'
        },
        {
            field: '现场照片',
            source: '现场监理',
            summary: '变更前后现场对比照片',
            link: '查看照片'
        }
    ],
    
    stats: {
        totalChanges: 24,
        abnormalChanges: 8,
        totalAmount: '¥2.8M',
        highRiskRatio: '33%'
    }
};

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    bindEvents();
    renderTable();
    renderEvidence();
    updateStats();
});

// 初始化页面
function initializePage() {
    console.log('设计/变更追溯页面初始化');
}

// 绑定事件
function bindEvents() {
    // 搜索功能
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);
    
    // 筛选功能
    const projectFilter = document.getElementById('projectFilter');
    const severityFilter = document.getElementById('severityFilter');
    projectFilter.addEventListener('change', handleFilter);
    severityFilter.addEventListener('change', handleFilter);
    
    // 规则筛选
    const ruleCheckboxes = document.querySelectorAll('.rule-checkbox');
    ruleCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleRuleFilter);
    });
    
    // 表格行点击
    document.addEventListener('click', function(e) {
        const row = e.target.closest('tbody tr');
        if (row) {
            const changeId = row.dataset.changeId;
            if (changeId) {
                openDrawer(changeId);
            }
        }
    });
    
    // 键盘事件
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeDrawer();
        }
    });
}

// 渲染表格
function renderTable(data = mockData.changes) {
    const tbody = document.getElementById('changesTableBody');
    tbody.innerHTML = '';
    
    data.forEach(change => {
        const row = document.createElement('tr');
        row.dataset.changeId = change.id;
        row.innerHTML = `
            <td>${change.id}</td>
            <td>${change.project}</td>
            <td>${change.section}</td>
            <td>${change.name}</td>
            <td>${change.proposer}</td>
            <td>${change.amount}</td>
            <td><span class="status-badge ${change.status}">${change.statusText}</span></td>
            <td>${change.lastUpdate}</td>
        `;
        tbody.appendChild(row);
    });
}

// 渲染证据链
function renderEvidence() {
    const evidenceList = document.getElementById('evidenceList');
    evidenceList.innerHTML = '';
    
    mockData.evidences.forEach(evidence => {
        const item = document.createElement('div');
        item.className = 'evidence-item';
        item.innerHTML = `
            <div class="evidence-header">
                <span class="evidence-field">${evidence.field}</span>
                <span class="evidence-source">${evidence.source}</span>
            </div>
            <div class="evidence-summary">${evidence.summary}</div>
            <a href="#" class="evidence-link" onclick="handleEvidenceClick('${evidence.field}')">
                <i class="fas fa-external-link-alt"></i>
                ${evidence.link}
            </a>
        `;
        evidenceList.appendChild(item);
    });
}

// 更新统计数据
function updateStats() {
    document.getElementById('totalChanges').textContent = mockData.stats.totalChanges;
    document.getElementById('abnormalChanges').textContent = mockData.stats.abnormalChanges;
    document.getElementById('totalAmount').textContent = mockData.stats.totalAmount;
    document.getElementById('highRiskRatio').textContent = mockData.stats.highRiskRatio;
}

// 处理搜索
function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    const filteredData = mockData.changes.filter(change => 
        change.id.toLowerCase().includes(query) ||
        change.project.toLowerCase().includes(query) ||
        change.name.toLowerCase().includes(query) ||
        change.proposer.toLowerCase().includes(query)
    );
    renderTable(filteredData);
}

// 处理筛选
function handleFilter() {
    const projectFilter = document.getElementById('projectFilter').value;
    const severityFilter = document.getElementById('severityFilter').value;
    
    let filteredData = mockData.changes;
    
    if (projectFilter) {
        filteredData = filteredData.filter(change => change.project === projectFilter);
    }
    
    if (severityFilter) {
        filteredData = filteredData.filter(change => change.riskLevel === severityFilter);
    }
    
    renderTable(filteredData);
}

// 处理规则筛选
function handleRuleFilter() {
    const checkedRules = Array.from(document.querySelectorAll('.rule-checkbox:checked'))
        .map(checkbox => checkbox.dataset.rule);
    
    let filteredData = mockData.changes;
    
    if (checkedRules.length > 0) {
        filteredData = filteredData.filter(change => 
            checkedRules.some(rule => change.rules.includes(rule))
        );
    }
    
    renderTable(filteredData);
}

// 打开详情抽屉
function openDrawer(changeId) {
    const change = mockData.changes.find(c => c.id === changeId);
    if (!change) return;
    
    const drawer = document.getElementById('detailDrawer');
    const overlay = document.getElementById('drawerOverlay');
    const content = document.getElementById('drawerContent');
    
    // 渲染详情内容
    content.innerHTML = `
        <div class="detail-section">
            <h4 class="detail-title">基本信息</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">变更编号：</span>
                    <span class="detail-value">${change.id}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">提出时间：</span>
                    <span class="detail-value">2024-01-10</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">涉及合同条款：</span>
                    <span class="detail-value">第3.2条、第5.1条</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">设计文件版本：</span>
                    <span class="detail-value">V1.2 → V1.3</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">批复编号：</span>
                    <span class="detail-value">APP-2024-001</span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4 class="detail-title">审批链路</h4>
            <div class="timeline">
                ${mockData.timeline.map(item => `
                    <div class="timeline-item ${item.status}">
                        <div class="timeline-stage">${item.stage}</div>
                        <div class="timeline-time">${item.time}</div>
                        <div class="timeline-handler">处理人：${item.handler}</div>
                        <div class="timeline-note">${item.note}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="detail-section">
            <h4 class="detail-title">金额影响</h4>
            <div class="amount-info">
                <div class="amount-row">
                    <span class="amount-label">原合同金额：</span>
                    <span class="amount-value">${mockData.amounts.original}</span>
                </div>
                <div class="amount-row">
                    <span class="amount-label">累计变更：</span>
                    <span class="amount-value">${mockData.amounts.changes}</span>
                </div>
                <div class="amount-row">
                    <span class="amount-label">变更后金额：</span>
                    <span class="amount-value">${mockData.amounts.final}</span>
                </div>
                <div class="amount-row">
                    <span class="amount-label">变更占比：</span>
                    <span class="amount-value">${mockData.amounts.ratio}</span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4 class="detail-title">附件资料</h4>
            <div class="attachment-list">
                <div class="attachment-item">
                    <span class="attachment-name">
                        <i class="fas fa-file-pdf"></i>
                        变更申请单.pdf
                    </span>
                    <span class="attachment-time">2024-01-10</span>
                </div>
                <div class="attachment-item">
                    <span class="attachment-name">
                        <i class="fas fa-file-image"></i>
                        设计图纸对比.jpg
                    </span>
                    <span class="attachment-time">2024-01-12</span>
                </div>
                <div class="attachment-item">
                    <span class="attachment-name">
                        <i class="fas fa-file-excel"></i>
                        成本分析表.xlsx
                    </span>
                    <span class="attachment-time">2024-01-14</span>
                </div>
            </div>
        </div>
        
        <div class="detail-actions">
            <button class="btn btn-outline-primary" onclick="handleAction('supplement')">
                <i class="fas fa-plus"></i>
                发起补充材料
            </button>
            <button class="btn btn-outline-primary" onclick="handleAction('review')">
                <i class="fas fa-search"></i>
                提交复核
            </button>
            <button class="btn btn-outline-primary" onclick="handleAction('audit')">
                <i class="fas fa-gavel"></i>
                纪检审核
            </button>
            <button class="btn btn-primary" onclick="handleAction('archive')">
                <i class="fas fa-archive"></i>
                归档
            </button>
        </div>
    `;
    
    // 显示抽屉
    overlay.classList.add('show');
    drawer.classList.add('show');
}

// 关闭详情抽屉
function closeDrawer() {
    const drawer = document.getElementById('detailDrawer');
    const overlay = document.getElementById('drawerOverlay');
    
    overlay.classList.remove('show');
    drawer.classList.remove('show');
}

// 处理操作按钮
function handleAction(action) {
    const actions = {
        supplement: '发起补充材料',
        review: '提交复核',
        audit: '纪检审核',
        archive: '归档'
    };
    
    showToast(`${actions[action]}操作已提交`, 'success');
    
    // 模拟状态更新
    setTimeout(() => {
        showToast('状态已更新', 'success');
    }, 1000);
}

// 处理证据点击
function handleEvidenceClick(field) {
    showToast(`正在打开${field}...`, 'info');
}

// 导出数据
function exportData(format) {
    showToast(`正在导出${format.toUpperCase()}文件...`, 'info');
    
    setTimeout(() => {
        showToast(`${format.toUpperCase()}文件导出完成`, 'success');
    }, 2000);
}

// 刷新表格
function refreshTable() {
    showToast('正在刷新数据...', 'info');
    
    setTimeout(() => {
        renderTable();
        showToast('数据已刷新', 'success');
    }, 1000);
}

// 返回首页
function goHome() {
    window.location.href = 'index.html';
}

// 显示Toast提示
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const icon = toast.querySelector('.toast-icon');
    const messageEl = toast.querySelector('.toast-message');
    
    // 设置图标
    icon.className = `toast-icon ${type}`;
    icon.innerHTML = type === 'success' ? '✓' : 
                    type === 'error' ? '✕' : 
                    type === 'warning' ? '⚠' : 'i';
    
    // 设置消息
    messageEl.textContent = message;
    
    // 显示Toast
    toast.classList.add('show');
    
    // 自动隐藏
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// 添加详情样式
const detailStyles = `
    .detail-section {
        margin-bottom: 2rem;
    }
    
    .detail-title {
        font-size: 1rem;
        font-weight: 600;
        color: #212529;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #D32F2F;
    }
    
    .detail-grid {
        display: grid;
        gap: 0.75rem;
    }
    
    .detail-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid #f1f3f4;
    }
    
    .detail-item:last-child {
        border-bottom: none;
    }
    
    .detail-label {
        font-weight: 500;
        color: #495057;
        font-size: 0.875rem;
    }
    
    .detail-value {
        color: #212529;
        font-size: 0.875rem;
    }
    
    .detail-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-top: 2rem;
        padding-top: 1.5rem;
        border-top: 1px solid #e9ecef;
    }
    
    .detail-actions .btn {
        flex: 1;
        min-width: 120px;
        justify-content: center;
    }
`;

// 添加详情样式到页面
const styleSheet = document.createElement('style');
styleSheet.textContent = detailStyles;
document.head.appendChild(styleSheet);
