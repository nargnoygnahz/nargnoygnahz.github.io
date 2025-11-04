// 全局变量
let particles = [];
let canvas;
let radarChart;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeMobileMenu();
    initializeInvolutionTool();
    initializeScrollEffects();
    initializeP5Background();
});

// 初始化动画效果
function initializeAnimations() {
    // Hero文字动画
    anime({
        targets: '#hero-text',
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 1500,
        easing: 'easeOutExpo',
        delay: 500
    });

    // 卡片入场动画
    anime({
        targets: '.glass-card',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        easing: 'easeOutExpo',
        delay: anime.stagger(200)
    });

    // 技能条动画
    setTimeout(() => {
        animateSkillBars();
    }, 1000);
}

// 技能条动画
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.bg-blue-500, .bg-green-500, .bg-purple-500, .bg-orange-500, .bg-teal-500, .bg-red-500');
    skillBars.forEach((bar, index) => {
        const width = bar.style.width;
        // bar.style.width = '0%';
        anime({
            targets: bar,
            width: width,
            duration: 1000,
            easing: 'easeOutExpo',
            delay: index * 100
        });
    });
}

// 移动端菜单
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

// 内卷工具初始化
function initializeInvolutionTool() {
    const sliders = document.querySelectorAll('input[type="range"]');
    
    sliders.forEach(slider => {
        slider.addEventListener('input', updateInvolutionAnalysis);
    });
    
    // 初始化雷达图
    initializeRadarChart();
    updateInvolutionAnalysis();
}

// 初始化雷达图
function initializeRadarChart() {
    const chartDom = document.getElementById('radar-chart');
    if (!chartDom) return;
    
    radarChart = echarts.init(chartDom);
    
    const option = {
        backgroundColor: 'transparent',
        radar: {
            indicator: [
                { name: '工作强度', max: 100 },
                { name: '学习投入', max: 100 },
                { name: '社交频率', max: 100 },
                { name: '休息时间', max: 100 },
                { name: '运动健身', max: 100 }
            ],
            shape: 'polygon',
            splitNumber: 4,
            axisName: {
                color: '#fff',
                fontSize: 12
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.2)'
                }
            },
            splitArea: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                }
            }
        },
        series: [{
            name: '内卷指数',
            type: 'radar',
            data: [{
                value: [70, 60, 40, 30, 20],
                name: '当前状态',
                areaStyle: {
                    color: 'rgba(231, 126, 34, 0.3)'
                },
                lineStyle: {
                    color: '#E67E22',
                    width: 2
                },
                itemStyle: {
                    color: '#E67E22'
                }
            }]
        }]
    };
    
    radarChart.setOption(option);
    
    // 响应式调整
    window.addEventListener('resize', function() {
        if (radarChart) {
            radarChart.resize();
        }
    });
}

// 更新内卷分析
function updateInvolutionAnalysis() {
    const workIntensity = document.getElementById('work-intensity').value;
    const learning = document.getElementById('learning').value;
    const social = document.getElementById('social').value;
    const rest = document.getElementById('rest').value;
    const exercise = document.getElementById('exercise').value;
    
    // 计算内卷指数
    const involutionScore = Math.round((parseInt(workIntensity) + parseInt(learning) + parseInt(social) + parseInt(rest) + parseInt(exercise)) / 5);
    document.getElementById('involution-score').textContent = involutionScore;
    
    // 更新雷达图
    if (radarChart) {
        const option = {
            series: [{
                data: [{
                    value: [workIntensity, learning, social, rest, exercise],
                    name: '当前状态'
                }]
            }]
        };
        radarChart.setOption(option);
    }
    
    // 更新建议
    updateSuggestions(workIntensity, learning, social, rest, exercise);
}

