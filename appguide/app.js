// 应用状态管理
const AppState = {
    currentQuestionId: null,
    answers: {},
    progress: 0,
    
    // 初始化应用状态
    init: function() {
        this.loadFromStorage();
        
        // 如果没有保存的状态，从第一个问题开始
        if (!this.currentQuestionId || !appConfig.getQuestion(this.currentQuestionId)) {
            this.currentQuestionId = appConfig.getFirstQuestionId();
            this.answers = {};
            this.progress = 0;
        }
        
        this.updateProgress();
    },
    
    // 保存状态到本地存储
    saveToStorage: function() {
        const data = {
            currentQuestionId: this.currentQuestionId,
            answers: this.answers,
            flowVersion: appConfig.flowVersion,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem(appConfig.storageKey, JSON.stringify(data));
    },
    
    // 从本地存储加载状态
    loadFromStorage: function() {
        const saved = localStorage.getItem(appConfig.storageKey);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                
                // 检查流程版本是否匹配
                if (data.flowVersion === appConfig.flowVersion) {
                    this.currentQuestionId = data.currentQuestionId;
                    this.answers = data.answers || {};
                } else {
                    // 版本不匹配，重新开始
                    this.clearStorage();
                }
            } catch (e) {
                console.error("加载保存数据失败:", e);
                this.clearStorage();
            }
        }
    },
    
    // 清除存储
    clearStorage: function() {
        localStorage.removeItem(appConfig.storageKey);
        this.currentQuestionId = appConfig.getFirstQuestionId();
        this.answers = {};
        this.progress = 0;
    },
    
    // 记录答案
    setAnswer: function(questionId, value) {
        this.answers[questionId] = value;
        this.saveToStorage();
    },
    
    // 获取答案
    getAnswer: function(questionId) {
        return this.answers[questionId];
    },
    
    // 更新进度
    updateProgress: function() {
        if (this.currentQuestionId) {
            const currentIndex = appConfig.getCurrentStepIndex(this.currentQuestionId);
            this.progress = (currentIndex / appConfig.getTotalSteps()) * 100;
        } else {
            this.progress = 0;
        }
    },
    
    // 跳转到下一个问题
    goToNextQuestion: function() {
        const currentAnswer = this.getAnswer(this.currentQuestionId);
        if (!currentAnswer) return false;
        
        const nextId = appConfig.getNextQuestionId(this.currentQuestionId, currentAnswer);
        if (nextId === "complete") {
            return "complete";
        } else if (nextId) {
            this.currentQuestionId = nextId;
            this.saveToStorage();
            this.updateProgress();
            return true;
        }
        return false;
    },
    
    // 跳转到上一个问题
    goToPrevQuestion: function() {
        const currentIndex = appConfig.workflow.findIndex(q => q.id === this.currentQuestionId);
        if (currentIndex > 0) {
            this.currentQuestionId = appConfig.workflow[currentIndex - 1].id;
            this.saveToStorage();
            this.updateProgress();
            return true;
        }
        return false;
    },
    
    // 重置所有答案
    reset: function() {
        this.clearStorage();
        this.init();
    }
};

