// 告警中心页面交互逻辑

// 占位数据
const mockData = {
    alerts: [
        {
            id: 'ALT-001',
            severity: 'high',
            module: '供应商画像',
            project: '项目A/标段1',
            owner: '张三',
            time: '2024-01-22 14:30',
            status: 'pending',
            desc: '发现供应商关联交易风险',
            rule: '关联交易检测规则R001',
            evidenceLink: '查看证据链',
            slaTime: '2小时30分',
            history: [
                { operator: '系统', time: '2024-01-22 14:30', action: '触发告警', result: '高风险关联交易检测' },
                { operator: '张三', time: '2024-01-22 15:00', action: '确认告警', result: '已确认，待处理' }
            ]
        },
        {
            id: 'ALT-002',
            severity: 'medium',
            module: '设计追溯',
            project: '项目B/标段2',
            owner: '李四',
            time: '2024-01-22 13:15',
            status: 'processing',
            desc: '设计变更未按流程审批',
            rule: '设计变更审批规则R002',
            evidenceLink: '查看证据链',
            slaTime: '4小时15分',
            history: [
                { operator: '系统', time: '2024-01-22 13:15', action: '触发告警', result: '设计变更流程异常' },
                { operator: '李四', time: '2024-01-22 13:45', action: '开始处理', result: '正在核实变更原因' }
            ]
        },
        {
            id: 'ALT-003',
            severity: 'low',
            module: '合规看板',
            project: '项目C/标段3',
            owner: '王五',
            time: '2024-01-22 11:20',
            status: 'resolved',
            desc: '成本超预算预警',
            rule: '成本控制规则R003',
            evidenceLink: '查看证据链',
            slaTime: '已完成',
            history: [
                { operator: '系统', time: '2024-01-22 11:20', action: '触发告警', result: '成本超预算5%' },
                { operator: '王五', time: '2024-01-22 12:00', action: '处理完成', result: '已调整预算，问题解决' }
            ]
        },
        {
            id: 'ALT-004',
            severity: 'high',
            module: '关系梳理',
            project: '项目D/标段1',
            owner: '赵六',
            time: '2024-01-22 09:45',
            status: 'pending',
            desc: '发现影子股东风险',
            rule: '影子股东检测规则R004',
            evidenceLink: '查看证据链',
            slaTime: '1小时15分',
            history: [
                { operator: '系统', time: '2024-01-22 09:45', action: '触发告警', result: '疑似影子股东关系' },
                { operator: '赵六', time: '2024-01-22 10:15', action: '确认告警', result: '已确认，待深入调查' }
            ]
        },
        {
            id: 'ALT-005',
            severity: 'medium',
            module: '供应商画像',
            project: '项目A/标段2',
            owner: '张三',
            time: '2024-01-21 16:30',
            status: 'closed',
            desc: '供应商资质即将到期',
            rule: '资质管理规则R005',
            evidenceLink: '查看证据链',
            slaTime: '已关闭',
            history: [
                { operator: '系统', time: '2024-01-21 16:30', action: '触发告警', result: '资质30天内到期' },
                { operator: '张三', time: '2024-01-21 17:00', action: '处理完成', result: '已联系供应商更新资质' },
                { operator: '张三', time: '2024-01-22 09:00', action: '关闭告警', result: '资质已更新，问题解决' }
            ]
        }
    ],
    
    stats: {
        total: 156,
        today: 12,
        unresolved: 28,
        highRiskRate: 35
    },
    
    trend: {
        daily: [
            { date: '01-18', count: 8 },
            { date: '01-19', count: 12 },
            { date: '01-20', count: 15 },
            { date: '01-21', count: 10 },
            { date: '01-22', count: 12 }
        ],
        weekly: [
            { week: '第3周', count: 45 },
            { week: '第4周', count: 52 },
            { week: '第5周', count: 38 },
            { week: '第6周', count: 21 }
        ]
    },
    
    distribution: {
        byModule: [
            { module: '供应商画像', count: 62, percentage: 40 },
            { module: '设计追溯', count: 47, percentage: 30 },
            { module: '合规看板', count: 31, percentage: 20 },
            { module: '关系梳理', count: 16, percentage: 10 }
        ],
        bySeverity: [
            { severity: '高风险', count: 55, percentage: 35 },
            { severity: '中风险', count: 70, percentage: 45 },
            { severity: '低风险', count: 31, percentage: 20 }
        ]
    },
    
    ranking: [
        { rank: 1, name: '张三', count: 15, type: 'gold' },
        { rank: 2, name: '李四', count: 12, type: 'silver' },
        { rank: 3, name: '王五', count: 8, type: 'bronze' },
        { rank: 4, name: '赵六', count: 6, type: 'other' },
        { rank: 5, name: '孙七', count: 4, type: 'other' }
    ]
};