// 更新建议
function updateSuggestions(work, learning, social, rest, exercise) {
    const suggestions = document.getElementById('suggestions');
    if (!suggestions) return;
    
    const workNum = parseInt(work);
    const learningNum = parseInt(learning);
    const socialNum = parseInt(social);
    const restNum = parseInt(rest);
    const exerciseNum = parseInt(exercise);
    
    let newSuggestions = [];
    
    // 工作建议
    if (workNum > 80) {
        newSuggestions.push({
            title: '工作优化',
            content: '工作强度过高，建议适当减少工作时间，关注工作效率而非工作时长。',
            color: 'red'
        });
    } else if (workNum < 30) {
        newSuggestions.push({
            title: '工作提升',
            content: '可以适当增加工作投入，但要确保工作有意义且能带来成长。',
            color: 'blue'
        });
    }
    
    // 学习建议
    if (learningNum > 80) {
        newSuggestions.push({
            title: '学习调整',
            content: '学习投入很好，但要注意避免知识焦虑，注重实践应用。',
            color: 'green'
        });
    } else if (learningNum < 30) {
        newSuggestions.push({
            title: '学习增强',
            content: '建议增加学习时间，持续学习是应对变化的最佳方式。',
            color: 'purple'
        });
    }
    
    // 社交建议
    if (socialNum > 70) {
        newSuggestions.push({
            title: '社交平衡',
            content: '社交活动很丰富，记得给自己留一些独处思考的时间。',
            color: 'orange'
        });
    } else if (socialNum < 30) {
        newSuggestions.push({
            title: '社交拓展',
            content: '适当增加社交活动，建立有意义的人际关系网络。',
            color: 'teal'
        });
    }
    
    // 休息建议
    if (restNum < 30) {
        newSuggestions.push({
            title: '休息提醒',
            content: '休息时间不足会影响长期表现，建议保证充足睡眠。',
            color: 'yellow'
        });
    }
    
    // 运动建议
    if (exerciseNum < 30) {
        newSuggestions.push({
            title: '健康建议',
            content: '增加运动量，身体健康是应对内卷的基础。',
            color: 'pink'
        });
    }
    
    // 更新DOM
    suggestions.innerHTML = '';
    newSuggestions.forEach((suggestion, index) => {
        const div = document.createElement('div');
        div.className = `suggestion-card bg-${suggestion.color}-500/20 border border-${suggestion.color}-400/30 rounded-lg p-4`;
        div.innerHTML = `
            <h4 class="font-semibold text-${suggestion.color}-300 mb-2">${suggestion.title}</h4>
            <p class="text-sm text-gray-300">${suggestion.content}</p>
        `;
        suggestions.appendChild(div);
        
        // 添加动画
        anime({
            targets: div,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 500,
            easing: 'easeOutExpo',
            delay: index * 100
        });
    });
}

// 滚动效果
function initializeScrollEffects() {
    // 平滑滚动
    window.scrollToSection = function(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    };
    
    // 滚动时的视差效果
    let ticking = false;
    
    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // 视差背景效果
        const heroSection = document.querySelector('section');
        if (heroSection) {
            heroSection.style.transform = `translateY(${rate}px)`;
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// P5.js背景动画
function initializeP5Background() {
    new p5(function(p) {
        let particles = [];
        let numParticles = 50;
        
        p.setup = function() {
            const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
            canvas.id('p5-canvas');
            canvas.parent(document.body);
            
            // 初始化粒子
            for (let i = 0; i < numParticles; i++) {
                particles.push({
                    x: p.random(p.width),
                    y: p.random(p.height),
                    vx: p.random(-0.5, 0.5),
                    vy: p.random(-0.5, 0.5),
                    size: p.random(2, 6),
                    opacity: p.random(0.1, 0.3)
                });
            }
        };
        
        p.draw = function() {
            p.clear();
            
            // 绘制粒子
            particles.forEach(particle => {
                p.fill(231, 126, 34, particle.opacity * 255);
                p.noStroke();
                p.circle(particle.x, particle.y, particle.size);
                
                // 更新位置
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // 边界检测
                if (particle.x < 0 || particle.x > p.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > p.height) particle.vy *= -1;
            });
            
            // 绘制连线
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dist = p.dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                    if (dist < 100) {
                        const alpha = p.map(dist, 0, 100, 0.1, 0);
                        p.stroke(22, 160, 133, alpha * 255);
                        p.strokeWeight(1);
                        p.line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                    }
                }
            }
        };
        
        p.windowResized = function() {
            p.resizeCanvas(p.windowWidth, p.windowHeight);
        };
    });
}

// 工具函数：防抖
function debounce(func, wait) {
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

// 工具函数：节流
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 页面可见性API - 优化性能
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // 页面隐藏时暂停动画
        anime.running.forEach(animation => animation.pause());
    } else {
        // 页面显示时恢复动画
        anime.running.forEach(animation => animation.play());
    }
});

// 错误处理
window.addEventListener('error', function(e) {
    console.error('页面错误:', e.error);
});

// 加载完成提示
window.addEventListener('load', function() {
    console.log('杨铭昊内卷网加载完成');
});