// UI 管理器
const UIManager = {
    // 初始化UI
    init: function() {
        this.cacheElements();
        this.bindEvents();
        this.showWelcomeScreen();
    },
    
    // 缓存DOM元素
    cacheElements: function() {
        this.screens = {
            welcome: document.getElementById('welcome-screen'),
            question: document.getElementById('question-screen'),
            result: document.getElementById('result-screen')
        };
        
        this.startBtn = document.getElementById('start-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.copyBtn = document.getElementById('copy-btn');
        this.saveTxtBtn = document.getElementById('save-txt-btn');
        this.restartBtn = document.getElementById('restart-btn');
        
        this.questionContent = document.getElementById('question-content');
        this.currentStepEl = document.getElementById('current-step');
        this.totalStepsEl = document.getElementById('total-steps');
        this.progressFill = document.getElementById('progress-fill');
        this.resultList = document.getElementById('result-list');
        this.resultDate = document.getElementById('result-date');
    },
    
    // 绑定事件
    bindEvents: function() {
        this.startBtn.addEventListener('click', () => this.showQuestionScreen());
        this.prevBtn.addEventListener('click', () => this.goToPreviousQuestion());
        this.nextBtn.addEventListener('click', () => this.goToNextQuestion());
        this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        this.saveTxtBtn.addEventListener('click', () => this.saveAsTxt());
        this.restartBtn.addEventListener('click', () => this.restartWizard());
    },
    
    // 显示欢迎屏幕
    showWelcomeScreen: function() {
        this.hideAllScreens();
        this.screens.welcome.classList.add('active');
    },
    
    // 显示问题屏幕
    showQuestionScreen: function() {
        this.hideAllScreens();
        this.screens.question.classList.add('active');
        this.renderQuestion();
    },
    
    // 显示结果屏幕
    showResultScreen: function() {
        this.hideAllScreens();
        this.screens.result.classList.add('active');
        this.renderResult();
    },
    
    // 隐藏所有屏幕
    hideAllScreens: function() {
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
    },
    
    // 渲染当前问题
    renderQuestion: function() {
        const question = appConfig.getQuestion(AppState.currentQuestionId);
        if (!question) return;
        
        // 更新进度信息
        const currentStep = appConfig.getCurrentStepIndex(AppState.currentQuestionId);
        this.currentStepEl.textContent = currentStep;
        this.totalStepsEl.textContent = appConfig.getTotalSteps();
        this.progressFill.style.width = `${AppState.progress}%`;
        
        // 构建问题HTML
        let html = `<h2 class="question-text">${question.question}</h2>`;
        html += `<div class="options-container">`;
        
        const currentAnswer = AppState.getAnswer(question.id);
        
        question.options.forEach(option => {
            const isSelected = question.type === 'single' 
                ? currentAnswer === option.value
                : Array.isArray(currentAnswer) && currentAnswer.includes(option.value);
            
            const selectedClass = isSelected ? 'selected' : '';
            
            html += `
                <div class="option ${selectedClass}" data-value="${option.value}">
                    <div class="option-icon">
                        <i class="fas fa-check"></i>
                    </div>
                    <div class="option-text">${option.text}</div>
                </div>
            `;
        });
        
        html += `</div>`;
        
        this.questionContent.innerHTML = html;
        
        // 绑定选项点击事件
        this.bindOptionEvents(question.type);
        
        // 更新下一步按钮状态
        this.updateNextButtonState(question.type, currentAnswer);
    },
    
    // 绑定选项点击事件
    bindOptionEvents: function(questionType) {
        const options = document.querySelectorAll('.option');
        options.forEach(option => {
            option.addEventListener('click', () => {
                const value = option.getAttribute('data-value');
                const question = appConfig.getQuestion(AppState.currentQuestionId);
                let newValue;
                
                if (questionType === 'single') {
                    // 单选：直接选择
                    options.forEach(opt => opt.classList.remove('selected'));
                    option.classList.add('selected');
                    newValue = value;
                } else {
                    // 多选：切换选择状态
                    option.classList.toggle('selected');
                    const selectedValues = [];
                    document.querySelectorAll('.option.selected').forEach(selected => {
                        selectedValues.push(selected.getAttribute('data-value'));
                    });
                    newValue = selectedValues;
                }
                
                // 保存答案
                AppState.setAnswer(question.id, newValue);
                
                // 更新下一步按钮状态
                this.updateNextButtonState(questionType, newValue);
            });
        });
    },
    
    // 更新下一步按钮状态
    updateNextButtonState: function(questionType, currentAnswer) {
        let isEnabled = false;
        
        if (questionType === 'single') {
            isEnabled = !!currentAnswer;
        } else {
            isEnabled = Array.isArray(currentAnswer) && currentAnswer.length > 0;
        }
        
        this.nextBtn.disabled = !isEnabled;
    },
    
    // 前往下一个问题
    goToNextQuestion: function() {
        const result = AppState.goToNextQuestion();
        if (result === "complete") {
            this.showResultScreen();
        } else if (result) {
            this.renderQuestion();
        }
    },
    
    // 返回上一个问题
    goToPreviousQuestion: function() {
        if (AppState.goToPrevQuestion()) {
            this.renderQuestion();
        }
    },
    
    // 渲染结果
    renderResult: function() {
        // 设置生成日期
        const now = new Date();
        this.resultDate.textContent = `生成日期：${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日 ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        // 按部分组织结果
        const sections = {};
        
        appConfig.workflow.forEach(question => {
            const answer = AppState.getAnswer(question.id);
            if (answer !== undefined && answer !== null && answer !== '') {
                if (!sections[question.section]) {
                    sections[question.section] = [];
                }
                
                let answerText = '';
                if (Array.isArray(answer)) {
                    // 多选答案
                    const selectedOptions = question.options.filter(opt => 
                        answer.includes(opt.value)
                    ).map(opt => opt.text);
                    answerText = selectedOptions.join('；');
                } else {
                    // 单选答案
                    const selectedOption = question.options.find(opt => opt.value === answer);
                    answerText = selectedOption ? selectedOption.text : answer;
                }
                
                sections[question.section].push({
                    question: question.question,
                    answer: answerText
                });
            }
        });
        
        // 生成HTML
        let html = '';
        
        Object.keys(sections).forEach(sectionName => {
            html += `
                <div class="result-section">
                    <div class="section-header">
                        <i class="fas fa-folder"></i>
                        ${sectionName}
                    </div>
                    <div class="section-content">
            `;
            
            sections[sectionName].forEach(item => {
                html += `
                    <div class="result-item">
                        <div class="result-question">${item.question}</div>
                        <div class="result-answer">${item.answer}</div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        });
        
        this.resultList.innerHTML = html;
        
        // 如果没有结果，显示提示
        if (Object.keys(sections).length === 0) {
            this.resultList.innerHTML = `
                <div class="empty-result">
                    <i class="fas fa-inbox"></i>
                    <h3>暂无结果</h3>
                    <p>您还没有完成问题回答，请重新开始向导。</p>
                </div>
            `;
        }
    },
    
    // 复制到剪贴板
    copyToClipboard: function() {
        const resultText = this.generateResultText();
        
        navigator.clipboard.writeText(resultText)
            .then(() => {
                this.showNotification('结果已复制到剪贴板！', 'success');
            })
            .catch(err => {
                console.error('复制失败:', err);
                this.showNotification('复制失败，请手动复制', 'error');
            });
    },
    
    // 保存为TXT文件
    saveAsTxt: function() {
        const resultText = this.generateResultText();
        const blob = new Blob([resultText], { type: 'text/plain;charset=utf-8' });
        const now = new Date();
        const filename = `应用需求清单_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}.txt`;
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showNotification('文件已开始下载！', 'success');
    },
    
    // 生成结果文本
    generateResultText: function() {
        const now = new Date();
        let text = '='.repeat(50) + '\n';
        text += '应用需求清单\n';
        text += '='.repeat(50) + '\n\n';
        text += `生成时间：${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日 ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}\n`;
        text += '\n' + '='.repeat(50) + '\n\n';
        
        const sections = {};
        
        // 按部分组织结果
        appConfig.workflow.forEach(question => {
            const answer = AppState.getAnswer(question.id);
            if (answer !== undefined && answer !== null && answer !== '') {
                if (!sections[question.section]) {
                    sections[question.section] = [];
                }
                
                let answerText = '';
                if (Array.isArray(answer)) {
                    const selectedOptions = question.options.filter(opt => 
                        answer.includes(opt.value)
                    ).map(opt => opt.text);
                    answerText = selectedOptions.join('；');
                } else {
                    const selectedOption = question.options.find(opt => opt.value === answer);
                    answerText = selectedOption ? selectedOption.text : answer;
                }
                
                sections[question.section].push({
                    question: question.question,
                    answer: answerText
                });
            }
        });
        
        // 生成文本
        Object.keys(sections).forEach(sectionName => {
            text += `【${sectionName}】\n`;
            text += '-'.repeat(40) + '\n';
            
            sections[sectionName].forEach(item => {
                text += `问题：${item.question}\n`;
                text += `答案：${item.answer}\n\n`;
            });
            
            text += '\n';
        });
        
        text += '='.repeat(50) + '\n';
        text += '清单生成完成\n';
        text += '='.repeat(50) + '\n';
        
        return text;
    },
    
    // 重新开始向导
    restartWizard: function() {
        if (confirm('确定要重新开始吗？当前进度将丢失。')) {
            AppState.reset();
            this.showWelcomeScreen();
        }
    },
    
    // 显示通知
    showNotification: function(message, type = 'success') {
        // 移除现有的通知
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // 创建新的通知
        const notification = document.createElement('div');
        notification.className = 'notification';
        
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        notification.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // 显示通知
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // 3秒后隐藏并移除
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
};