// 当前趋势视图
let currentTrendView = 'daily';

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    bindEvents();
    renderTable();
    renderRanking();
    updateKPI();
});

// 初始化页面
function initializePage() {
    console.log('告警中心页面初始化');
}

// 绑定事件
function bindEvents() {
    // 筛选功能
    const severityFilter = document.getElementById('severityFilter');
    const moduleFilter = document.getElementById('moduleFilter');
    const projectFilter = document.getElementById('projectFilter');
    const ownerFilter = document.getElementById('ownerFilter');
    
    severityFilter.addEventListener('change', handleFilter);
    moduleFilter.addEventListener('change', handleFilter);
    projectFilter.addEventListener('change', handleFilter);
    ownerFilter.addEventListener('change', handleFilter);
    
    // 搜索功能
    const searchInput = document.getElementById('keywordSearch');
    searchInput.addEventListener('input', handleSearch);
    
    // 全选功能
    const selectAllCheckbox = document.getElementById('selectAll');
    selectAllCheckbox.addEventListener('change', handleSelectAll);
    
    // 表格行点击
    document.addEventListener('click', function(e) {
        const row = e.target.closest('tbody tr');
        if (row && !e.target.closest('.table-checkbox') && !e.target.closest('.action-btn')) {
            const alertId = row.dataset.alertId;
            if (alertId) {
                openDrawer(alertId);
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
function renderTable(data = mockData.alerts) {
    const tbody = document.getElementById('alertsTableBody');
    tbody.innerHTML = '';
    
    data.forEach(alert => {
        const row = document.createElement('tr');
        row.dataset.alertId = alert.id;
        row.innerHTML = `
            <td>
                <input type="checkbox" class="table-checkbox row-checkbox" data-alert-id="${alert.id}">
            </td>
            <td><span class="severity-badge ${alert.severity}">${getSeverityText(alert.severity)}</span></td>
            <td>${alert.module}</td>
            <td>${alert.project}</td>
            <td>${alert.owner}</td>
            <td>${alert.time}</td>
            <td><span class="status-badge ${alert.status}">${getStatusText(alert.status)}</span></td>
            <td>
                <button class="action-btn" onclick="handleAlertAction('${alert.id}', 'view')">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    updateBatchActions();
}

// 渲染排行榜
function renderRanking() {
    const list = document.getElementById('rankingList');
    list.innerHTML = '';
    
    mockData.ranking.forEach(item => {
        const element = document.createElement('div');
        element.className = 'ranking-item';
        element.innerHTML = `
            <div class="ranking-rank ${item.type}">${item.rank}</div>
            <div class="ranking-name">${item.name}</div>
            <div class="ranking-count">${item.count}件</div>
        `;
        list.appendChild(element);
    });
}

// 更新KPI数据
function updateKPI() {
    document.getElementById('totalAlerts').textContent = mockData.stats.total;
    document.getElementById('todayAlerts').textContent = mockData.stats.today;
    document.getElementById('unresolvedAlerts').textContent = mockData.stats.unresolved;
    document.getElementById('highRiskRate').textContent = mockData.stats.highRiskRate + '%';
}

// 处理筛选
function handleFilter() {
    const severityFilter = document.getElementById('severityFilter').value;
    const moduleFilter = document.getElementById('moduleFilter').value;
    const projectFilter = document.getElementById('projectFilter').value;
    const ownerFilter = document.getElementById('ownerFilter').value;
    
    let filteredData = mockData.alerts;
    
    if (severityFilter) {
        filteredData = filteredData.filter(alert => alert.severity === severityFilter);
    }
    
    if (moduleFilter) {
        filteredData = filteredData.filter(alert => alert.module === moduleFilter);
    }
    
    if (projectFilter) {
        filteredData = filteredData.filter(alert => alert.project.includes(projectFilter));
    }
    
    if (ownerFilter) {
        filteredData = filteredData.filter(alert => alert.owner === ownerFilter);
    }
    
    renderTable(filteredData);
}

// 处理搜索
function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    const filteredData = mockData.alerts.filter(alert => 
        alert.desc.toLowerCase().includes(query) ||
        alert.module.toLowerCase().includes(query) ||
        alert.project.toLowerCase().includes(query) ||
        alert.owner.toLowerCase().includes(query)
    );
    renderTable(filteredData);
}

// 处理全选
function handleSelectAll(e) {
    const isChecked = e.target.checked;
    const checkboxes = document.querySelectorAll('.row-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = isChecked;
    });
    updateBatchActions();
}

// 更新批量操作按钮显示
function updateBatchActions() {
    const checkedBoxes = document.querySelectorAll('.row-checkbox:checked');
    const batchActions = document.getElementById('batchActions');
    
    if (checkedBoxes.length > 0) {
        batchActions.style.display = 'flex';
    } else {
        batchActions.style.display = 'none';
    }
}

// 切换趋势视图
function switchTrend(view) {
    currentTrendView = view;
    
    // 更新标签状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // 更新图表占位文本
    const placeholder = document.querySelector('.chart-placeholder p');
    if (view === 'daily') {
        placeholder.textContent = '告警数量趋势图（日）';
    } else {
        placeholder.textContent = '告警数量趋势图（周）';
    }
    
    showToast(`已切换到${view === 'daily' ? '日' : '周'}趋势视图`, 'info');
}

// 打开详情抽屉
function openDrawer(alertId) {
    const alert = mockData.alerts.find(a => a.id === alertId);
    if (!alert) return;
    
    const drawer = document.getElementById('detailDrawer');
    const overlay = document.getElementById('drawerOverlay');
    const content = document.getElementById('drawerContent');
    
    // 渲染详情内容
    content.innerHTML = `
        <div class="detail-section">
            <h4 class="detail-title">基本信息</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">告警ID：</span>
                    <span class="detail-value">${alert.id}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">来源模块：</span>
                    <span class="detail-value">${alert.module}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">项目/标段：</span>
                    <span class="detail-value">${alert.project}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">责任人：</span>
                    <span class="detail-value">${alert.owner}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">触发时间：</span>
                    <span class="detail-value">${alert.time}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">触发规则：</span>
                    <span class="detail-value">${alert.rule}</span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4 class="detail-title">告警描述</h4>
            <div class="detail-description">
                <p>${alert.desc}</p>
                <a href="#" class="evidence-link" onclick="handleEvidenceClick('${alert.id}')">
                    <i class="fas fa-external-link-alt"></i>
                    ${alert.evidenceLink}
                </a>
            </div>
        </div>
        
        <div class="detail-section">
            <h4 class="detail-title">当前状态</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">状态：</span>
                    <span class="detail-value">
                        <span class="status-badge ${alert.status}">${getStatusText(alert.status)}</span>
                    </span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">严重度：</span>
                    <span class="detail-value">
                        <span class="severity-badge ${alert.severity}">${getSeverityText(alert.severity)}</span>
                    </span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4 class="detail-title">SLA倒计时</h4>
            <div class="sla-timer ${getSLAClass(alert.slaTime)}">
                <i class="fas fa-clock"></i>
                ${alert.slaTime}
            </div>
        </div>
        
        <div class="detail-section">
            <h4 class="detail-title">处置历史</h4>
            <div class="history-list">
                ${alert.history.map(record => `
                    <div class="history-item">
                        <div class="history-time">${record.time}</div>
                        <div class="history-content">
                            <div class="history-action">${record.operator} - ${record.action}</div>
                            <div class="history-result">${record.result}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="detail-actions">
            <button class="btn btn-outline-primary" onclick="handleAlertAction('${alert.id}', 'supplement')">
                <i class="fas fa-plus"></i>
                补充材料
            </button>
            <button class="btn btn-outline-primary" onclick="handleAlertAction('${alert.id}', 'assign')">
                <i class="fas fa-user-plus"></i>
                指派复核
            </button>
            <button class="btn btn-outline-primary" onclick="handleAlertAction('${alert.id}', 'audit')">
                <i class="fas fa-gavel"></i>
                纪检审核
            </button>
            <button class="btn btn-primary" onclick="handleAlertAction('${alert.id}', 'archive')">
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

// 处理告警操作
function handleAlertAction(alertId, action) {
    const actions = {
        view: '查看详情',
        supplement: '补充材料',
        assign: '指派复核',
        audit: '纪检审核',
        archive: '归档'
    };
    
    showToast(`已执行${actions[action]}操作`, 'success');
    
    // 模拟状态更新
    setTimeout(() => {
        showToast('状态已更新', 'success');
    }, 1000);
}

// 处理证据点击
function handleEvidenceClick(alertId) {
    showToast('正在打开证据链...', 'info');
}

// 批量操作
function batchAction(action) {
    const checkedBoxes = document.querySelectorAll('.row-checkbox:checked');
    const count = checkedBoxes.length;
    
    const actions = {
        mark: '批量标记',
        assign: '批量分派',
        merge: '批量合并'
    };
    
    showToast(`已对${count}条告警执行${actions[action]}操作`, 'success');
    
    // 清除选择
    document.getElementById('selectAll').checked = false;
    checkedBoxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    updateBatchActions();
}

// 导出数据
function exportData(format) {
    showToast(`正在导出${format.toUpperCase()}文件...`, 'info');
    
    setTimeout(() => {
        showToast(`${format.toUpperCase()}文件导出完成`, 'success');
    }, 2000);
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

// 辅助函数
function getSeverityText(severity) {
    const severityMap = {
        'high': '高风险',
        'medium': '中风险',
        'low': '低风险'
    };
    return severityMap[severity] || severity;
}

function getStatusText(status) {
    const statusMap = {
        'pending': '待处理',
        'processing': '处理中',
        'resolved': '已解决',
        'closed': '已关闭'
    };
    return statusMap[status] || status;
}

function getSLAClass(slaTime) {
    if (slaTime === '已完成' || slaTime === '已关闭') {
        return 'normal';
    } else if (slaTime.includes('小时') && parseInt(slaTime) < 2) {
        return 'warning';
    } else {
        return 'normal';
    }
}

// 添加详情样式
const detailStyles = `
    .detail-description {
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 6px;
        border-left: 4px solid #D32F2F;
    }
    
    .detail-description p {
        margin-bottom: 0.75rem;
        color: #495057;
        line-height: 1.5;
    }
    
    .evidence-link {
        color: #D32F2F;
        text-decoration: none;
        font-size: 0.875rem;
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
    }
    
    .evidence-link:hover {
        text-decoration: underline;
    }
`;

// 添加详情样式到页面
const styleSheet = document.createElement('style');
styleSheet.textContent = detailStyles;
document.head.appendChild(styleSheet);
