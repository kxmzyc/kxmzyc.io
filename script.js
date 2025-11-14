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
    // 图片轮播逻辑
    // ============================================
    const imageCarousel = {
        currentSlide: 0,
        totalSlides: 3,
        autoPlayInterval: null,
        autoPlayDelay: 4000, // 4秒自动切换
        touchStartX: 0,
        touchEndX: 0,
        
        init: function() {
            const slides = document.querySelectorAll('.image-slide');
            const indicators = document.querySelectorAll('.indicator');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            
            if (slides.length === 0) return;
            
            this.totalSlides = slides.length;
            
            // 隐藏加载提示，显示轮播
            if (loadingIndicator) {
                loadingIndicator.classList.add('hidden');
            }
            if (robotContainer) {
                robotContainer.classList.add('loaded');
            }
            
            // 上一张按钮
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    this.prevSlide();
                });
            }
            
            // 下一张按钮
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    this.nextSlide();
                });
            }
            
            // 指示器点击
            indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => {
                    this.goToSlide(index);
                });
            });
            
            // 自动播放
            this.startAutoPlay();
            
            // 鼠标悬停时暂停自动播放
            const carousel = document.querySelector('.image-carousel');
            if (carousel) {
                carousel.addEventListener('mouseenter', () => {
                    this.stopAutoPlay();
                });
                
                carousel.addEventListener('mouseleave', () => {
                    this.startAutoPlay();
                });
                
                // 触摸滑动支持（移动端）
                const self = this;
                carousel.addEventListener('touchstart', function(e) {
                    self.touchStartX = e.changedTouches[0].screenX;
                });
                
                carousel.addEventListener('touchend', function(e) {
                    self.touchEndX = e.changedTouches[0].screenX;
                    self.handleSwipe();
                });
            }
        },
        
        handleSwipe: function() {
            const swipeThreshold = 50;
            const diff = this.touchStartX - this.touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // 向左滑动，下一张
                    this.nextSlide();
                } else {
                    // 向右滑动，上一张
                    this.prevSlide();
                }
            }
        },
        
        goToSlide: function(index) {
            const slides = document.querySelectorAll('.image-slide');
            const indicators = document.querySelectorAll('.indicator');
            
            // 更新当前索引
            this.currentSlide = index;
            
            // 更新幻灯片
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            
            // 更新指示器
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === index);
            });
        },
        
        nextSlide: function() {
            const nextIndex = (this.currentSlide + 1) % this.totalSlides;
            this.goToSlide(nextIndex);
        },
        
        prevSlide: function() {
            const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
            this.goToSlide(prevIndex);
        },
        
        startAutoPlay: function() {
            this.stopAutoPlay();
            this.autoPlayInterval = setInterval(() => {
                this.nextSlide();
            }, this.autoPlayDelay);
        },
        
        stopAutoPlay: function() {
            if (this.autoPlayInterval) {
                clearInterval(this.autoPlayInterval);
                this.autoPlayInterval = null;
            }
        }
    };
    
    // 初始化图片轮播
    imageCarousel.init();

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

