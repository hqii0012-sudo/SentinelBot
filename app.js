// API 基础地址配置
// 部署到 GitHub Pages 时，请将此地址修改为您的 Render 后端地址
// 例如：https://your-app-name.onrender.com
const API_BASE = 'https://integrity-backend-pkwr.onrender.com';

/**
 * 通用的API调用封装
 * @param {string} path - API路径
 * @param {object} body - 请求体数据
 * @returns {Promise<object>} 返回JSON响应或错误信息
 */
async function api(path, body) {
    try {
        // 如果路径已经是完整URL，直接使用；否则拼接API_BASE
        const fullPath = path.startsWith('http') ? path : `${API_BASE}${path}`;
        
        const response = await fetch(fullPath, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body || {})
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API调用失败:', error);
        return { error: error.message };
    }
}

/**
 * GET请求封装
 * @param {string} path - API路径
 * @returns {Promise<object>} 返回JSON响应或错误信息
 */
async function apiGet(path) {
    try {
        // 如果路径已经是完整URL，直接使用；否则拼接API_BASE
        const fullPath = path.startsWith('http') ? path : `${API_BASE}${path}`;
        
        const response = await fetch(fullPath);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API调用失败:', error);
        return { error: error.message };
    }
}

// 导出到全局作用域，供页面使用
window.api = api;
window.apiGet = apiGet;

// MaxKB浮窗模式 - 不需要自定义的悬浮按钮逻辑
// MaxKB会自动创建和管理悬浮按钮和聊天窗口

// 国际化功能
class I18nManager {
    constructor() {
        this.currentLang = 'zh-CN';
        this.translations = {
            'zh-CN': {
                'system.title': '工程监督平台',
                'system.subtitle': 'Integrity Supervisor',
                'nav.home': '首页',
                'nav.ai_qa': 'AI问答',
                'nav.kinship': '关系梳理',
                'nav.related_transactions': '关联交易',
                'nav.shadow_shareholders': '影子股东',
                'nav.micro_power': '微权力',
                'nav.supplier_profile': '供应商画像',
                'nav.design_traceability': '设计追溯',
                'nav.compliance_dashboard': '合规看板',
                'nav.alert_center': '告警中心',
                'nav.report_center': '报表中心',
                'nav.system_management': '系统管理',
                'banner.title': '守护工程清廉，助力合规发展',
                'banner.supplier_risk': '供应商风险榜',
                'banner.bidding_progress': '招投标进度',
                'banner.compliance_report': '合规报告',
                'stats.supplier_total': '供应商总数',
                'stats.high_risk_alerts': '高风险告警',
                'stats.ongoing_bidding': '进行中招标',
                'stats.compliance_rate': '合规通过率',
                'stats.monthly_change': '较上月 {value}',
                'footer.copyright': '© 2025 工程监督工具 Integrity Supervisor',
                'footer.privacy_policy': '数据安全合规声明',
                'footer.contact_us': '联系我们',
                'footer.feedback': '问题反馈',
                'footer.privacy': '隐私政策',
                'footer.terms': '使用条款',
                'footer.help_center': '帮助中心',
                'footer.api_docs': 'API 文档'
            },
            'en-US': {
                'system.title': 'Integrity Supervisor',
                'system.subtitle': 'Engineering Supervision Platform',
                'nav.home': 'Home',
                'nav.ai_qa': 'AI Q&A',
                'nav.kinship': 'Kinship Analysis',
                'nav.related_transactions': 'Related Transactions',
                'nav.shadow_shareholders': 'Shadow Shareholders',
                'nav.micro_power': 'Micro Power',
                'nav.supplier_profile': 'Supplier Profile',
                'nav.design_traceability': 'Design Traceability',
                'nav.compliance_dashboard': 'Compliance Dashboard',
                'nav.alert_center': 'Alert Center',
                'nav.report_center': 'Report Center',
                'nav.system_management': 'System Management',
                'banner.title': 'Guard Engineering Integrity, Promote Compliance Development',
                'banner.supplier_risk': 'Supplier Risk Ranking',
                'banner.bidding_progress': 'Bidding Progress',
                'banner.compliance_report': 'Compliance Report',
                'stats.supplier_total': 'Total Suppliers',
                'stats.high_risk_alerts': 'High Risk Alerts',
                'stats.ongoing_bidding': 'Ongoing Bidding',
                'stats.compliance_rate': 'Compliance Rate',
                'stats.monthly_change': 'vs last month {value}',
                'footer.copyright': '© 2025 Integrity Supervisor Engineering Platform',
                'footer.privacy_policy': 'Data Security Compliance',
                'footer.contact_us': 'Contact Us',
                'footer.feedback': 'Feedback',
                'footer.privacy': 'Privacy Policy',
                'footer.terms': 'Terms of Service',
                'footer.help_center': 'Help Center',
                'footer.api_docs': 'API Documentation'
            }
        };
        this.init();
    }

    init() {
        // 从localStorage加载保存的语言设置
        const savedLang = localStorage.getItem('preferred-language');
        if (savedLang && this.translations[savedLang]) {
            this.currentLang = savedLang;
        }

        // 初始化语言切换器
        this.initLanguageSwitcher();
        
        // 应用当前语言
        this.applyLanguage();
    }

    initLanguageSwitcher() {
        const languageBtn = document.querySelector('.language-btn');
        const languageMenu = document.querySelector('.language-menu');
        const languageOptions = document.querySelectorAll('.language-option');

        if (!languageBtn || !languageMenu) return;

        // 点击语言按钮切换菜单
        languageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = languageBtn.getAttribute('aria-expanded') === 'true';
            languageBtn.setAttribute('aria-expanded', !isExpanded);
            languageMenu.classList.toggle('show', !isExpanded);
        });

        // 点击语言选项
        languageOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const lang = option.getAttribute('data-lang');
                this.setLanguage(lang);
                this.closeLanguageMenu();
            });
        });

        // 点击外部关闭菜单
        document.addEventListener('click', (e) => {
            if (!languageBtn.contains(e.target) && !languageMenu.contains(e.target)) {
                this.closeLanguageMenu();
            }
        });

        // 键盘导航
        languageBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                languageBtn.click();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                languageMenu.classList.add('show');
                languageOptions[0].focus();
            }
        });

        languageOptions.forEach((option, index) => {
            option.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    option.click();
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextIndex = (index + 1) % languageOptions.length;
                    languageOptions[nextIndex].focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevIndex = index === 0 ? languageOptions.length - 1 : index - 1;
                    languageOptions[prevIndex].focus();
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    this.closeLanguageMenu();
                    languageBtn.focus();
                }
            });
        });
    }

    closeLanguageMenu() {
        const languageBtn = document.querySelector('.language-btn');
        const languageMenu = document.querySelector('.language-menu');
        
        if (languageBtn && languageMenu) {
            languageBtn.setAttribute('aria-expanded', 'false');
            languageMenu.classList.remove('show');
        }
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('preferred-language', lang);
            this.applyLanguage();
            this.updateLanguageMenu();
        }
    }

    updateLanguageMenu() {
        const languageOptions = document.querySelectorAll('.language-option');
        languageOptions.forEach(option => {
            const lang = option.getAttribute('data-lang');
            const checkIcon = option.querySelector('i');
            
            if (lang === this.currentLang) {
                option.classList.add('active');
                if (checkIcon) checkIcon.classList.remove('d-none');
            } else {
                option.classList.remove('active');
                if (checkIcon) checkIcon.classList.add('d-none');
            }
        });
    }

    applyLanguage() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const params = element.getAttribute('data-i18n-params');
            
            if (this.translations[this.currentLang] && this.translations[this.currentLang][key]) {
                let text = this.translations[this.currentLang][key];
                
                // 处理插值参数
                if (params) {
                    try {
                        const paramObj = JSON.parse(params);
                        Object.keys(paramObj).forEach(paramKey => {
                            text = text.replace(`{${paramKey}}`, paramObj[paramKey]);
                        });
                    } catch (e) {
                        console.warn('Invalid i18n params:', params);
                    }
                }
                
                element.textContent = text;
            }
        });
    }

    // 统一刷新方法
    refresh() {
        this.applyLanguage();
        this.updateLanguageMenu();
    }
}

