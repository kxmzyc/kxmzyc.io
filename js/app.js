// ==================== 全局状态 ====================
let currentUser = null;
let userData = {
    admin: { username: 'admin', password: '123456', role: 'admin', realName: '管理员' },
    staff: { username: 'staff', password: '123456', role: 'staff', realName: '张三' },
    manager: { username: 'manager', password: '123456', role: 'department', realName: '李主任' }
};

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadLoginPage();
});

// ==================== 事件监听器初始化 ====================
function initializeEventListeners() {
    // 登录表单
    document.getElementById('login-form').addEventListener('submit', handleLogin);

    // 导航菜单
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            switchModule(this.dataset.module);
        });
    });

    // 退出登录
    document.getElementById('logout-btn').addEventListener('click', handleLogout);

    // 过滤按钮
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            filterReviews(this.dataset.filter);
        });
    });

    // 标签按钮
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });

    // 模态对话框关闭
    document.getElementById('modal-overlay').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
}

// ==================== 登录功能 ====================
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    // 验证用户
    if (userData[username] && userData[username].password === password && userData[username].role === role) {
        currentUser = userData[username];
        showMainPage();
    } else {
        alert('用户名、密码或角色错误');
    }
}

function showMainPage() {
    document.getElementById('login-page').classList.remove('active');
    document.getElementById('main-page').classList.add('active');
    
    // 更新用户信息
    document.getElementById('user-name').textContent = currentUser.realName;
    document.getElementById('user-role').textContent = getRoleText(currentUser.role);
    
    // 设置初始模块
    switchModule('dashboard');
}

function getRoleText(role) {
    const roleMap = {
        'admin': '管理员',
        'staff': '员工',
        'department': '部门主管'
    };
    return roleMap[role] || '用户';
}

function loadLoginPage() {
    document.getElementById('login-page').classList.add('active');
    document.getElementById('main-page').classList.remove('active');
}

function handleLogout() {
    currentUser = null;
    document.getElementById('login-form').reset();
    loadLoginPage();
    // 清除表单
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('role').value = '';
}

// ==================== 模块切换 ====================
function switchModule(moduleName) {
    // 移除所有活跃模块
    document.querySelectorAll('main section').forEach(section => {
        section.classList.remove('active');
    });

    // 移除所有活跃导航项
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // 激活选中的模块和导航项
    const module = document.getElementById(moduleName);
    if (module) {
        module.classList.add('active');
    }

    const navItem = document.querySelector(`[data-module="${moduleName}"]`);
    if (navItem) {
        navItem.classList.add('active');
    }
}

