// 合规看板页面交互逻辑

// 占位数据
const mockData = {
    projects: [
        {
            id: 'PRJ-001',
            name: '项目A',
            progress: { status: 'warning', text: '延误', days: 5 },
            cost: { status: 'success', text: '正常', overrun: 0 },
            quality: { status: 'success', text: '合格', rate: 96.5 },
            violations: { count: 2, severity: 'medium' },
            manager: '张三',
            lastUpdate: '2024-01-15',
            milestones: [
                { name: '设计阶段', status: 'completed', date: '2024-01-10' },
                { name: '施工准备', status: 'pending', date: '2024-01-20' },
                { name: '主体施工', status: 'pending', date: '2024-02-15' }
            ],
            costDetails: {
                budget: 5000000,
                spent: 4800000,
                overrun: 0
            },
            qualityDetails: {
                passRate: 96.5,
                reworkRate: 3.5,
                issues: 2
            },
            recentEvents: [
                { type: 'violation', title: '材料规格不符合要求', date: '2024-01-12', severity: 'medium' },
                { type: 'quality', title: '质量检查发现问题', date: '2024-01-10', severity: 'low' },
                { type: 'cost', title: '成本控制良好', date: '2024-01-08', severity: 'info' }
            ]
        },
        {
            id: 'PRJ-002',
            name: '项目B',
            progress: { status: 'success', text: '正常', days: 0 },
            cost: { status: 'danger', text: '超支', overrun: 15.2 },
            quality: { status: 'warning', text: '待检', rate: 0 },
            violations: { count: 5, severity: 'high' },
            manager: '李四',
            lastUpdate: '2024-01-18',
            milestones: [
                { name: '设计阶段', status: 'completed', date: '2024-01-05' },
                { name: '施工准备', status: 'completed', date: '2024-01-15' },
                { name: '主体施工', status: 'current', date: '2024-02-01' }
            ],
            costDetails: {
                budget: 8000000,
                spent: 9200000,
                overrun: 15.2
            },
            qualityDetails: {
                passRate: 0,
                reworkRate: 0,
                issues: 0
            },
            recentEvents: [
                { type: 'violation', title: '供应商资质造假', date: '2024-01-16', severity: 'high' },
                { type: 'violation', title: '施工安全违规', date: '2024-01-14', severity: 'high' },
                { type: 'cost', title: '材料价格上涨', date: '2024-01-12', severity: 'medium' }
            ]
        },
        {
            id: 'PRJ-003',
            name: '项目C',
            progress: { status: 'success', text: '正常', days: 0 },
            cost: { status: 'success', text: '正常', overrun: 0 },
            quality: { status: 'success', text: '优秀', rate: 98.8 },
            violations: { count: 0, severity: 'low' },
            manager: '王五',
            lastUpdate: '2024-01-20',
            milestones: [
                { name: '设计阶段', status: 'completed', date: '2024-01-08' },
                { name: '施工准备', status: 'completed', date: '2024-01-18' },
                { name: '主体施工', status: 'pending', date: '2024-02-20' }
            ],
            costDetails: {
                budget: 3000000,
                spent: 2800000,
                overrun: 0
            },
            qualityDetails: {
                passRate: 98.8,
                reworkRate: 1.2,
                issues: 0
            },
            recentEvents: [
                { type: 'quality', title: '质量检查优秀', date: '2024-01-18', severity: 'info' },
                { type: 'progress', title: '进度按计划进行', date: '2024-01-15', severity: 'info' },
                { type: 'cost', title: '成本控制良好', date: '2024-01-12', severity: 'info' }
            ]
        },
        {
            id: 'PRJ-004',
            name: '项目D',
            progress: { status: 'danger', text: '严重延误', days: 15 },
            cost: { status: 'warning', text: '轻微超支', overrun: 8.5 },
            quality: { status: 'danger', text: '不合格', rate: 85.2 },
            violations: { count: 8, severity: 'high' },
            manager: '赵六',
            lastUpdate: '2024-01-22',
            milestones: [
                { name: '设计阶段', status: 'delayed', date: '2024-01-25' },
                { name: '施工准备', status: 'pending', date: '2024-02-10' },
                { name: '主体施工', status: 'pending', date: '2024-03-01' }
            ],
            costDetails: {
                budget: 12000000,
                spent: 13020000,
                overrun: 8.5
            },
            qualityDetails: {
                passRate: 85.2,
                reworkRate: 14.8,
                issues: 12
            },
            recentEvents: [
                { type: 'violation', title: '设计变更未审批', date: '2024-01-20', severity: 'high' },
                { type: 'quality', title: '材料质量不合格', date: '2024-01-18', severity: 'high' },
                { type: 'progress', title: '施工进度严重滞后', date: '2024-01-15', severity: 'high' }
            ]
        }
    ],
    
    changeTop: [
        { rank: 1, name: '项目D', value: '15次变更', type: 'gold' },
        { rank: 2, name: '项目B', value: '8次变更', type: 'silver' },
        { rank: 3, name: '项目A', value: '5次变更', type: 'bronze' },
        { rank: 4, name: '项目C', value: '2次变更', type: 'other' }
    ],
    
    violationTop: [
        { rank: 1, name: '供应商X', value: '12起违规', type: 'gold' },
        { rank: 2, name: '供应商Y', value: '8起违规', type: 'silver' },
        { rank: 3, name: '供应商Z', value: '5起违规', type: 'bronze' },
        { rank: 4, name: '供应商W', value: '3起违规', type: 'other' }
    ],
    
    kpi: {
        delayedProjects: 8,
        overBudgetProjects: 5,
        qualityRate: 94.2,
        violationEvents: 12
    }
};

