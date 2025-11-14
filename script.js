// ============================================
// 页面交互逻辑
// ============================================

// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取关键元素
    const startBtn = document.getElementById('startBtn');
    const heroSection = document.querySelector('.hero-section');
    const aiAgentSection = document.getElementById('aiAgentSection');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const robotContainer = document.getElementById('robotContainer');

    // ============================================
    // 检查是否已经点击过按钮（使用 sessionStorage）
    // ============================================
    const hasStarted = sessionStorage.getItem('heroSectionHidden');
    if (hasStarted === 'true' && heroSection) {
        // 如果已经点击过，直接完全隐藏 Hero Section（不显示动画）
        heroSection.classList.add('hidden');
        heroSection.classList.add('hidden-complete');
        // 启用页面滚动
        document.body.classList.remove('no-scroll');
        // 确保页面滚动到顶部（因为 Hero Section 已隐藏）
        window.scrollTo(0, 0);
    } else {
        // 如果 Hero Section 还在显示，禁用页面滚动
        document.body.classList.add('no-scroll');
        
        // 防止鼠标滚轮、触摸滑动和键盘滚动
        const preventScroll = function(e) {
            e.preventDefault();
        };
        
        const preventKeyScroll = function(e) {
            // 阻止方向键、Page Up/Down、Home/End、空格键等滚动
            const scrollKeys = [32, 33, 34, 35, 36, 37, 38, 39, 40]; // 空格、Page Up/Down、Home/End、方向键
            if (scrollKeys.includes(e.keyCode)) {
                e.preventDefault();
            }
        };
        
        // 监听滚轮事件
        window.addEventListener('wheel', preventScroll, { passive: false });
        // 监听触摸滑动事件（移动端）
        window.addEventListener('touchmove', preventScroll, { passive: false });
        // 监听键盘滚动事件
        window.addEventListener('keydown', preventKeyScroll, { passive: false });
        
        // 保存事件监听器，以便后续移除
        window._preventScrollHandlers = {
            wheel: preventScroll,
            touchmove: preventScroll,
            keydown: preventKeyScroll
        };
    }

    // ============================================
    // 按钮点击跳转功能
    // ============================================
    if (startBtn && aiAgentSection && heroSection) {
        startBtn.addEventListener('click', function() {
            // 记录用户已点击按钮
            sessionStorage.setItem('heroSectionHidden', 'true');
            
            // 移除滚动阻止事件监听器
            if (window._preventScrollHandlers) {
                window.removeEventListener('wheel', window._preventScrollHandlers.wheel);
                window.removeEventListener('touchmove', window._preventScrollHandlers.touchmove);
                window.removeEventListener('keydown', window._preventScrollHandlers.keydown);
                delete window._preventScrollHandlers;
            }
            
            // 启用页面滚动（允许滚动到其他内容）
            document.body.classList.remove('no-scroll');
            
            // 先隐藏 Hero Section（触发动画）
            heroSection.classList.add('hidden');
            
            // 等待动画完成后完全隐藏并滚动到 AI 区域
            setTimeout(function() {
                // 完全隐藏，不占用空间
                heroSection.classList.add('hidden-complete');
                
                // 平滑滚动到 AI 智能体区域
                aiAgentSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 500); // 等待 CSS 过渡动画完成（0.5s）
        });
    }

    // ============================================
    // 机器人加载提示逻辑
    // ============================================
    if (robotContainer && loadingIndicator) {
        // 监听 iframe 加载完成（如果 SDK 创建了 iframe）
        const checkRobotLoaded = setInterval(function() {
            // 检查容器内是否有内容加载
            const iframe = robotContainer.querySelector('iframe');
            if (iframe) {
                iframe.addEventListener('load', function() {
                    // iframe 加载完成后隐藏加载提示
                    setTimeout(function() {
                        loadingIndicator.classList.add('hidden');
                        robotContainer.classList.add('loaded');
                        clearInterval(checkRobotLoaded);
                    }, 500);
                });
                
                // 如果 iframe 已经加载完成
                if (iframe.complete) {
                    setTimeout(function() {
                        loadingIndicator.classList.add('hidden');
                        robotContainer.classList.add('loaded');
                        clearInterval(checkRobotLoaded);
                    }, 500);
                }
            }
        }, 500);

        // 10 秒后强制隐藏加载提示（防止一直显示）
        setTimeout(function() {
            loadingIndicator.classList.add('hidden');
            robotContainer.classList.add('loaded');
            clearInterval(checkRobotLoaded);
        }, 10000);
    }

    // ============================================
    // 滚动动画增强
    // ============================================
    // 为功能卡片添加滚动进入动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
                // 添加一个类来标记已动画过
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // 观察所有功能卡片
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(function(card, index) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px) scale(0.95)';
        card.style.transition = `opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
        observer.observe(card);
    });

    // ============================================
    // 按钮点击反馈增强
    // ============================================
    if (startBtn) {
        // 添加点击波纹效果（可选）
        startBtn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(function() {
                ripple.remove();
            }, 600);
        });
    }
});

// ============================================
// 页面性能优化：延迟加载非关键资源
// ============================================
// 如果页面滚动到底部，可以预加载一些资源（当前项目不需要）

// ============================================
// 错误处理
// ============================================
window.addEventListener('error', function(e) {
    console.error('页面错误:', e.error);
    // 可以在这里添加错误上报逻辑
});

// 监听机器人 SDK 加载错误
window.addEventListener('unhandledrejection', function(e) {
    console.error('未处理的 Promise 拒绝:', e.reason);
});