// 页脚弹窗和交互功能
class FooterInteractions {
    constructor() {
        this.init();
    }

    init() {
        this.initModalHandlers();
        this.initDrawerHandlers();
        this.initFormHandlers();
        this.initHelpCenterHandlers();
    }

    // Modal 处理
    initModalHandlers() {
        // 数据安全合规声明和隐私政策
        document.querySelectorAll('[data-modal="privacy"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const modal = new bootstrap.Modal(document.getElementById('privacyModal'));
                modal.show();
            });
        });

        // 使用条款
        document.querySelectorAll('[data-modal="terms"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const modal = new bootstrap.Modal(document.getElementById('termsModal'));
                modal.show();
            });
        });

        // 我已阅读按钮
        document.getElementById('privacyReadBtn')?.addEventListener('click', () => {
            console.log('用户已阅读数据安全合规声明');
            const modal = bootstrap.Modal.getInstance(document.getElementById('privacyModal'));
            modal.hide();
        });

        document.getElementById('termsReadBtn')?.addEventListener('click', () => {
            console.log('用户已阅读使用条款');
            const modal = bootstrap.Modal.getInstance(document.getElementById('termsModal'));
            modal.hide();
        });
    }

    // Drawer 处理
    initDrawerHandlers() {
        const drawer = document.getElementById('contactDrawer');
        const drawerTitle = document.getElementById('drawerTitle');
        const contactType = document.getElementById('contactType');
        const submitBtn = document.getElementById('submitBtn');
        const contactForm = document.getElementById('contactForm');
        const contactFile = document.getElementById('contactFile');
        const fileList = document.getElementById('fileList');

        // 联系我们
        document.querySelectorAll('[data-drawer="contact"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('ux:contact_open');
                this.openDrawer('联系我们', 'general');
            });
        });

        // 问题反馈
        document.querySelectorAll('[data-drawer="feedback"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('ux:contact_open');
                this.openDrawer('问题反馈', 'bug');
            });
        });

        // 关闭 Drawer
        document.querySelectorAll('[data-drawer-close="contact"]').forEach(btn => {
            btn.addEventListener('click', () => {
                console.log('ux:contact_close');
                this.closeDrawer();
            });
        });

        // 点击背景关闭
        document.querySelector('.drawer-backdrop')?.addEventListener('click', () => {
            console.log('ux:contact_close');
            this.closeDrawer();
        });

        // ESC 键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && drawer.classList.contains('show')) {
                console.log('ux:contact_close');
                this.closeDrawer();
            }
        });

        // 表单字段变化时验证
        const formFields = contactForm.querySelectorAll('input, select, textarea');
        formFields.forEach(field => {
            field.addEventListener('input', () => {
                this.validateField(field);
                this.updateSubmitButton();
            });
            
            field.addEventListener('blur', () => {
                this.validateField(field);
                this.updateSubmitButton();
            });
        });

        // 文件上传处理
        contactFile.addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files);
        });

        // 提交按钮
        submitBtn.addEventListener('click', () => {
            this.handleFormSubmit();
        });
    }

    openDrawer(title, defaultType) {
        const drawer = document.getElementById('contactDrawer');
        const drawerTitle = document.getElementById('drawerTitle');
        const contactType = document.getElementById('contactType');
        const contactName = document.getElementById('contactName');
        const successAlert = document.getElementById('successAlert');

        drawerTitle.textContent = title;
        contactType.value = defaultType;
        
        // 清空表单和错误状态
        this.resetForm();
        contactType.value = defaultType;
        
        // 隐藏成功提示
        successAlert.classList.add('d-none');

        drawer.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // 聚焦到姓名字段
        setTimeout(() => {
            contactName.focus();
        }, 300);
    }

    closeDrawer() {
        const drawer = document.getElementById('contactDrawer');
        drawer.classList.remove('show');
        document.body.style.overflow = '';
        
        // 重置表单
        this.resetForm();
    }

    resetForm() {
        const form = document.getElementById('contactForm');
        const successAlert = document.getElementById('successAlert');
        const fileList = document.getElementById('fileList');
        
        form.reset();
        successAlert.classList.add('d-none');
        fileList.innerHTML = '';
        
        // 清除所有验证状态
        const fields = form.querySelectorAll('.form-control, .form-select');
        fields.forEach(field => {
            field.classList.remove('is-invalid');
        });
        
        this.updateSubmitButton();
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // 必填字段验证
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = field.getAttribute('data-error') || '此字段为必填项';
        }

        // 邮箱格式验证
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = '请输入有效的邮箱地址';
            }
        }

        // 更新字段状态
        if (isValid) {
            field.classList.remove('is-invalid');
        } else {
            field.classList.add('is-invalid');
        }

        // 更新错误消息
        const errorElement = field.parentNode.querySelector('.invalid-feedback');
        if (errorElement) {
            errorElement.textContent = errorMessage;
        }

        return isValid;
    }

    updateSubmitButton() {
        const form = document.getElementById('contactForm');
        const submitBtn = document.getElementById('submitBtn');
        const requiredFields = form.querySelectorAll('[required]');
        
        let allValid = true;
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                allValid = false;
            }
        });
        
        submitBtn.disabled = !allValid;
    }

    handleFileUpload(files) {
        const fileList = document.getElementById('fileList');
        fileList.innerHTML = '';
        
        Array.from(files).forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <span class="file-name">${file.name}</span>
                <button type="button" class="file-remove" data-file-name="${file.name}">
                    <i class="bi bi-x"></i>
                </button>
            `;
            fileList.appendChild(fileItem);
        });
        
        // 绑定删除按钮事件
        fileList.querySelectorAll('.file-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.parentElement.remove();
            });
        });
    }

    handleFormSubmit() {
        const form = document.getElementById('contactForm');
        const successAlert = document.getElementById('successAlert');
        const submitBtn = document.getElementById('submitBtn');
        
        // 验证所有字段
        const requiredFields = form.querySelectorAll('[required]');
        let allValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                allValid = false;
            }
        });
        
        if (!allValid) {
            return;
        }
        
        // 收集表单数据
        const formData = new FormData(form);
        const payload = {
            timestamp: new Date().toISOString(),
            name: formData.get('name'),
            email: formData.get('email'),
            type: formData.get('type'),
            description: formData.get('description'),
            files: Array.from(formData.getAll('file')).map(file => file.name)
        };
        
        console.log('feedback', payload);
        
        // 保存到 localStorage
        try {
            localStorage.setItem('feedback:last', JSON.stringify(payload));
        } catch (e) {
            console.warn('无法保存到 localStorage:', e);
        }
        
        // 显示成功提示
        successAlert.classList.remove('d-none');
        submitBtn.disabled = true;
        
        console.log('ux:contact_submit_success');
        
        // 1.5秒后自动关闭
        setTimeout(() => {
            this.closeDrawer();
        }, 1500);
    }


    // 表单处理（已集成到 Drawer 处理中）
    initFormHandlers() {
        // 表单处理逻辑已移到 initDrawerHandlers 中
    }

    // 帮助中心处理
    initHelpCenterHandlers() {
        // 帮助中心链接点击事件
        const helpCenterLink = document.getElementById('helpCenterLink');
        if (helpCenterLink) {
            helpCenterLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.openHelpModal();
            });
        }

        // 帮助中心联系我们按钮
        const helpContactBtn = document.getElementById('helpContactBtn');
        if (helpContactBtn) {
            helpContactBtn.addEventListener('click', () => {
                this.closeHelpModal();
                // 延迟一点时间再打开联系我们 Drawer
                setTimeout(() => {
                    this.openDrawer('联系我们', 'general');
                }, 300);
            });
        }

        // ESC 键关闭帮助中心 Modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const helpModal = document.getElementById('helpModal');
                if (helpModal && helpModal.classList.contains('show')) {
                    this.closeHelpModal();
                }
            }
        });
    }

    openHelpModal() {
        const modal = new bootstrap.Modal(document.getElementById('helpModal'));
        modal.show();
    }

    closeHelpModal() {
        const modal = bootstrap.Modal.getInstance(document.getElementById('helpModal'));
        if (modal) {
            modal.hide();
        }
    }


    showSuccessMessage() {
        // 创建成功提示
        const alert = document.createElement('div');
        alert.className = 'alert alert-success alert-dismissible fade show position-fixed';
        alert.style.cssText = 'top: 20px; right: 20px; z-index: 1070; min-width: 300px;';
        alert.innerHTML = `
            <i class="bi bi-check-circle me-2"></i>
            提交成功！我们会尽快回复您。
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alert);
        
        // 3秒后自动移除
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 3000);
    }

    // API 提交（预留）
    async submitToAPI(formData) {
        try {
            const response = await api('/api/feedback', formData);
            if (response.error) {
                throw new Error(response.error);
            }
            console.log('API 提交成功:', response);
        } catch (error) {
            console.error('API 提交失败:', error);
            this.showErrorMessage(error.message);
        }
    }

    showErrorMessage(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger alert-dismissible fade show position-fixed';
        alert.style.cssText = 'top: 20px; right: 20px; z-index: 1070; min-width: 300px;';
        alert.innerHTML = `
            <i class="bi bi-exclamation-triangle me-2"></i>
            提交失败：${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 5000);
    }
}

// 系统管理页面功能
class SystemManager {
    constructor() {
        this.currentSection = 'users';
        this.init();
    }

    init() {
        // 初始化导航点击事件
        this.initNavigation();
        
        // 初始化表单事件
        this.initForms();
        
        // 加载初始数据
        this.loadData();
        
        // 初始化温度滑块
        this.initTemperatureSlider();
    }

    initNavigation() {
        const navLinks = document.querySelectorAll('.system-nav .nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.switchSection(section);
            });
        });
    }

    switchSection(section) {
        // 更新导航状态
        document.querySelectorAll('.system-nav .nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // 切换内容区域
        document.querySelectorAll('.content-section').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${section}-content`).classList.add('active');

        this.currentSection = section;
    }

    initForms() {
        // 安全设置表单
        const securityForm = document.getElementById('security-form');
        if (securityForm) {
            securityForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.showToast('安全设置已保存', 'success');
            });
        }

        // 通知设置表单
        const notificationForm = document.getElementById('notification-form');
        if (notificationForm) {
            notificationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.showToast('通知设置已保存', 'success');
            });
        }

        // 模型设置表单
        const modelForm = document.getElementById('model-form');
        if (modelForm) {
            modelForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.showToast('模型设置已保存', 'success');
            });
        }

        // 重建索引按钮
        const rebuildBtn = document.getElementById('rebuild-index');
        if (rebuildBtn) {
            rebuildBtn.addEventListener('click', () => {
                this.showToast('开始重建索引，请稍候...', 'info');
                // 模拟重建过程
                setTimeout(() => {
                    this.showToast('索引重建完成', 'success');
                }, 3000);
            });
        }
    }

    initTemperatureSlider() {
        const temperatureSlider = document.getElementById('temperature');
        const temperatureValue = document.getElementById('temperature-value');
        
        if (temperatureSlider && temperatureValue) {
            temperatureSlider.addEventListener('input', (e) => {
                temperatureValue.textContent = e.target.value;
            });
        }
    }

    loadData() {
        this.loadUsersData();
        this.loadMenuData();
        this.loadAuditData();
        this.loadIntegrationsData();
    }

    loadUsersData() {
        const usersData = [
            { username: 'admin', role: '系统管理员', status: 'active' },
            { username: 'manager1', role: '项目经理', status: 'active' },
            { username: 'user1', role: '普通用户', status: 'inactive' },
            { username: 'auditor1', role: '审计员', status: 'active' },
            { username: 'viewer1', role: '查看者', status: 'pending' }
        ];

        const tbody = document.getElementById('users-table-body');
        if (tbody) {
            tbody.innerHTML = usersData.map(user => `
                <tr>
                    <td>${user.username}</td>
                    <td>${user.role}</td>
                    <td><span class="status-badge status-${user.status}">${this.getStatusText(user.status)}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary me-1">编辑</button>
                        <button class="btn btn-sm btn-outline-danger">删除</button>
                    </td>
                </tr>
            `).join('');
        }
    }

    loadMenuData() {
        const menuData = [
            { key: 'nav.home', chinese: '首页', english: 'Home' },
            { key: 'nav.ai_qa', chinese: 'AI问答', english: 'AI Q&A' },
            { key: 'nav.kinship', chinese: '关系梳理', english: 'Kinship Analysis' },
            { key: 'nav.related_transactions', chinese: '关联交易', english: 'Related Transactions' },
            { key: 'nav.shadow_shareholders', chinese: '影子股东', english: 'Shadow Shareholders' },
            { key: 'nav.micro_power', chinese: '微权力', english: 'Micro Power' },
            { key: 'nav.supplier_profile', chinese: '供应商画像', english: 'Supplier Profile' },
            { key: 'nav.design_traceability', chinese: '设计追溯', english: 'Design Traceability' },
            { key: 'nav.compliance_dashboard', chinese: '合规看板', english: 'Compliance Dashboard' },
            { key: 'nav.alert_center', chinese: '告警中心', english: 'Alert Center' },
            { key: 'nav.report_center', chinese: '报表中心', english: 'Report Center' },
            { key: 'nav.system_management', chinese: '系统管理', english: 'System Management' }
        ];

        const tbody = document.getElementById('menu-table-body');
        if (tbody) {
            tbody.innerHTML = menuData.map(item => `
                <tr>
                    <td><code>${item.key}</code></td>
                    <td><input type="text" class="form-control form-control-sm" value="${item.chinese}"></td>
                    <td><input type="text" class="form-control form-control-sm" value="${item.english}"></td>
                </tr>
            `).join('');
        }
    }

    loadAuditData() {
        const auditData = [
            { time: '2025-01-15 14:30:25', user: 'admin', action: '登录系统', ip: '192.168.1.100' },
            { time: '2025-01-15 14:25:10', user: 'manager1', action: '修改用户权限', ip: '192.168.1.101' },
            { time: '2025-01-15 14:20:45', user: 'auditor1', action: '查看审计日志', ip: '192.168.1.102' },
            { time: '2025-01-15 14:15:30', user: 'admin', action: '更新系统配置', ip: '192.168.1.100' },
            { time: '2025-01-15 14:10:15', user: 'user1', action: '登录系统', ip: '192.168.1.103' },
            { time: '2025-01-15 14:05:00', user: 'manager1', action: '导出数据', ip: '192.168.1.101' }
        ];

        const tbody = document.getElementById('audit-table-body');
        if (tbody) {
            tbody.innerHTML = auditData.map(log => `
                <tr>
                    <td>${log.time}</td>
                    <td>${log.user}</td>
                    <td>${log.action}</td>
                    <td><code>${log.ip}</code></td>
                </tr>
            `).join('');
        }
    }

    loadIntegrationsData() {
        const integrationsData = [
            { name: 'MaxKB API', service: 'AI问答', keyMask: 'ef85a1c2****', status: 'active' },
            { name: 'Tianyancha API', service: '企业查询', keyMask: 'tyc_****', status: 'active' },
            { name: 'DeepSeek API', service: 'AI模型', keyMask: 'sk-****', status: 'inactive' },
            { name: 'Email Service', service: '邮件通知', keyMask: 'smtp_****', status: 'active' }
        ];

        const tbody = document.getElementById('integrations-table-body');
        if (tbody) {
            tbody.innerHTML = integrationsData.map(integration => `
                <tr>
                    <td>${integration.name}</td>
                    <td>${integration.service}</td>
                    <td><code>${integration.keyMask}</code></td>
                    <td><span class="status-badge status-${integration.status}">${this.getStatusText(integration.status)}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary me-1">编辑</button>
                        <button class="btn btn-sm btn-outline-danger">删除</button>
                    </td>
                </tr>
            `).join('');
        }
    }

    getStatusText(status) {
        const statusMap = {
            'active': '活跃',
            'inactive': '停用',
            'pending': '待审核'
        };
        return statusMap[status] || status;
    }

    showToast(message, type = 'info') {
        // 创建简单的提示框
        const toast = document.createElement('div');
        toast.className = `alert alert-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} alert-dismissible fade show position-fixed`;
        toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        toast.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(toast);
        
        // 自动移除
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }
}