// 应用初始化
document.addEventListener('DOMContentLoaded', function() {
    // 添加CSS样式用于空结果状态
    const emptyResultStyles = document.createElement('style');
    emptyResultStyles.textContent = `
        .empty-result {
            text-align: center;
            padding: 60px 20px;
            color: #718096;
        }
        .empty-result i {
            font-size: 4rem;
            margin-bottom: 20px;
            color: #cbd5e0;
        }
        .empty-result h3 {
            font-size: 1.5rem;
            margin-bottom: 10px;
            color: #4a5568;
        }
    `;
    document.head.appendChild(emptyResultStyles);
    
    // 初始化应用
    AppState.init();
    UIManager.init();
    
    // 检查URL参数，看是否需要直接跳转到结果页面
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('result') && Object.keys(AppState.answers).length > 0) {
        UIManager.showResultScreen();
    }
    
    // 监听键盘事件
    document.addEventListener('keydown', function(event) {
        const activeScreen = document.querySelector('.screen.active');
        
        if (activeScreen && activeScreen.id === 'question-screen') {
            // 在问题页面，可以使用键盘导航
            if (event.key === 'Enter' && !event.shiftKey) {
                // Enter键进入下一步
                if (!UIManager.nextBtn.disabled) {
                    UIManager.goToNextQuestion();
                }
            } else if (event.key === 'ArrowUp') {
                // 上箭头选择上一个选项
                event.preventDefault();
                const options = document.querySelectorAll('.option');
                const selected = document.querySelector('.option.selected');
                if (selected && options.length > 0) {
                    const index = Array.from(options).indexOf(selected);
                    const prevIndex = index > 0 ? index - 1 : options.length - 1;
                    options[prevIndex].click();
                } else if (options.length > 0) {
                    options[0].click();
                }
            } else if (event.key === 'ArrowDown') {
                // 下箭头选择下一个选项
                event.preventDefault();
                const options = document.querySelectorAll('.option');
                const selected = document.querySelector('.option.selected');
                if (selected && options.length > 0) {
                    const index = Array.from(options).indexOf(selected);
                    const nextIndex = index < options.length - 1 ? index + 1 : 0;
                    options[nextIndex].click();
                } else if (options.length > 0) {
                    options[0].click();
                }
            } else if (event.key === 'ArrowLeft') {
                // 左箭头返回上一步
                event.preventDefault();
                UIManager.prevBtn.click();
            } else if (event.key === ' ') {
                // 空格键切换选择（多选）
                event.preventDefault();
                const question = appConfig.getQuestion(AppState.currentQuestionId);
                if (question && question.type === 'multiple') {
                    const options = document.querySelectorAll('.option');
                    if (options.length > 0) {
                        options[0].click();
                    }
                }
            }
        }
    });
    
    // 添加页面卸载前的确认
    window.addEventListener('beforeunload', function(event) {
        // 只有在有进度但没有完成时才提示
        if (Object.keys(AppState.answers).length > 0 && 
            !document.querySelector('.screen.active#result-screen')) {
            event.preventDefault();
            event.returnValue = '您确定要离开吗？当前进度将自动保存。';
        }
    });
});