// ==================== 表单模态框 ====================
function openModal(title, content) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = content;
    document.getElementById('modal-overlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}

// ==================== 报表表单 ====================
function openReportForm() {
    const formContent = `
        <form onsubmit="submitReportForm(event)">
            <div class="form-group">
                <label for="report-name">报表名称</label>
                <input type="text" id="report-name" placeholder="例如：2025年11月月度报表" required>
            </div>
            <div class="form-group">
                <label for="report-type">报表类型</label>
                <select id="report-type" required>
                    <option value="">请选择</option>
                    <option value="monthly">月报表</option>
                    <option value="quarterly">季度报表</option>
                    <option value="annual">年度报表</option>
                </select>
            </div>
            <div class="form-group">
                <label for="report-department">所属部门</label>
                <select id="report-department" required>
                    <option value="">请选择</option>
                    <option value="admin">行政部</option>
                    <option value="hr">人事部</option>
                    <option value="finance">财务部</option>
                    <option value="academic">教务部</option>
                </select>
            </div>
            <div class="form-group">
                <label for="report-deadline">截止日期</label>
                <input type="date" id="report-deadline" required>
            </div>
            <div class="form-group">
                <label for="report-content">报表内容</label>
                <textarea id="report-content" placeholder="输入报表内容..." required></textarea>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-small" onclick="closeModal()">取消</button>
                <button type="submit" class="btn btn-primary btn-small">提交</button>
            </div>
        </form>
    `;
    openModal('新建报表', formContent);
}

function submitReportForm(event) {
    event.preventDefault();
    alert('报表已提交！');
    closeModal();
}

// ==================== 请假表单 ====================
function openLeaveForm() {
    const formContent = `
        <form onsubmit="submitLeaveForm(event)">
            <div class="form-group">
                <label for="leave-type">请假类型</label>
                <select id="leave-type" required>
                    <option value="">请选择</option>
                    <option value="annual">年假</option>
                    <option value="sick">病假</option>
                    <option value="personal">事假</option>
                    <option value="bereavement">丧假</option>
                    <option value="marriage">婚假</option>
                </select>
            </div>
            <div class="form-group">
                <label for="leave-start">起始日期</label>
                <input type="date" id="leave-start" required>
            </div>
            <div class="form-group">
                <label for="leave-end">结束日期</label>
                <input type="date" id="leave-end" required>
            </div>
            <div class="form-group">
                <label for="leave-days">请假天数</label>
                <input type="number" id="leave-days" placeholder="自动计算" readonly>
            </div>
            <div class="form-group">
                <label for="leave-reason">请假原因</label>
                <textarea id="leave-reason" placeholder="输入请假原因..." required></textarea>
            </div>
            <div class="form-group">
                <label for="leave-contact">联系电话</label>
                <input type="tel" id="leave-contact" placeholder="请输入联系电话" required>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-small" onclick="closeModal()">取消</button>
                <button type="submit" class="btn btn-primary btn-small">提交申请</button>
            </div>
        </form>
    `;
    openModal('新建请假申请', formContent);

    // 自动计算天数
    setTimeout(() => {
        const startInput = document.getElementById('leave-start');
        const endInput = document.getElementById('leave-end');
        const daysInput = document.getElementById('leave-days');

        if (startInput && endInput) {
            startInput.addEventListener('change', calculateLeaveDays);
            endInput.addEventListener('change', calculateLeaveDays);

            function calculateLeaveDays() {
                const start = new Date(startInput.value);
                const end = new Date(endInput.value);
                if (start && end && end >= start) {
                    const days = (end - start) / (1000 * 60 * 60 * 24) + 1;
                    daysInput.value = days;
                }
            }
        }
    }, 100);
}

function submitLeaveForm(event) {
    event.preventDefault();
    alert('请假申请已提交，等待审批！');
    closeModal();
}

// ==================== 报修表单 ====================
function openRepairForm() {
    const formContent = `
        <form onsubmit="submitRepairForm(event)">
            <div class="form-group">
                <label for="repair-type">维修类型</label>
                <select id="repair-type" required>
                    <option value="">请选择</option>
                    <option value="ac">空调维修</option>
                    <option value="electric">电气维修</option>
                    <option value="plumbing">水暖维修</option>
                    <option value="furniture">家具维修</option>
                    <option value="door">门窗维修</option>
                    <option value="other">其他</option>
                </select>
            </div>
            <div class="form-group">
                <label for="repair-location">维修位置</label>
                <input type="text" id="repair-location" placeholder="例如：A栋305教室" required>
            </div>
            <div class="form-group">
                <label for="repair-description">问题描述</label>
                <textarea id="repair-description" placeholder="详细描述维修问题..." required></textarea>
            </div>
            <div class="form-group">
                <label for="repair-priority">优先级</label>
                <select id="repair-priority" required>
                    <option value="">请选择</option>
                    <option value="high">高</option>
                    <option value="medium">中</option>
                    <option value="low">低</option>
                </select>
            </div>
            <div class="form-group">
                <label for="repair-contact">联系电话</label>
                <input type="tel" id="repair-contact" placeholder="请输入联系电话" required>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-small" onclick="closeModal()">取消</button>
                <button type="submit" class="btn btn-primary btn-small">提交报修</button>
            </div>
        </form>
    `;
    openModal('新建报修申请', formContent);
}

function submitRepairForm(event) {
    event.preventDefault();
    alert('报修申请已提交，维修人员将尽快处理！');
    closeModal();
}

// ==================== 材料审核 ====================
function filterReviews(filterType) {
    // 更新活跃按钮
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // 过滤卡片
    const cards = document.querySelectorAll('.review-card');
    cards.forEach(card => {
        const status = card.dataset.status;
        if (filterType === 'all') {
            card.style.display = 'block';
        } else if (filterType === 'pending' && status === 'pending') {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function approveReview(button) {
    const card = button.closest('.review-card');
    const header = card.querySelector('.review-header h3');
    alert(`已批准申请：${header.textContent}`);
    
    // 更新状态
    const badge = card.querySelector('.badge');
    badge.textContent = '已批准';
    badge.className = 'badge badge-approved';
    card.dataset.status = 'approved';
    
    // 禁用按钮
    button.disabled = true;
    button.nextElementSibling.disabled = true;
}

function rejectReview(button) {
    const card = button.closest('.review-card');
    const header = card.querySelector('.review-header h3');
    const reason = prompt(`请输入驳回理由 (${header.textContent}):`);
    
    if (reason !== null) {
        alert(`已驳回申请：${header.textContent}\n驳回原因：${reason}`);
        
        // 更新状态
        const badge = card.querySelector('.badge');
        badge.textContent = '已驳回';
        badge.className = 'badge badge-rejected';
        card.dataset.status = 'rejected';
        
        // 禁用按钮
        button.previousElementSibling.disabled = true;
        button.disabled = true;
    }
}

// ==================== 标签切换 ====================
function switchTab(tabName) {
    // 更新活跃按钮
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // 这里可以添加标签内容切换的逻辑
    console.log('Switched to tab:', tabName);
}

// ==================== 搜索功能 ====================
document.addEventListener('DOMContentLoaded', function() {
    const searchBox = document.querySelector('.search-box');
    if (searchBox) {
        searchBox.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const tableRows = document.querySelectorAll('.data-table tbody tr');
            
            tableRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
});

// ==================== 响应式菜单 ====================
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

// ==================== 工具函数 ====================
function formatDate(date) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('zh-CN', options);
}

function showNotification(message, type = 'success') {
    // 可以在这里添加通知提示的逻辑
    console.log(`[${type}] ${message}`);
}

// ==================== 导出功能（可选） ====================
function exportToCSV(elementId, fileName) {
    const table = document.getElementById(elementId);
    if (!table) return;

    let csv = [];
    const rows = table.querySelectorAll('tr');
    
    rows.forEach(row => {
        const cols = row.querySelectorAll('td, th');
        const csvRow = [];
        cols.forEach(col => {
            csvRow.push('"' + col.textContent + '"');
        });
        csv.push(csvRow.join(','));
    });

    downloadCSV(csv.join('\n'), fileName);
}

function downloadCSV(csv, fileName) {
    const link = document.createElement('a');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