// 关联交易页面功能
class RelatedPartyManager {
    constructor() {
        this.projectsData = [];
        this.filteredData = [];
        this.init();
    }

    init() {
        // 加载项目数据
        this.loadProjectsData();
        
        // 初始化规则筛选
        this.initRuleFilters();
        
        // 初始化表格
        this.renderTable();
        
        // 初始化按钮事件
        this.initButtons();
    }

    loadProjectsData() {
        this.projectsData = [
            {
                id: 1,
                name: '办公楼装修工程',
                riskLevel: 'high',
                rules: ['avoid_bidding', 'brand_specification'],
                details: {
                    evidence: '发现该工程未进行公开招标，直接指定了特定品牌的地板材料。',
                    rules: [
                        '规避公开招标：项目金额超过50万但未进行公开招标',
                        '指定品牌/参数指向：明确指定使用"XX品牌"地板，限制竞争'
                    ],
                    documents: ['招标文件', '中标通知书', '合同文件']
                }
            },
            {
                id: 2,
                name: '设备采购项目A',
                riskLevel: 'warning',
                rules: ['split_procurement'],
                details: {
                    evidence: '将原本一个大型设备采购项目拆分为多个小项目。',
                    rules: [
                        '拆分采购：将价值80万的设备采购拆分为4个20万的项目'
                    ],
                    documents: ['采购计划', '合同文件', '验收报告']
                }
            },
            {
                id: 3,
                name: '绿化景观工程',
                riskLevel: 'compliant',
                rules: [],
                details: {
                    evidence: '该项目严格按照规定进行公开招标，程序合规。',
                    rules: [],
                    documents: ['招标公告', '评标报告', '中标通知书']
                }
            },
            {
                id: 4,
                name: '网络设备采购',
                riskLevel: 'high',
                rules: ['expert_avoidance', 'related_detection'],
                details: {
                    evidence: '评标专家与投标企业存在关联关系，且未按规定回避。',
                    rules: [
                        '评标专家回避不当：专家张某与投标企业存在股权关系',
                        '关联关系检测：发现专家与中标企业有业务往来'
                    ],
                    documents: ['专家名单', '回避声明', '评标记录']
                }
            },
            {
                id: 5,
                name: '办公用品采购',
                riskLevel: 'compliant',
                rules: [],
                details: {
                    evidence: '采购程序规范，无违规行为。',
                    rules: [],
                    documents: ['采购申请', '比价记录', '合同文件']
                }
            },
            {
                id: 6,
                name: '安防系统安装',
                riskLevel: 'warning',
                rules: ['brand_specification'],
                details: {
                    evidence: '技术规格描述过于具体，指向特定品牌。',
                    rules: [
                        '指定品牌/参数指向：技术参数与某品牌产品完全匹配'
                    ],
                    documents: ['技术规格书', '招标文件', '投标文件']
                }
            }
        ];
        
        this.filteredData = [...this.projectsData];
        this.updateStats();
    }