// 当前用户权限（占位）
const userRole = 'manager'; // 'admin', 'manager', 'auditor'

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    bindEvents();
    renderTable();
    renderTopLists();
    updateKPI();
    checkPermissions();
});

// 初始化页面
function initializePage() {
    console.log('合规看板页面初始化');
}

// 绑定事件
function bindEvents() {
    // 筛选功能
    const timeRange = document.getElementById('timeRange');
    const projectFilter = document.getElementById('projectFilter');
    const dimensionCheckboxes = document.querySelectorAll('.tag-checkbox');
    
    timeRange.addEventListener('change', handleFilter);
    projectFilter.addEventListener('change', handleFilter);
    dimensionCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleFilter);
    });
    
    // 搜索功能
    const searchInput = document.getElementById('projectSearch');
    searchInput.addEventListener('input', handleSearch);
    
    // 表格行点击
    document.addEventListener('click', function(e) {
        const row = e.target.closest('tbody tr');
        if (row) {
            const projectId = row.dataset.projectId;
            if (projectId) {
                openDrawer(projectId);
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
function renderTable(data = mockData.projects) {
    const tbody = document.getElementById('projectsTableBody');
    tbody.innerHTML = '';
    
    data.forEach(project => {
        const row = document.createElement('tr');
        row.dataset.projectId = project.id;
        row.innerHTML = `
            <td>${project.name}</td>
            <td><span class="status-badge ${project.progress.status}">${project.progress.text}</span></td>
            <td><span class="status-badge ${project.cost.status}">${project.cost.text}</span></td>
            <td><span class="status-badge ${project.quality.status}">${project.quality.text}</span></td>
            <td><span class="violation-badge ${project.violations.severity}">${project.violations.count}</span></td>
            <td>${project.manager}</td>
            <td>${project.lastUpdate}</td>
        `;
        tbody.appendChild(row);
    });
    
    updatePagination();
}

// 渲染Top榜
function renderTopLists() {
    renderChangeTop();
    renderViolationTop();
}

// 渲染变更异常Top榜
function renderChangeTop() {
    const list = document.getElementById('changeTopList');
    list.innerHTML = '';
    
    mockData.changeTop.forEach(item => {
        const element = document.createElement('div');
        element.className = 'top-item';
        element.innerHTML = `
            <div class="top-rank ${item.type}">${item.rank}</div>
            <div class="top-name">${item.name}</div>
            <div class="top-value">${item.value}</div>
        `;
        list.appendChild(element);
    });
}

// 渲染违规高发Top榜
function renderViolationTop() {
    const list = document.getElementById('violationTopList');
    list.innerHTML = '';
    
    mockData.violationTop.forEach(item => {
        const element = document.createElement('div');
        element.className = 'top-item';
        element.innerHTML = `
            <div class="top-rank ${item.type}">${item.rank}</div>
            <div class="top-name">${item.name}</div>
            <div class="top-value">${item.value}</div>
        `;
        list.appendChild(element);
    });
}

// 更新KPI数据
function updateKPI() {
    document.getElementById('delayedProjects').textContent = mockData.kpi.delayedProjects;
    document.getElementById('overBudgetProjects').textContent = mockData.kpi.overBudgetProjects;
    document.getElementById('qualityRate').textContent = mockData.kpi.qualityRate + '%';
    document.getElementById('violationEvents').textContent = mockData.kpi.violationEvents;
}

// 处理筛选
function handleFilter() {
    const timeRange = document.getElementById('timeRange').value;
    const projectFilter = document.getElementById('projectFilter').value;
    const checkedDimensions = Array.from(document.querySelectorAll('.tag-checkbox:checked'))
        .map(checkbox => checkbox.dataset.dimension);
    
    let filteredData = mockData.projects;
    
    // 项目筛选
    if (projectFilter) {
        filteredData = filteredData.filter(project => project.name === projectFilter);
    }
    
    // 维度筛选（这里简化处理，实际应该根据维度过滤）
    if (checkedDimensions.length < 4) {
        // 根据选中的维度进行筛选
        filteredData = filteredData.filter(project => {
            return checkedDimensions.some(dimension => {
                switch(dimension) {
                    case 'progress':
                        return project.progress.status !== 'success';
                    case 'cost':
                        return project.cost.status !== 'success';
                    case 'quality':
                        return project.quality.status !== 'success';
                    case 'violation':
                        return project.violations.count > 0;
                    default:
                        return true;
                }
            });
        });
    }
    
    renderTable(filteredData);
    updateKPI();
}

// 处理搜索
function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    const filteredData = mockData.projects.filter(project => 
        project.name.toLowerCase().includes(query) ||
        project.manager.toLowerCase().includes(query)
    );
    renderTable(filteredData);
}

// 打开详情抽屉
function openDrawer(projectId) {
    const project = mockData.projects.find(p => p.id === projectId);
    if (!project) return;
    
    const drawer = document.getElementById('detailDrawer');
    const overlay = document.getElementById('drawerOverlay');
    const content = document.getElementById('drawerContent');
    
    // 渲染详情内容
    content.innerHTML = `
        <div class="detail-section">
            <h4 class="detail-title">基本信息</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">项目名称：</span>
                    <span class="detail-value">${project.name}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">项目编号：</span>
                    <span class="detail-value">${project.id}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">负责人：</span>
                    <span class="detail-value">${project.manager}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">最后更新：</span>
                    <span class="detail-value">${project.lastUpdate}</span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4 class="detail-title">近期里程碑</h4>
            <div class="milestone-list">
                ${project.milestones.map(milestone => `
                    <div class="milestone-item">
                        <span class="milestone-name">${milestone.name}</span>
                        <span class="milestone-status ${milestone.status}">${getMilestoneStatusText(milestone.status)}</span>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="detail-section">
            <h4 class="detail-title">成本情况</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">预算金额：</span>
                    <span class="detail-value">${formatAmount(project.costDetails.budget)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">已花费：</span>
                    <span class="detail-value">${formatAmount(project.costDetails.spent)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">超支情况：</span>
                    <span class="detail-value">${project.costDetails.overrun}%</span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4 class="detail-title">质量情况</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">合格率：</span>
                    <span class="detail-value">${project.qualityDetails.passRate}%</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">返工率：</span>
                    <span class="detail-value">${project.qualityDetails.reworkRate}%</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">问题数量：</span>
                    <span class="detail-value">${project.qualityDetails.issues}</span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4 class="detail-title">最近事件</h4>
            <div class="event-list">
                ${project.recentEvents.map(event => `
                    <div class="event-item">
                        <div class="event-header">
                            <span class="event-title">${event.title}</span>
                            <span class="event-severity ${event.severity}">${getSeverityText(event.severity)}</span>
                        </div>
                        <div class="event-date">${event.date}</div>
                    </div>
                `).join('')}
            </div>
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

// 导出数据
function exportData(format) {
    showToast(`正在导出${format.toUpperCase()}文件...`, 'info');
    
    // 显示审计日志提示
    showAuditNotice();
    
    setTimeout(() => {
        showToast(`${format.toUpperCase()}文件导出完成`, 'success');
    }, 2000);
}

// 返回首页
function goHome() {
    window.location.href = 'index.html';
}

// 切换筛选
function toggleFilter(type) {
    if (type === 'abnormal') {
        const filteredData = mockData.projects.filter(project => 
            project.progress.status !== 'success' ||
            project.cost.status !== 'success' ||
            project.quality.status !== 'success' ||
            project.violations.count > 0
        );
        renderTable(filteredData);
    }
}

// 分页功能
function changePage(direction) {
    // 占位分页逻辑
    showToast('分页功能（占位）', 'info');
}

// 更新分页信息
function updatePagination() {
    // 占位分页信息更新
}

// 检查权限
function checkPermissions() {
    if (userRole !== 'admin') {
        // 显示脱敏提示
        showPermissionNotice();
        
        // 对敏感数据进行脱敏处理
        applyDataMasking();
    }
}

// 显示权限提示
function showPermissionNotice() {
    const notice = document.getElementById('permissionNotice');
    notice.style.display = 'flex';
}

// 应用数据脱敏
function applyDataMasking() {
    // 对成本相关数据进行脱敏
    const costElements = document.querySelectorAll('.detail-value');
    costElements.forEach(element => {
        if (element.textContent.includes('¥') || element.textContent.includes('万')) {
            element.textContent = '****';
        }
    });
}

// 显示审计日志提示
function showAuditNotice() {
    const notice = document.getElementById('auditNotice');
    notice.style.display = 'flex';
    
    setTimeout(() => {
        notice.style.display = 'none';
    }, 3000);
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
function getMilestoneStatusText(status) {
    const statusMap = {
        'completed': '已完成',
        'pending': '待开始',
        'current': '进行中',
        'delayed': '已延误'
    };
    return statusMap[status] || status;
}

function getSeverityText(severity) {
    const severityMap = {
        'high': '高',
        'medium': '中',
        'low': '低',
        'info': '信息'
    };
    return severityMap[severity] || severity;
}

function formatAmount(amount) {
    if (userRole !== 'admin') {
        return '****';
    }
    return '¥' + (amount / 10000).toFixed(1) + '万';
}

// 添加详情样式
const detailStyles = `
    .event-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
    
    .event-item {
        padding: 0.75rem;
        border: 1px solid #e9ecef;
        border-radius: 4px;
        background: #f8f9fa;
    }
    
    .event-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.25rem;
    }
    
    .event-title {
        font-size: 0.875rem;
        font-weight: 500;
        color: #212529;
    }
    
    .event-severity {
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-weight: 500;
    }
    
    .event-severity.high {
        background: #f8d7da;
        color: #721c24;
    }
    
    .event-severity.medium {
        background: #fff3cd;
        color: #856404;
    }
    
    .event-severity.low {
        background: #d4edda;
        color: #155724;
    }
    
    .event-severity.info {
        background: #cce5ff;
        color: #004085;
    }
    
    .event-date {
        font-size: 0.75rem;
        color: #6c757d;
    }
`;

// 添加详情样式到页面
const styleSheet = document.createElement('style');
styleSheet.textContent = detailStyles;
document.head.appendChild(styleSheet);
