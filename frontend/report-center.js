// 报表中心页面逻辑
class ReportCenter {
    constructor() {
        this.currentUser = 'admin'; // 模拟当前用户角色
        this.exportLogs = []; // 导出记录
        this.queryResults = []; // 查询结果
        this.currentPage = 1;
        this.pageSize = 10;
        this.init();
    }

    init() {
        this.loadExportLogs();
        this.bindEvents();
        this.setDefaultDates();
    }

    bindEvents() {
        // Tab 切换事件
        const tabButtons = document.querySelectorAll('[data-bs-toggle="tab"]');
        tabButtons.forEach(button => {
            button.addEventListener('shown.bs.tab', (e) => {
                const target = e.target.getAttribute('data-bs-target');
                this.handleTabSwitch(target);
            });
        });

        // 搜索框事件
        const searchInput = document.getElementById('logs-search');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(() => {
                this.searchLogs();
            }, 300));
        }

        // 时间过滤事件
        const timeFilter = document.getElementById('logs-time-filter');
        if (timeFilter) {
            timeFilter.addEventListener('change', () => {
                this.filterLogsByTime();
            });
        }
    }

    setDefaultDates() {
        const today = new Date();
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        
        const startDateInput = document.getElementById('start-date');
        const endDateInput = document.getElementById('end-date');
        
        if (startDateInput) {
            startDateInput.value = this.formatDate(lastMonth);
        }
        if (endDateInput) {
            endDateInput.value = this.formatDate(today);
        }
    }

    handleTabSwitch(target) {
        switch (target) {
            case '#fixed-reports':
                // 固定报表页面，无需特殊处理
                break;
            case '#custom-query':
                // 自助查询页面，可以预加载一些数据
                this.loadQueryData();
                break;
            case '#export-logs':
                // 导出记录页面，刷新记录列表
                this.refreshExportLogs();
                break;
        }
    }

    // 生成报表预览
    generatePreview(reportType) {
        const previewSection = document.getElementById('preview-section');
        const previewTitle = document.getElementById('preview-title');
        const tableHeader = document.getElementById('preview-table-header');
        const tableBody = document.getElementById('preview-table-body');

        // 显示预览区域
        previewSection.style.display = 'block';
        previewSection.scrollIntoView({ behavior: 'smooth' });

        // 根据报表类型生成不同的预览数据
        const reportData = this.getReportData(reportType);
        previewTitle.textContent = reportData.title;

        // 生成表头
        tableHeader.innerHTML = reportData.headers.map(header => 
            `<th>${header}</th>`
        ).join('');

        // 生成数据行
        tableBody.innerHTML = reportData.rows.map(row => 
            `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
        ).join('');

        // 添加动画效果
        previewSection.classList.add('fade-in');
    }

    getReportData(reportType) {
        const reportTemplates = {
            'monthly-report': {
                title: '月度纪检监督报告',
                headers: ['项目名称', '违规事件数', '处置完成数', '处置率', '平均处置时长', '风险等级'],
                rows: [
                    ['项目A', '12', '10', '83.3%', '5.2天', '高风险'],
                    ['项目B', '8', '8', '100%', '3.1天', '中风险'],
                    ['项目C', '5', '4', '80%', '4.8天', '低风险'],
                    ['项目D', '15', '12', '80%', '6.5天', '高风险'],
                    ['项目E', '3', '3', '100%', '2.1天', '低风险']
                ]
            },
            'compliance-report': {
                title: '项目合规模板',
                headers: ['项目名称', '进度合规', '成本合规', '质量合规', '违规事件', '综合评分'],
                rows: [
                    ['项目A', '✓', '⚠', '✓', '2', '85分'],
                    ['项目B', '✓', '✓', '✓', '0', '95分'],
                    ['项目C', '⚠', '✓', '⚠', '1', '78分'],
                    ['项目D', '✓', '⚠', '✓', '3', '82分'],
                    ['项目E', '✓', '✓', '✓', '0', '98分']
                ]
            },
            'supplier-risk': {
                title: '供应商风险榜',
                headers: ['供应商名称', '关联关系风险', '影子股东风险', '招采异常', '综合风险分', '排名'],
                rows: [
                    ['供应商甲', '高风险', '中风险', '2次', '85分', '1'],
                    ['供应商乙', '中风险', '低风险', '1次', '65分', '2'],
                    ['供应商丙', '低风险', '无风险', '0次', '25分', '3'],
                    ['供应商丁', '高风险', '高风险', '3次', '95分', '4'],
                    ['供应商戊', '中风险', '中风险', '1次', '55分', '5']
                ]
            },
            'design-change': {
                title: '设计变更统计',
                headers: ['变更类型', '申请数量', '审批通过', '审批率', '平均审批时长', '影响项目数'],
                rows: [
                    ['结构变更', '15', '12', '80%', '3.2天', '8'],
                    ['设备变更', '8', '7', '87.5%', '2.1天', '5'],
                    ['材料变更', '12', '10', '83.3%', '2.8天', '6'],
                    ['工艺变更', '6', '5', '83.3%', '4.1天', '3'],
                    ['其他变更', '4', '3', '75%', '3.5天', '2']
                ]
            },
            'procurement-anomaly': {
                title: '招采异常分析',
                headers: ['异常类型', '发现次数', '涉及金额', '处置完成', '处置率', '风险等级'],
                rows: [
                    ['围标串标', '3', '2,500万', '2', '66.7%', '高风险'],
                    ['价格异常', '8', '1,200万', '6', '75%', '中风险'],
                    ['资质造假', '2', '800万', '1', '50%', '高风险'],
                    ['关联交易', '5', '1,800万', '4', '80%', '中风险'],
                    ['其他异常', '4', '600万', '3', '75%', '低风险']
                ]
            },
            'micro-power': {
                title: '微权力监控报告',
                headers: ['岗位名称', '监控人员数', '异常行为', '处置完成', '处置率', '风险等级'],
                rows: [
                    ['项目经理', '15', '8', '6', '75%', '中风险'],
                    ['采购经理', '8', '12', '9', '75%', '高风险'],
                    ['财务经理', '6', '3', '2', '66.7%', '中风险'],
                    ['技术负责人', '12', '5', '4', '80%', '低风险'],
                    ['质量经理', '10', '4', '3', '75%', '低风险']
                ]
            }
        };

        return reportTemplates[reportType] || {
            title: '报表预览',
            headers: ['列1', '列2', '列3'],
            rows: [['数据1', '数据2', '数据3']]
        };
    }

    // 执行自助查询
    executeQuery() {
        const filters = this.getQueryFilters();
        this.queryResults = this.filterData(filters);
        this.currentPage = 1;
        this.renderQueryResults();
        this.updateQuerySummary();
    }

    getQueryFilters() {
        return {
            startDate: document.getElementById('start-date').value,
            endDate: document.getElementById('end-date').value,
            projects: Array.from(document.getElementById('project-filter').selectedOptions).map(o => o.value),
            suppliers: Array.from(document.getElementById('supplier-filter').selectedOptions).map(o => o.value),
            ruleTypes: Array.from(document.getElementById('rule-type-filter').selectedOptions).map(o => o.value),
            fields: Array.from(document.getElementById('field-selector').selectedOptions).map(o => o.value)
        };
    }

    filterData(filters) {
        // 模拟数据过滤
        const allData = this.getSampleQueryData();
        return allData.filter(item => {
            // 这里可以根据实际需求实现复杂的过滤逻辑
            return true; // 简化处理，返回所有数据
        });
    }

    getSampleQueryData() {
        return [
            {
                project: '项目A',
                supplier: '供应商甲',
                amount: '1,200万',
                riskLevel: '高风险',
                status: '处理中',
                createTime: '2024-01-15',
                ruleType: '关联关系'
            },
            {
                project: '项目B',
                supplier: '供应商乙',
                amount: '800万',
                riskLevel: '中风险',
                status: '已完成',
                createTime: '2024-01-14',
                ruleType: '影子股东'
            },
            {
                project: '项目C',
                supplier: '供应商丙',
                amount: '1,500万',
                riskLevel: '低风险',
                status: '待审核',
                createTime: '2024-01-13',
                ruleType: '招采异常'
            },
            {
                project: '项目D',
                supplier: '供应商丁',
                amount: '2,000万',
                riskLevel: '高风险',
                status: '处理中',
                createTime: '2024-01-12',
                ruleType: '变更异常'
            },
            {
                project: '项目E',
                supplier: '供应商戊',
                amount: '600万',
                riskLevel: '中风险',
                status: '已完成',
                createTime: '2024-01-11',
                ruleType: '微权力'
            }
        ];
    }

    renderQueryResults() {
        const tableHeader = document.getElementById('query-table-header');
        const tableBody = document.getElementById('query-table-body');
        const pagination = document.getElementById('query-pagination');

        if (!tableHeader || !tableBody) return;

        // 获取选中的字段
        const selectedFields = Array.from(document.getElementById('field-selector').selectedOptions).map(o => o.value);
        const fieldLabels = {
            'project': '项目名称',
            'supplier': '供应商',
            'amount': '金额',
            'risk-level': '风险等级',
            'status': '状态',
            'create-time': '创建时间'
        };

        // 生成表头
        const headers = selectedFields.length > 0 ? selectedFields : Object.keys(fieldLabels);
        tableHeader.innerHTML = headers.map(field => 
            `<th>${fieldLabels[field] || field}</th>`
        ).join('');

        // 分页计算
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        const pageData = this.queryResults.slice(startIndex, endIndex);

        // 生成数据行
        tableBody.innerHTML = pageData.map(item => {
            const cells = headers.map(field => {
                let value = item[field] || '-';
                
                // 权限脱敏处理
                if (this.currentUser !== 'admin' && field === 'amount') {
                    value = '****';
                }
                
                return `<td>${value}</td>`;
            }).join('');
            
            return `<tr>${cells}</tr>`;
        }).join('');

        // 生成分页
        this.renderPagination(pagination, this.queryResults.length);
    }

    renderPagination(container, totalItems) {
        if (!container) return;

        const totalPages = Math.ceil(totalItems / this.pageSize);
        let paginationHTML = '';

        // 上一页
        paginationHTML += `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="reportCenter.goToPage(${this.currentPage - 1})">上一页</a>
            </li>
        `;

        // 页码
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                paginationHTML += `
                    <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" onclick="reportCenter.goToPage(${i})">${i}</a>
                    </li>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                paginationHTML += '<li class="page-item disabled"><span class="page-link">...</span></li>';
            }
        }

        // 下一页
        paginationHTML += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="reportCenter.goToPage(${this.currentPage + 1})">下一页</a>
            </li>
        `;

        container.innerHTML = paginationHTML;
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.queryResults.length / this.pageSize);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderQueryResults();
        }
    }

    updateQuerySummary() {
        const resultsCount = document.getElementById('results-count');
        const queryConditions = document.getElementById('query-conditions');
        
        if (resultsCount) {
            resultsCount.textContent = `共 ${this.queryResults.length} 条记录`;
        }
        
        if (queryConditions) {
            const filters = this.getQueryFilters();
            const conditions = [];
            
            if (filters.startDate && filters.endDate) {
                conditions.push(`时间: ${filters.startDate} 至 ${filters.endDate}`);
            }
            if (filters.projects.length > 0) {
                conditions.push(`项目: ${filters.projects.length}个`);
            }
            if (filters.suppliers.length > 0) {
                conditions.push(`供应商: ${filters.suppliers.length}个`);
            }
            if (filters.ruleTypes.length > 0) {
                conditions.push(`规则: ${filters.ruleTypes.length}种`);
            }
            
            queryConditions.textContent = conditions.length > 0 ? conditions.join(' | ') : '无筛选条件';
        }
    }

    // 重置查询
    resetQuery() {
        document.getElementById('start-date').value = '';
        document.getElementById('end-date').value = '';
        document.getElementById('project-filter').selectedIndex = -1;
        document.getElementById('supplier-filter').selectedIndex = -1;
        document.getElementById('rule-type-filter').selectedIndex = -1;
        document.getElementById('field-selector').selectedIndex = -1;
        
        this.queryResults = [];
        this.currentPage = 1;
        this.renderQueryResults();
        this.updateQuerySummary();
    }

    // 加载查询数据
    loadQueryData() {
        this.queryResults = this.getSampleQueryData();
        this.renderQueryResults();
        this.updateQuerySummary();
    }

    // 导出功能
    exportReport(format) {
        this.showToast(`已导出 ${format.toUpperCase()} 文件`);
        this.addExportLog('顶部导出', format, '全部数据');
    }

    exportPreview(format) {
        this.showToast(`预览已导出为 ${format.toUpperCase()} 文件`);
        this.addExportLog('固定报表预览', format, '预览数据');
    }

    exportQueryResults(format) {
        this.showToast(`查询结果已导出为 ${format.toUpperCase()} 文件`);
        this.addExportLog('自助查询结果', format, '查询结果');
    }

    addExportLog(reportName, format, conditions) {
        const log = {
            id: Date.now(),
            time: new Date().toLocaleString('zh-CN'),
            reportName: reportName,
            conditions: conditions,
            user: this.currentUser,
            format: format.toUpperCase(),
            fileSize: this.getRandomFileSize()
        };
        
        this.exportLogs.unshift(log);
        this.refreshExportLogs();
    }

    getRandomFileSize() {
        const sizes = ['1.2MB', '856KB', '2.1MB', '1.5MB', '3.2MB', '945KB'];
        return sizes[Math.floor(Math.random() * sizes.length)];
    }

    // 导出记录管理
    loadExportLogs() {
        // 初始化一些示例导出记录
        this.exportLogs = [
            {
                id: 1,
                time: '2024-01-15 14:30:25',
                reportName: '月度纪检监督报告',
                conditions: '本月数据',
                user: 'admin',
                format: 'PDF',
                fileSize: '2.1MB'
            },
            {
                id: 2,
                time: '2024-01-15 10:15:42',
                reportName: '供应商风险榜',
                conditions: '本季度数据',
                user: 'admin',
                format: 'XLSX',
                fileSize: '1.5MB'
            },
            {
                id: 3,
                time: '2024-01-14 16:45:18',
                reportName: '自助查询结果',
                conditions: '项目A, 高风险',
                user: 'admin',
                format: 'CSV',
                fileSize: '856KB'
            }
        ];
    }

    refreshExportLogs() {
        const tableBody = document.getElementById('export-logs-body');
        if (!tableBody) return;

        tableBody.innerHTML = this.exportLogs.map(log => `
            <tr>
                <td>${log.time}</td>
                <td>${log.reportName}</td>
                <td title="${log.conditions}">${this.truncateText(log.conditions, 30)}</td>
                <td>${log.user}</td>
                <td><span class="badge bg-primary">${log.format}</span></td>
                <td>${log.fileSize}</td>
            </tr>
        `).join('');
    }

    searchLogs() {
        const searchTerm = document.getElementById('logs-search').value.toLowerCase();
        const filteredLogs = this.exportLogs.filter(log => 
            log.reportName.toLowerCase().includes(searchTerm) ||
            log.user.toLowerCase().includes(searchTerm)
        );
        
        this.displayFilteredLogs(filteredLogs);
    }

    filterLogsByTime() {
        const timeFilter = document.getElementById('logs-time-filter').value;
        const now = new Date();
        let filteredLogs = this.exportLogs;

        switch (timeFilter) {
            case 'today':
                filteredLogs = this.exportLogs.filter(log => {
                    const logDate = new Date(log.time);
                    return logDate.toDateString() === now.toDateString();
                });
                break;
            case 'week':
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                filteredLogs = this.exportLogs.filter(log => new Date(log.time) >= weekAgo);
                break;
            case 'month':
                const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                filteredLogs = this.exportLogs.filter(log => new Date(log.time) >= monthAgo);
                break;
        }

        this.displayFilteredLogs(filteredLogs);
    }

    displayFilteredLogs(logs) {
        const tableBody = document.getElementById('export-logs-body');
        if (!tableBody) return;

        tableBody.innerHTML = logs.map(log => `
            <tr>
                <td>${log.time}</td>
                <td>${log.reportName}</td>
                <td title="${log.conditions}">${this.truncateText(log.conditions, 30)}</td>
                <td>${log.user}</td>
                <td><span class="badge bg-primary">${log.format}</span></td>
                <td>${log.fileSize}</td>
            </tr>
        `).join('');
    }

    // 工具方法
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    showToast(message) {
        const toastElement = document.getElementById('export-toast');
        const toastBody = document.getElementById('toast-message');
        
        if (toastBody) {
            toastBody.textContent = message;
        }
        
        if (toastElement) {
            const toast = new bootstrap.Toast(toastElement);
            toast.show();
        }
    }
}

// 全局函数
function goHome() {
    window.location.href = 'index.html';
}

function generatePreview(reportType) {
    if (window.reportCenter) {
        window.reportCenter.generatePreview(reportType);
    }
}

function exportReport(format) {
    if (window.reportCenter) {
        window.reportCenter.exportReport(format);
    }
}

function exportPreview(format) {
    if (window.reportCenter) {
        window.reportCenter.exportPreview(format);
    }
}

function executeQuery() {
    if (window.reportCenter) {
        window.reportCenter.executeQuery();
    }
}

function resetQuery() {
    if (window.reportCenter) {
        window.reportCenter.resetQuery();
    }
}

function exportQueryResults(format) {
    if (window.reportCenter) {
        window.reportCenter.exportQueryResults(format);
    }
}

function searchLogs() {
    if (window.reportCenter) {
        window.reportCenter.searchLogs();
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    window.reportCenter = new ReportCenter();
});