    initRuleFilters() {
        const checkboxes = document.querySelectorAll('.rules-list input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.filterProjects();
            });
        });
    }

    filterProjects() {
        const activeRules = Array.from(document.querySelectorAll('.rules-list input[type="checkbox"]:checked'))
            .map(cb => cb.value);
        
        if (activeRules.length === 0) {
            this.filteredData = [];
        } else {
            this.filteredData = this.projectsData.filter(project => 
                project.rules.some(rule => activeRules.includes(rule))
            );
        }
        
        this.renderTable();
        this.updateStats();
    }

    updateStats() {
        const total = this.filteredData.length;
        const compliant = this.filteredData.filter(p => p.riskLevel === 'compliant').length;
        const risk = this.filteredData.filter(p => p.riskLevel !== 'compliant').length;
        
        document.getElementById('total-projects').textContent = total;
        document.getElementById('compliant-projects').textContent = compliant;
        document.getElementById('risk-projects').textContent = risk;
    }

    renderTable() {
        const tbody = document.getElementById('projects-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = this.filteredData.map(project => `
            <tr>
                <td>${project.name}</td>
                <td><span class="risk-badge risk-${project.riskLevel}">${this.getRiskLevelText(project.riskLevel)}</span></td>
                <td>${this.renderRulesBadges(project.rules)}</td>
                <td>
                    <button class="action-btn action-btn-primary" onclick="relatedPartyManager.toggleDetails(${project.id})">
                        查看详情
                    </button>
                </td>
            </tr>
            <tr id="detail-${project.id}" class="detail-row" style="display: none;">
                <td colspan="4">
                    <div class="detail-panel">
                        <h6>证据链说明：</h6>
                        <p>${project.details.evidence}</p>
                        <h6>命中规则详情：</h6>
                        <ul>
                            ${project.details.rules.map(rule => `<li>${rule}</li>`).join('')}
                        </ul>
                        <h6>相关文档：</h6>
                        <p>${project.details.documents.join('、')}</p>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    renderRulesBadges(rules) {
        const ruleNames = {
            'avoid_bidding': '规避招标',
            'split_procurement': '拆分采购',
            'brand_specification': '指定品牌',
            'expert_avoidance': '专家回避',
            'related_detection': '关联检测'
        };
        
        return rules.map(rule => 
            `<span class="rules-badge">${ruleNames[rule] || rule}</span>`
        ).join('');
    }

    getRiskLevelText(level) {
        const levelMap = {
            'compliant': '合规',
            'warning': '建议关注',
            'high': '高风险'
        };
        return levelMap[level] || level;
    }

    toggleDetails(projectId) {
        const detailRow = document.getElementById(`detail-${projectId}`);
        if (detailRow) {
            const isVisible = detailRow.style.display !== 'none';
            detailRow.style.display = isVisible ? 'none' : 'table-row';
        }
    }

    initButtons() {
        // 导出CSV按钮
        const exportBtn = document.getElementById('export-csv');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportToCSV();
            });
        }

        // 生成PDF按钮
        const generateBtn = document.getElementById('generate-pdf');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                this.generatePDF();
            });
        }
    }

    exportToCSV() {
        const csvContent = this.generateCSV();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', '关联交易排查结果.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showToast('CSV文件导出成功', 'success');
    }

    generateCSV() {
        const headers = ['项目名称', '风险等级', '命中规则', '检测时间'];
        const rows = this.filteredData.map(project => [
            project.name,
            this.getRiskLevelText(project.riskLevel),
            project.rules.join(';'),
            new Date().toLocaleDateString()
        ]);
        
        return [headers, ...rows].map(row => 
            row.map(field => `"${field}"`).join(',')
        ).join('\n');
    }

    generatePDF() {
        this.showToast('正在生成案件包PDF，请稍候...', 'info');
        
        // 模拟PDF生成过程
        setTimeout(() => {
            this.showToast('案件包PDF生成完成', 'success');
        }, 2000);
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `alert alert-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} alert-dismissible fade show position-fixed`;
        toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        toast.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }
}

