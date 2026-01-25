// 问题配置 - 应用创建向导
const appConfig = {
    // 应用元数据
    appName: "应用创建向导",
    appVersion: "1.0.0",
    storageKey: "appWizardData",
    flowVersion: "1.0",
    
    // 问题流程定义
    workflow: [
        {
            id: "q1",
            question: "您想开发什么类型的应用？",
            type: "single",
            section: "项目概览",
            options: [
                { 
                    text: "移动端 App (iOS/Android)", 
                    value: "mobile",
                    next: "q2_platform"
                },
                { 
                    text: "Web 网站/应用", 
                    value: "web",
                    next: "q2_web"
                },
                { 
                    text: "桌面软件 (Windows/macOS/Linux)", 
                    value: "desktop",
                    next: "q2_desktop"
                },
                { 
                    text: "跨平台应用 (多端支持)", 
                    value: "cross",
                    next: "q2_cross"
                }
            ]
        },
        {
            id: "q2_platform",
            question: "请选择移动端平台：",
            type: "single",
            section: "技术选型",
            options: [
                { 
                    text: "仅 iOS (使用 Swift 或 React Native)", 
                    value: "ios",
                    next: "q3_design"
                },
                { 
                    text: "仅 Android (使用 Kotlin 或 Flutter)", 
                    value: "android",
                    next: "q3_design"
                },
                { 
                    text: "双平台 (使用 Flutter 或 React Native)", 
                    value: "both",
                    next: "q3_design"
                }
            ]
        },
        {
            id: "q2_web",
            question: "请选择 Web 应用类型：",
            type: "single",
            section: "技术选型",
            options: [
                { 
                    text: "企业官网/展示型网站", 
                    value: "showcase",
                    next: "q3_design"
                },
                { 
                    text: "Web 应用/管理系统", 
                    value: "webapp",
                    next: "q3_design"
                },
                { 
                    text: "电商平台", 
                    value: "ecommerce",
                    next: "q3_design"
                }
            ]
        },
        {
            id: "q2_desktop",
            question: "请选择桌面端平台：",
            type: "single",
            section: "技术选型",
            options: [
                { 
                    text: "Windows 应用", 
                    value: "windows",
                    next: "q3_design"
                },
                { 
                    text: "macOS 应用", 
                    value: "macos",
                    next: "q3_design"
                },
                { 
                    text: "Linux 应用", 
                    value: "linux",
                    next: "q3_design"
                },
                { 
                    text: "跨平台桌面应用 (Electron/Tauri)", 
                    value: "desktop_cross",
                    next: "q3_design"
                }
            ]
        },
        {
            id: "q2_cross",
            question: "请选择跨平台方案：",
            type: "single",
            section: "技术选型",
            options: [
                { 
                    text: "Flutter (iOS/Android/Web/桌面)", 
                    value: "flutter",
                    next: "q3_design"
                },
                { 
                    text: "React Native (iOS/Android)", 
                    value: "react_native",
                    next: "q3_design"
                },
                { 
                    text: "PWA (渐进式 Web 应用)", 
                    value: "pwa",
                    next: "q3_design"
                }
            ]
        },
        {
            id: "q3_design",
            question: "请选择应用的设计风格：",
            type: "single",
            section: "设计需求",
            options: [
                { 
                    text: "现代简约风", 
                    value: "modern",
                    next: "q4_features"
                },
                { 
                    text: "专业商务风", 
                    value: "professional",
                    next: "q4_features"
                },
                { 
                    text: "活泼创意风", 
                    value: "creative",
                    next: "q4_features"
                },
                { 
                    text: "极简主义", 
                    value: "minimalist",
                    next: "q4_features"
                }
            ]
        },
        {
            id: "q4_features",
            question: "请选择需要包含的核心功能：",
            type: "multiple",
            section: "功能需求",
            options: [
                { 
                    text: "用户注册/登录系统", 
                    value: "auth",
                    next: "q5_data"
                },
                { 
                    text: "数据图表/分析面板", 
                    value: "analytics",
                    next: "q5_data"
                },
                { 
                    text: "消息/通知系统", 
                    value: "notifications",
                    next: "q5_data"
                },
                { 
                    text: "文件上传/下载", 
                    value: "files",
                    next: "q5_data"
                },
                { 
                    text: "支付/交易功能", 
                    value: "payment",
                    next: "q5_data"
                },
                { 
                    text: "地图/位置服务", 
                    value: "location",
                    next: "q5_data"
                }
            ]
        },
        {
            id: "q5_data",
            question: "应用需要处理什么类型的数据？",
            type: "multiple",
            section: "数据与存储",
            options: [
                { 
                    text: "用户个人信息", 
                    value: "user_data",
                    next: "q6_integration"
                },
                { 
                    text: "媒体文件 (图片/视频/音频)", 
                    value: "media",
                    next: "q6_integration"
                },
                { 
                    text: "实时数据 (如聊天、股价)", 
                    value: "realtime",
                    next: "q6_integration"
                },
                { 
                    text: "大量结构化数据", 
                    value: "structured",
                    next: "q6_integration"
                },
                { 
                    text: "敏感/机密数据", 
                    value: "sensitive",
                    next: "q6_integration"
                }
            ]
        },
        {
            id: "q6_integration",
            question: "需要集成哪些第三方服务？",
            type: "multiple",
            section: "集成需求",
            options: [
                { 
                    text: "社交媒体登录 (微信/微博/QQ)", 
                    value: "social",
                    next: "q7_backend"
                },
                { 
                    text: "地图服务 (高德/百度/腾讯地图)", 
                    value: "maps",
                    next: "q7_backend"
                },
                { 
                    text: "支付接口 (微信支付/支付宝)", 
                    value: "payment_api",
                    next: "q7_backend"
                },
                { 
                    text: "云存储 (阿里云/腾讯云)", 
                    value: "cloud_storage",
                    next: "q7_backend"
                },
                { 
                    text: "即时通讯 (融云/环信)", 
                    value: "im",
                    next: "q7_backend"
                },
                { 
                    text: "短信/邮件服务", 
                    value: "messaging",
                    next: "q7_backend"
                }
            ]
        },
        {
            id: "q7_backend",
            question: "后端服务如何实现？",
            type: "single",
            section: "后端架构",
            options: [
                { 
                    text: "自建后端服务器 (Node.js/Java/Python)", 
                    value: "custom",
                    next: "q8_timeline"
                },
                { 
                    text: "无服务器架构 (Serverless/BaaS)", 
                    value: "serverless",
                    next: "q8_timeline"
                },
                { 
                    text: "使用现成后端服务 (Firebase/Supabase)", 
                    value: "baas",
                    next: "q8_timeline"
                },
                { 
                    text: "暂不需要后端 (纯静态应用)", 
                    value: "none",
                    next: "q8_timeline"
                }
            ]
        },
        {
            id: "q8_timeline",
            question: "项目的预期时间规划是？",
            type: "single",
            section: "项目计划",
            options: [
                { 
                    text: "1个月内完成 (快速上线)", 
                    value: "1month",
                    next: "q9_budget"
                },
                { 
                    text: "1-3个月 (标准开发周期)", 
                    value: "3months",
                    next: "q9_budget"
                },
                { 
                    text: "3-6个月 (中型项目)", 
                    value: "6months",
                    next: "q9_budget"
                },
                { 
                    text: "6个月以上 (大型复杂项目)", 
                    value: "longterm",
                    next: "q9_budget"
                }
            ]
        },
        {
            id: "q9_budget",
            question: "项目的预算范围是多少？",
            type: "single",
            section: "预算规划",
            options: [
                { 
                    text: "5万元以内", 
                    value: "budget_small",
                    next: "complete"
                },
                { 
                    text: "5-20万元", 
                    value: "budget_medium",
                    next: "complete"
                },
                { 
                    text: "20-50万元", 
                    value: "budget_large",
                    next: "complete"
                },
                { 
                    text: "50万元以上", 
                    value: "budget_enterprise",
                    next: "complete"
                },
                { 
                    text: "尚未确定预算", 
                    value: "budget_unknown",
                    next: "complete"
                }
            ]
        }
    ],
    
    // 获取下一个问题的ID
    getNextQuestionId: function(currentQuestionId, selectedValues) {
        const currentQuestion = this.workflow.find(q => q.id === currentQuestionId);
        if (!currentQuestion) return null;
        
        // 如果是单选，根据选择的选项找到下一个问题
        if (currentQuestion.type === "single") {
            const selectedOption = currentQuestion.options.find(opt => 
                Array.isArray(selectedValues) ? selectedValues.includes(opt.value) : selectedValues === opt.value
            );
            return selectedOption ? selectedOption.next : null;
        }
        
        // 如果是多选，返回预设的下一个问题（所有选项共用同一个next）
        if (currentQuestion.type === "multiple" && currentQuestion.options.length > 0) {
            return currentQuestion.options[0].next;
        }
        
        return null;
    },
    
    // 获取问题总数
    getTotalSteps: function() {
        return this.workflow.length;
    },
    
    // 获取当前进度索引
    getCurrentStepIndex: function(currentQuestionId) {
        return this.workflow.findIndex(q => q.id === currentQuestionId) + 1;
    },
    
    // 获取问题详情
    getQuestion: function(questionId) {
        return this.workflow.find(q => q.id === questionId);
    },
    
    // 获取第一个问题的ID
    getFirstQuestionId: function() {
        return this.workflow.length > 0 ? this.workflow[0].id : null;
    }
};