// 影子股东识别页面功能
class ShadowShareholderManager {
    constructor() {
        this.companiesData = [];
        this.weakSignalsData = [];
        this.evidenceData = [];
        this.init();
    }

    init() {
        // 初始化按钮事件
        this.initButtons();
        
        // 加载示例数据
        this.loadSampleData();
        
        // 渲染初始状态
        this.updateStats();
    }

    initButtons() {
        // 导入CSV按钮
        const importBtn = document.getElementById('import-csv');
        const fileInput = document.getElementById('csv-file-input');
        
        if (importBtn && fileInput) {
            importBtn.addEventListener('click', () => {
                fileInput.click();
            });
            
            fileInput.addEventListener('change', (e) => {
                this.handleFileImport(e);
            });
        }

        // 开始检测按钮
        const startBtn = document.getElementById('start-detection');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startDetection();
            });
        }

        // 导出按钮
        const exportGraph = document.getElementById('export-graph');
        const exportList = document.getElementById('export-list');
        const exportPackage = document.getElementById('export-package');
        
        if (exportGraph) {
            exportGraph.addEventListener('click', () => this.exportGraph());
        }
        if (exportList) {
            exportList.addEventListener('click', () => this.exportList());
        }
        if (exportPackage) {
            exportPackage.addEventListener('click', () => this.exportPackage());
        }
    }

    handleFileImport(event) {
        const file = event.target.files[0];
        if (file) {
            this.showToast('CSV文件导入成功', 'success');
            // 模拟导入数据
            this.loadSampleData();
            this.updateStats();
        }
    }

    loadSampleData() {
        // 模拟企业数据
        this.companiesData = [
            { id: 1, name: '北京科技有限公司', code: '91110000123456789X', legal: '张三' },
            { id: 2, name: '上海贸易有限公司', code: '91310000987654321Y', legal: '李四' },
            { id: 3, name: '深圳投资有限公司', code: '91440300111222333Z', legal: '王五' },
            { id: 4, name: '广州实业有限公司', code: '91440100444555666A', legal: '赵六' },
            { id: 5, name: '杭州科技股份有限公司', code: '91330100777888999B', legal: '孙七' }
        ];

        // 模拟弱信号数据
        this.weakSignalsData = [
            {
                id: 1,
                company: '北京科技有限公司',
                features: ['相同地址', '相同电话', '相同邮箱'],
                riskLevel: 'high',
                similarity: 0.95
            },
            {
                id: 2,
                company: '上海贸易有限公司',
                features: ['相同代账公司', '相同域名'],
                riskLevel: 'medium',
                similarity: 0.78
            },
            {
                id: 3,
                company: '深圳投资有限公司',
                features: ['相同地址'],
                riskLevel: 'low',
                similarity: 0.45
            }
        ];

        // 模拟证据数据
        this.evidenceData = [
            {
                id: 1,
                company: '北京科技有限公司',
                evidence: {
                    address: '北京市朝阳区建国路88号',
                    phone: '010-12345678',
                    email: 'contact@company.com',
                    accounting: '北京会计服务有限公司',
                    domain: 'www.company.com'
                },
                source: '工商信息查询',
                status: 'pending'
            },
            {
                id: 2,
                company: '上海贸易有限公司',
                evidence: {
                    address: '上海市浦东新区陆家嘴环路1000号',
                    phone: '021-87654321',
                    email: 'info@trade.com',
                    accounting: '上海财务咨询有限公司',
                    domain: 'www.trade.com'
                },
                source: '企业信用信息公示系统',
                status: 'pending'
            }
        ];

        this.renderWeakSignalTable();
        this.renderEvidenceCards();
    }

    startDetection() {
        this.showToast('开始检测影子股东...', 'info');
        
        // 模拟检测过程
        setTimeout(() => {
            this.showToast('检测完成，发现3个疑似影子股东', 'success');
            this.updateStats();
        }, 2000);
    }

    updateStats() {
        const total = this.companiesData.length;
        const suspected = this.weakSignalsData.length;
        const confirmed = this.evidenceData.filter(e => e.status === 'confirmed').length;
        
        document.getElementById('total-companies').textContent = total;
        document.getElementById('suspected-count').textContent = suspected;
        document.getElementById('confirmed-count').textContent = confirmed;
    }

    renderWeakSignalTable() {
        const tbody = document.getElementById('weak-signal-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = this.weakSignalsData.map(signal => `
            <tr>
                <td>${signal.company}</td>
                <td>${signal.features.join('、')}</td>
                <td><span class="risk-badge risk-${signal.riskLevel}">${this.getRiskLevelText(signal.riskLevel)}</span></td>
                <td><span class="similarity-score">${(signal.similarity * 100).toFixed(1)}%</span></td>
            </tr>
        `).join('');
    }

    renderEvidenceCards() {
        const container = document.getElementById('evidence-cards-container');
        if (!container) return;
        
        container.innerHTML = this.evidenceData.map(evidence => `
            <div class="evidence-card ${evidence.status}" id="evidence-${evidence.id}">
                <div class="evidence-card-header">
                    <h6 class="evidence-card-title">${evidence.company}</h6>
                    <div class="evidence-card-actions">
                        <button class="btn btn-success btn-sm" onclick="shadowShareholderManager.confirmEvidence(${evidence.id})">
                            确认
                        </button>
                        <button class="btn btn-outline-secondary btn-sm" onclick="shadowShareholderManager.excludeEvidence(${evidence.id})">
                            排除
                        </button>
                    </div>
                </div>
                <div class="evidence-card-body">
                    <div class="evidence-field">
                        <span class="evidence-field-label">地址：</span>
                        <span class="evidence-field-value">${evidence.evidence.address}</span>
                    </div>
                    <div class="evidence-field">
                        <span class="evidence-field-label">电话：</span>
                        <span class="evidence-field-value">${evidence.evidence.phone}</span>
                    </div>
                    <div class="evidence-field">
                        <span class="evidence-field-label">邮箱：</span>
                        <span class="evidence-field-value">${evidence.evidence.email}</span>
                    </div>
                    <div class="evidence-field">
                        <span class="evidence-field-label">代账：</span>
                        <span class="evidence-field-value">${evidence.evidence.accounting}</span>
                    </div>
                    <div class="evidence-field">
                        <span class="evidence-field-label">域名：</span>
                        <span class="evidence-field-value">${evidence.evidence.domain}</span>
                    </div>
                </div>
                <div class="evidence-source">来源：${evidence.source}</div>
            </div>
        `).join('');
    }

    confirmEvidence(evidenceId) {
        const evidence = this.evidenceData.find(e => e.id === evidenceId);
        if (evidence) {
            evidence.status = 'confirmed';
            this.renderEvidenceCards();
            this.updateStats();
            this.showToast('已确认该证据', 'success');
        }
    }

    excludeEvidence(evidenceId) {
        const evidence = this.evidenceData.find(e => e.id === evidenceId);
        if (evidence) {
            evidence.status = 'excluded';
            this.renderEvidenceCards();
            this.updateStats();
            this.showToast('已排除该证据', 'info');
        }
    }

    getRiskLevelText(level) {
        const levelMap = {
            'high': '高风险',
            'medium': '中风险',
            'low': '低风险'
        };
        return levelMap[level] || level;
    }

    exportGraph() {
        this.showToast('正在导出关系图PNG...', 'info');
        setTimeout(() => {
            this.showToast('关系图PNG导出完成', 'success');
        }, 1500);
    }

    exportList() {
        this.showToast('正在导出命中清单CSV...', 'info');
        setTimeout(() => {
            this.showToast('命中清单CSV导出完成', 'success');
        }, 1500);
    }

    exportPackage() {
        this.showToast('正在生成案件包PDF...', 'info');
        setTimeout(() => {
            this.showToast('案件包PDF生成完成', 'success');
        }, 2000);
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `alert alert-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} alert-dismissible fade show position-fixed`;
        toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        toast.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }
}

// 微权力清单与拦截页面功能
class MicroPowerManager {
    constructor() {
        this.sensitiveActions = [];
        this.stats = {};
        this.triggerRecords = [];
        this.init();
    }

    init() {
        // 初始化按钮事件
        this.initButtons();
        
        // 加载示例数据
        this.loadSampleData();
        
        // 渲染初始状态
        this.renderAll();
    }

    initButtons() {
        // 新增动作按钮
        const addBtn = document.getElementById('add-action');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.showToast('新增动作功能开发中...', 'info');
            });
        }

        // 导出按钮
        const exportCsv = document.getElementById('export-csv');
        const exportPdf = document.getElementById('export-pdf');
        
        if (exportCsv) {
            exportCsv.addEventListener('click', () => this.exportCsv());
        }
        if (exportPdf) {
            exportPdf.addEventListener('click', () => this.exportPdf());
        }
    }

    loadSampleData() {
        // 模拟敏感动作数据
        this.sensitiveActions = [
            {
                id: 1,
                name: '新增非常规供应商',
                process: '供应商管理',
                description: '在非标准流程下添加新的供应商信息'
            },
            {
                id: 2,
                name: '频繁合同变更',
                process: '合同管理',
                description: '短时间内多次修改合同条款和金额'
            },
            {
                id: 3,
                name: '异常付款节奏',
                process: '财务管理',
                description: '不按正常周期进行付款操作'
            },
            {
                id: 4,
                name: '权限异常提升',
                process: '权限管理',
                description: '临时提升用户权限超出正常范围'
            },
            {
                id: 5,
                name: '数据批量导出',
                process: '数据管理',
                description: '大量导出敏感业务数据'
            }
        ];

        // 模拟统计数据
        this.stats = {
            totalActions: this.sensitiveActions.length,
            activeActions: this.sensitiveActions.length,
            monthlyTriggers: 23,
            disposalRate: 87.5
        };

        // 模拟触发记录数据
        this.triggerRecords = [
            {
                id: 1,
                action: '新增非常规供应商',
                responsible: '张三',
                status: 'disposed',
                time: '2025-01-15 14:30:25'
            },
            {
                id: 2,
                action: '频繁合同变更',
                responsible: '李四',
                status: 'pending',
                time: '2025-01-15 13:45:10'
            },
            {
                id: 3,
                action: '异常付款节奏',
                responsible: '王五',
                status: 'high-risk',
                time: '2025-01-15 12:20:45'
            },
            {
                id: 4,
                action: '权限异常提升',
                responsible: '赵六',
                status: 'disposed',
                time: '2025-01-15 11:15:30'
            },
            {
                id: 5,
                action: '数据批量导出',
                responsible: '孙七',
                status: 'pending',
                time: '2025-01-15 10:30:15'
            },
            {
                id: 6,
                action: '频繁合同变更',
                responsible: '周八',
                status: 'disposed',
                time: '2025-01-15 09:45:00'
            }
        ];
    }

    renderAll() {
        this.renderSensitiveActions();
        this.renderStats();
        this.renderTriggerRecords();
    }

    renderSensitiveActions() {
        const tbody = document.getElementById('sensitive-actions-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = this.sensitiveActions.map(action => `
            <tr>
                <td title="${action.name}">${action.name}</td>
                <td title="${action.process}">${action.process}</td>
                <td title="${action.description}">${action.description}</td>
                <td>
                    <button class="table-action-btn btn-primary" onclick="microPowerManager.editAction(${action.id})" title="编辑">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="table-action-btn btn-danger" onclick="microPowerManager.deleteAction(${action.id})" title="删除">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    renderStats() {
        document.getElementById('total-actions').textContent = this.stats.totalActions;
        document.getElementById('monthly-triggers').textContent = this.stats.monthlyTriggers;
        document.getElementById('disposal-rate').textContent = this.stats.disposalRate + '%';
        
        // 更新左侧边栏统计
        document.getElementById('sidebar-total-actions').textContent = this.stats.totalActions;
        document.getElementById('sidebar-active-actions').textContent = this.stats.activeActions || this.stats.totalActions;
    }

    renderTriggerRecords() {
        const tbody = document.getElementById('trigger-records-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = this.triggerRecords.map(record => `
            <tr>
                <td>${record.action}</td>
                <td>${record.responsible}</td>
                <td><span class="status-badge status-${record.status}">${this.getStatusText(record.status)}</span></td>
                <td>${record.time}</td>
            </tr>
        `).join('');
    }

    getStatusText(status) {
        const statusMap = {
            'disposed': '已处置',
            'pending': '待确认',
            'high-risk': '高风险未处置'
        };
        return statusMap[status] || status;
    }

    editAction(actionId) {
        const action = this.sensitiveActions.find(a => a.id === actionId);
        if (action) {
            this.showToast(`编辑动作：${action.name}`, 'info');
        }
    }

    deleteAction(actionId) {
        const action = this.sensitiveActions.find(a => a.id === actionId);
        if (action) {
            if (confirm(`确定要删除动作"${action.name}"吗？`)) {
                this.sensitiveActions = this.sensitiveActions.filter(a => a.id !== actionId);
                this.renderSensitiveActions();
                this.showToast('动作已删除', 'success');
            }
        }
    }

    exportCsv() {
        this.showToast('正在导出审计日志CSV...', 'info');
        setTimeout(() => {
            this.showToast('已导出CSV', 'success');
        }, 1500);
    }

    exportPdf() {
        this.showToast('正在生成PDF报告...', 'info');
        setTimeout(() => {
            this.showToast('已导出PDF', 'success');
        }, 2000);
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `alert alert-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} alert-dismissible fade show position-fixed`;
        toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        toast.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }
}

// 微权力清单与拦截页面翻译数据
const microPowerTranslations = {
    'zh-CN': {
        'micro_power.page_title': '微权力清单与拦截',
        'micro_power.sensitive_actions': '敏感动作清单',
        'micro_power.add_action': '新增动作',
        'micro_power.action_name': '动作名称',
        'micro_power.process': '所属流程',
        'micro_power.description': '描述',
        'micro_power.actions': '操作',
        'micro_power.total_actions': '清单总数',
        'micro_power.monthly_triggers': '本月触发次数',
        'micro_power.disposal_rate': '已处置率',
        'micro_power.trigger_records': '实时触发记录',
        'micro_power.action': '动作',
        'micro_power.responsible': '责任人',
        'micro_power.status': '状态',
        'micro_power.time': '时间',
        'micro_power.export_info': '选择导出格式：',
        'micro_power.export_csv': '导出审计日志 CSV',
        'micro_power.export_pdf': '导出 PDF',
        'micro_power.back_to_home': '返回首页',
        'micro_power.manage_actions': '管理敏感操作规则',
        'micro_power.active_actions': '活跃'
    },
    'en-US': {
        'micro_power.page_title': 'Micro Power List & Interception',
        'micro_power.sensitive_actions': 'Sensitive Actions List',
        'micro_power.add_action': 'Add Action',
        'micro_power.action_name': 'Action Name',
        'micro_power.process': 'Process',
        'micro_power.description': 'Description',
        'micro_power.actions': 'Actions',
        'micro_power.total_actions': 'Total Actions',
        'micro_power.monthly_triggers': 'Monthly Triggers',
        'micro_power.disposal_rate': 'Disposal Rate',
        'micro_power.trigger_records': 'Real-time Trigger Records',
        'micro_power.action': 'Action',
        'micro_power.responsible': 'Responsible',
        'micro_power.status': 'Status',
        'micro_power.time': 'Time',
        'micro_power.export_info': 'Select export format:',
        'micro_power.export_csv': 'Export Audit Log CSV',
        'micro_power.export_pdf': 'Export PDF',
        'micro_power.back_to_home': 'Back to Home',
        'micro_power.manage_actions': 'Manage sensitive operation rules',
        'micro_power.active_actions': 'Active'
    }
};

// 影子股东识别页面翻译数据
const shadowShareholderTranslations = {
    'zh-CN': {
        'shadow_shareholder.page_title': '影子股东识别',
        'shadow_shareholder.data_input': '数据输入',
        'shadow_shareholder.import_csv': '导入企业数据 CSV',
        'shadow_shareholder.import_tips': '支持格式：企业名称、统一社会信用代码、法人代表等',
        'shadow_shareholder.config_options': '配置选项',
        'shadow_shareholder.penetration_level': '穿透层级',
        'shadow_shareholder.weak_signal_detection': '弱信号检测',
        'shadow_shareholder.signal_address': '地址',
        'shadow_shareholder.signal_phone': '电话',
        'shadow_shareholder.signal_email': '邮箱',
        'shadow_shareholder.signal_accounting': '代账',
        'shadow_shareholder.signal_domain': '域名',
        'shadow_shareholder.start_detection': '开始检测',
        'shadow_shareholder.total_companies': '检测企业数',
        'shadow_shareholder.suspected_count': '疑似影子股东数',
        'shadow_shareholder.confirmed_count': '已确认数',
        'shadow_shareholder.relationship_graph': '股权关系图',
        'shadow_shareholder.graph_placeholder': 'Graph Placeholder',
        'shadow_shareholder.graph_desc': '股权穿透关系可视化展示',
        'shadow_shareholder.weak_signal_results': '弱信号聚合结果',
        'shadow_shareholder.company_name': '企业名称',
        'shadow_shareholder.aggregated_features': '聚合特征',
        'shadow_shareholder.risk_level': '风险等级',
        'shadow_shareholder.similarity_score': '相似度',
        'shadow_shareholder.evidence_cards': '证据卡片',
        'shadow_shareholder.export_info': '选择导出格式：',
        'shadow_shareholder.export_graph': '导出关系图 PNG',
        'shadow_shareholder.export_list': '导出命中清单 CSV',
        'shadow_shareholder.export_package': '导出案件包 PDF',
        'shadow_shareholder.back_to_home': '返回首页'
    },
    'en-US': {
        'shadow_shareholder.page_title': 'Shadow Shareholder Detection',
        'shadow_shareholder.data_input': 'Data Input',
        'shadow_shareholder.import_csv': 'Import Company Data CSV',
        'shadow_shareholder.import_tips': 'Supported formats: Company name, Unified social credit code, Legal representative, etc.',
        'shadow_shareholder.config_options': 'Configuration Options',
        'shadow_shareholder.penetration_level': 'Penetration Level',
        'shadow_shareholder.weak_signal_detection': 'Weak Signal Detection',
        'shadow_shareholder.signal_address': 'Address',
        'shadow_shareholder.signal_phone': 'Phone',
        'shadow_shareholder.signal_email': 'Email',
        'shadow_shareholder.signal_accounting': 'Accounting',
        'shadow_shareholder.signal_domain': 'Domain',
        'shadow_shareholder.start_detection': 'Start Detection',
        'shadow_shareholder.total_companies': 'Total Companies',
        'shadow_shareholder.suspected_count': 'Suspected Shadow Shareholders',
        'shadow_shareholder.confirmed_count': 'Confirmed Count',
        'shadow_shareholder.relationship_graph': 'Equity Relationship Graph',
        'shadow_shareholder.graph_placeholder': 'Graph Placeholder',
        'shadow_shareholder.graph_desc': 'Visualization of equity penetration relationships',
        'shadow_shareholder.weak_signal_results': 'Weak Signal Aggregation Results',
        'shadow_shareholder.company_name': 'Company Name',
        'shadow_shareholder.aggregated_features': 'Aggregated Features',
        'shadow_shareholder.risk_level': 'Risk Level',
        'shadow_shareholder.similarity_score': 'Similarity Score',
        'shadow_shareholder.evidence_cards': 'Evidence Cards',
        'shadow_shareholder.export_info': 'Select export format:',
        'shadow_shareholder.export_graph': 'Export Graph PNG',
        'shadow_shareholder.export_list': 'Export Hit List CSV',
        'shadow_shareholder.export_package': 'Export Case Package PDF',
        'shadow_shareholder.back_to_home': 'Back to Home'
    }
};

// 关联交易页面翻译数据
const relatedPartyTranslations = {
    'zh-CN': {
        'related_party.page_title': '关联交易排查',
        'related_party.rules_title': '检测规则',
        'related_party.rule_avoid_bidding': '规避公开招标',
        'related_party.rule_split_procurement': '拆分采购',
        'related_party.rule_brand_specification': '指定品牌/参数指向',
        'related_party.rule_expert_avoidance': '评标专家回避不当',
        'related_party.rule_related_detection': '关联关系检测',
        'related_party.total_projects': '已检测项目数',
        'related_party.compliant_projects': '合规项目数',
        'related_party.risk_projects': '风险项目数',
        'related_party.projects_list': '项目列表',
        'related_party.project_name': '项目名称',
        'related_party.risk_level': '风险等级',
        'related_party.hit_rules': '命中规则',
        'related_party.actions': '操作',
        'related_party.export_csv': '导出结果 CSV',
        'related_party.generate_pdf': '生成案件包 PDF',
        'related_party.back_to_home': '返回首页'
    },
    'en-US': {
        'related_party.page_title': 'Related Party Transactions',
        'related_party.rules_title': 'Detection Rules',
        'related_party.rule_avoid_bidding': 'Avoid Public Bidding',
        'related_party.rule_split_procurement': 'Split Procurement',
        'related_party.rule_brand_specification': 'Brand/Specification Targeting',
        'related_party.rule_expert_avoidance': 'Expert Avoidance Issues',
        'related_party.rule_related_detection': 'Related Party Detection',
        'related_party.total_projects': 'Total Projects',
        'related_party.compliant_projects': 'Compliant Projects',
        'related_party.risk_projects': 'Risk Projects',
        'related_party.projects_list': 'Projects List',
        'related_party.project_name': 'Project Name',
        'related_party.risk_level': 'Risk Level',
        'related_party.hit_rules': 'Hit Rules',
        'related_party.actions': 'Actions',
        'related_party.export_csv': 'Export CSV',
        'related_party.generate_pdf': 'Generate PDF Package',
        'related_party.back_to_home': 'Back to Home'
    }
};

// 系统管理页面翻译数据
const systemTranslations = {
    'zh-CN': {
        'system.title': '工程监督平台',
        'system.subtitle': 'Integrity Supervisor',
        'system.management': '系统管理',
        'system.management_desc': '配置系统参数、管理用户权限、监控系统状态',
        'system.users_roles': '用户与角色',
        'system.menu_language': '菜单与语言',
        'system.security_audit': '安全与审计',
        'system.notifications': '通知',
        'system.integrations_keys': '集成与密钥',
        'system.models_knowledge': '模型与知识库',
        'system.add_user': '添加用户',
        'system.username': '用户名',
        'system.role': '角色',
        'system.status': '状态',
        'system.actions': '操作',
        'system.save_changes': '保存更改',
        'system.key': 'Key',
        'system.chinese': '中文',
        'system.english': 'English',
        'system.security_settings': '安全设置',
        'system.min_password_length': '最短密码长度',
        'system.two_factor_auth': '双因素认证',
        'system.enable_2fa': '启用 2FA',
        'system.save_settings': '保存设置',
        'system.audit_logs': '审计日志',
        'system.time': '时间',
        'system.user': '用户',
        'system.action': '动作',
        'system.ip_address': 'IP地址',
        'system.notification_settings': '通知设置',
        'system.in_app_notifications': '站内通知',
        'system.email_notifications': '邮件通知',
        'system.webhook_notifications': 'Webhook 通知',
        'system.save_notifications': '保存通知设置',
        'system.add_integration': '添加集成',
        'system.name': '名称',
        'system.service': '服务',
        'system.key_mask': '密钥掩码',
        'system.model_settings': '模型设置',
        'system.model_name': '模型名称',
        'system.temperature': '温度',
        'system.max_length': '最大长度',
        'system.save_model_settings': '保存模型设置',
        'system.knowledge_base': '知识库管理',
        'system.knowledge_base_desc': '管理知识库索引和文档',
        'system.rebuild_index': '立即重建索引',
        'system.rebuild_warning': '重建索引可能需要几分钟时间，请耐心等待。',
        'system.back_to_home': '返回首页'
    },
    'en-US': {
        'system.title': 'Integrity Supervisor',
        'system.subtitle': 'Engineering Supervision Platform',
        'system.management': 'System Management',
        'system.management_desc': 'Configure system parameters, manage user permissions, monitor system status',
        'system.users_roles': 'Users & Roles',
        'system.menu_language': 'Menu & Language',
        'system.security_audit': 'Security & Audit',
        'system.notifications': 'Notifications',
        'system.integrations_keys': 'Integrations & Keys',
        'system.models_knowledge': 'Models & Knowledge',
        'system.add_user': 'Add User',
        'system.username': 'Username',
        'system.role': 'Role',
        'system.status': 'Status',
        'system.actions': 'Actions',
        'system.save_changes': 'Save Changes',
        'system.key': 'Key',
        'system.chinese': 'Chinese',
        'system.english': 'English',
        'system.security_settings': 'Security Settings',
        'system.min_password_length': 'Minimum Password Length',
        'system.two_factor_auth': 'Two-Factor Authentication',
        'system.enable_2fa': 'Enable 2FA',
        'system.save_settings': 'Save Settings',
        'system.audit_logs': 'Audit Logs',
        'system.time': 'Time',
        'system.user': 'User',
        'system.action': 'Action',
        'system.ip_address': 'IP Address',
        'system.notification_settings': 'Notification Settings',
        'system.in_app_notifications': 'In-App Notifications',
        'system.email_notifications': 'Email Notifications',
        'system.webhook_notifications': 'Webhook Notifications',
        'system.save_notifications': 'Save Notification Settings',
        'system.add_integration': 'Add Integration',
        'system.name': 'Name',
        'system.service': 'Service',
        'system.key_mask': 'Key Mask',
        'system.model_settings': 'Model Settings',
        'system.model_name': 'Model Name',
        'system.temperature': 'Temperature',
        'system.max_length': 'Max Length',
        'system.save_model_settings': 'Save Model Settings',
        'system.knowledge_base': 'Knowledge Base Management',
        'system.knowledge_base_desc': 'Manage knowledge base index and documents',
        'system.rebuild_index': 'Rebuild Index Now',
        'system.rebuild_warning': 'Rebuilding index may take several minutes, please be patient.',
        'system.back_to_home': 'Back to Home'
    }
};

// 扩展I18nManager以支持系统管理页面和关联交易页面
if (typeof I18nManager !== 'undefined') {
    I18nManager.prototype.loadSystemTranslations = function() {
        // 合并系统管理页面的翻译
        Object.keys(systemTranslations).forEach(lang => {
            if (this.translations[lang]) {
                this.translations[lang] = { ...this.translations[lang], ...systemTranslations[lang] };
            }
        });
    };
    
    I18nManager.prototype.loadRelatedPartyTranslations = function() {
        // 合并关联交易页面的翻译
        Object.keys(relatedPartyTranslations).forEach(lang => {
            if (this.translations[lang]) {
                this.translations[lang] = { ...this.translations[lang], ...relatedPartyTranslations[lang] };
            }
        });
    };
    
    I18nManager.prototype.loadShadowShareholderTranslations = function() {
        // 合并影子股东识别页面的翻译
        Object.keys(shadowShareholderTranslations).forEach(lang => {
            if (this.translations[lang]) {
                this.translations[lang] = { ...this.translations[lang], ...shadowShareholderTranslations[lang] };
            }
        });
    };
    
    I18nManager.prototype.loadMicroPowerTranslations = function() {
        // 合并微权力清单与拦截页面的翻译
        Object.keys(microPowerTranslations).forEach(lang => {
            if (this.translations[lang]) {
                this.translations[lang] = { ...this.translations[lang], ...microPowerTranslations[lang] };
            }
        });
    };
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成，MaxKB浮窗模式已启用');
    
    // 初始化国际化功能
    window.i18nManager = new I18nManager();
    
    // 如果是系统管理页面，加载系统翻译并初始化系统管理功能
    if (document.querySelector('.system-container')) {
        window.i18nManager.loadSystemTranslations();
        window.systemManager = new SystemManager();
    }
    
    // 如果是关联交易页面，加载关联交易翻译并初始化关联交易功能
    if (document.querySelector('.related-party-container')) {
        window.i18nManager.loadRelatedPartyTranslations();
        window.relatedPartyManager = new RelatedPartyManager();
    }
    
    // 如果是影子股东识别页面，加载影子股东翻译并初始化影子股东功能
    if (document.querySelector('.shadow-shareholder-container')) {
        window.i18nManager.loadShadowShareholderTranslations();
        window.shadowShareholderManager = new ShadowShareholderManager();
    }
    
    // 如果是微权力清单与拦截页面，加载微权力翻译并初始化微权力功能
    if (document.querySelector('.micro-power-container')) {
        window.i18nManager.loadMicroPowerTranslations();
        window.microPowerManager = new MicroPowerManager();
    }
    
    // 初始化页脚交互功能
    new FooterInteractions();
    
    // 可以在这里添加其他页面初始化逻辑
    // MaxKB的浮窗会自动加载，无需手动初始化
});
