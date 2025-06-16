// Hotel English Learning App - Main Application
class HotelEnglishApp {
    constructor() {
        this.currentModule = 'home';
        this.currentLanguage = 'ja';
        this.userProgress = this.loadProgress();
        this.studySession = {
            startTime: null,
            phrases: new Set()
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateProgress();
        this.updateStats();
        this.startStudySession();
    }

    setupEventListeners() {
        // Navigation buttons
        document.querySelectorAll('.nav-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const module = e.currentTarget.dataset.module;
                this.switchModule(module);
            });
        });

        // Language toggle
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => {
                this.toggleLanguage();
            });
        }

        // Lesson tabs
        document.querySelectorAll('.lesson-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const lesson = e.currentTarget.dataset.lesson;
                this.switchLesson(lesson);
            });
        });

        // Quiz options
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.handleQuizAnswer(e.currentTarget);
            });
        });

        // Audio playback buttons
        document.querySelectorAll('.play-audio').forEach(button => {
            button.addEventListener('click', (e) => {
                const text = e.currentTarget.dataset.text;
                this.playAudio(text);
                this.trackPhraseStudy(text);
            });
        });

        // Modal close events
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    switchModule(moduleName) {
        // Update navigation
        document.querySelectorAll('.nav-button').forEach(button => {
            button.classList.remove('active');
        });
        document.querySelector(`[data-module="${moduleName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.module').forEach(module => {
            module.classList.remove('active');
        });
        
        const targetModule = document.getElementById(`${moduleName}Module`);
        if (targetModule) {
            targetModule.classList.add('active');
            this.currentModule = moduleName;
            
            // Load module content if needed
            this.loadModuleContent(moduleName);
            
            // Track module visit
            this.trackModuleVisit(moduleName);
        }
    }

    switchLesson(lessonName) {
        // Update lesson tabs
        document.querySelectorAll('.lesson-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-lesson="${lessonName}"]`).classList.add('active');

        // Update lesson panels
        document.querySelectorAll('.lesson-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        const targetPanel = document.getElementById(lessonName);
        if (targetPanel) {
            targetPanel.classList.add('active');
        }
    }

    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'ja' ? 'en' : 'ja';
        this.updateLanguageDisplay();
        this.updateContentLanguage();
    }

    updateLanguageDisplay() {
        const langToggle = document.getElementById('langToggle');
        const flag = langToggle.querySelector('.flag');
        const text = langToggle.querySelector('.text');
        
        if (this.currentLanguage === 'ja') {
            flag.textContent = '🇯🇵';
            text.textContent = '日本語';
        } else {
            flag.textContent = '🇺🇸';
            text.textContent = 'English';
        }
    }

    updateContentLanguage() {
        // This would update the interface language
        // For now, we'll keep it primarily in Japanese as that's our target audience
    }

    loadModuleContent(moduleName) {
        // Dynamically load content based on module
        switch(moduleName) {
            case 'checkin':
                this.loadCheckinContent();
                break;
            case 'checkout':
                this.loadCheckoutContent();
                break;
            case 'roomservice':
                this.loadRoomServiceContent();
                break;
            case 'pronunciation':
                this.loadPronunciationContent();
                break;
            case 'strategies':
                this.loadStrategiesContent();
                break;
        }
    }

    loadCheckinContent() {
        // Check-in content is already loaded in HTML
        // This method can be extended to load additional content dynamically
        this.initializeLessonInteractions();
    }

    loadCheckoutContent() {
        const module = document.getElementById('checkoutModule');
        const placeholder = module.querySelector('.content-placeholder');
        
        if (placeholder) {
            placeholder.innerHTML = `
                <div class="lesson-content">
                    <div class="lesson-nav">
                        <button class="lesson-tab active" data-lesson="checkout-greeting">挨拶・確認</button>
                        <button class="lesson-tab" data-lesson="checkout-billing">請求・支払い</button>
                        <button class="lesson-tab" data-lesson="checkout-farewell">お見送り</button>
                    </div>
                    
                    <div class="lesson-panel active" id="checkout-greeting">
                        <h3>チェックアウト時の挨拶と確認</h3>
                        <div class="phrase-list">
                            <div class="phrase-item">
                                <div class="phrase-english">
                                    <span class="phrase-text">Good morning! Are you checking out today?</span>
                                    <button class="play-audio" data-text="Good morning! Are you checking out today?">🔊</button>
                                </div>
                                <div class="phrase-pronunciation">グッd モーニング! アー ユー チェキング アウト トゥデイ?</div>
                                <div class="phrase-japanese">おはようございます！本日チェックアウトでいらっしゃいますか？</div>
                            </div>
                            
                            <div class="phrase-item">
                                <div class="phrase-english">
                                    <span class="phrase-text">How was your stay with us?</span>
                                    <button class="play-audio" data-text="How was your stay with us?">🔊</button>
                                </div>
                                <div class="phrase-pronunciation">ハウ ワズ ユアー ステイ ウィズ アス?</div>
                                <div class="phrase-japanese">滞在はいかがでしたか？</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="lesson-panel" id="checkout-billing">
                        <h3>請求と支払い</h3>
                        <div class="phrase-list">
                            <div class="phrase-item">
                                <div class="phrase-english">
                                    <span class="phrase-text">Here is your final bill. Your total comes to $248.</span>
                                    <button class="play-audio" data-text="Here is your final bill. Your total comes to $248.">🔊</button>
                                </div>
                                <div class="phrase-pronunciation">ヒアー イズ ユアー ファイナル ビル. ユアー トータル カムズ トゥ トゥー ハンドレd フォーティエイト ダラーズ</div>
                                <div class="phrase-japanese">こちらが最終的なご請求書です。合計248ドルです。</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="lesson-panel" id="checkout-farewell">
                        <h3>お見送り</h3>
                        <div class="phrase-list">
                            <div class="phrase-item">
                                <div class="phrase-english">
                                    <span class="phrase-text">Thank you for staying with us. We hope to see you again!</span>
                                    <button class="play-audio" data-text="Thank you for staying with us. We hope to see you again!">🔊</button>
                                </div>
                                <div class="phrase-pronunciation">サンキュー フォー ステイング ウィズ アス. ウィー ホープ トゥ シー ユー アゲイン!</div>
                                <div class="phrase-japanese">ご宿泊いただきありがとうございました。またのお越しをお待ちしております！</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            this.initializeLessonInteractions();
        }
    }

    loadRoomServiceContent() {
        const module = document.getElementById('roomserviceModule');
        const placeholder = module.querySelector('.content-placeholder');
        
        if (placeholder) {
            placeholder.innerHTML = `
                <div class="lesson-content">
                    <div class="lesson-nav">
                        <button class="lesson-tab active" data-lesson="phone-greeting">電話応答</button>
                        <button class="lesson-tab" data-lesson="taking-orders">注文受付</button>
                        <button class="lesson-tab" data-lesson="housekeeping">ハウスキーピング</button>
                    </div>
                    
                    <div class="lesson-panel active" id="phone-greeting">
                        <h3>電話の受け方</h3>
                        <div class="phrase-list">
                            <div class="phrase-item">
                                <div class="phrase-english">
                                    <span class="phrase-text">Good evening, Room Service. How may I help you?</span>
                                    <button class="play-audio" data-text="Good evening, Room Service. How may I help you?">🔊</button>
                                </div>
                                <div class="phrase-pronunciation">グッd イーブニング, ルーム サービス. ハウ メイ アイ ヘルプ ユー?</div>
                                <div class="phrase-japanese">こんばんは、ルームサービスです。いかがいたしましょうか？</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="lesson-panel" id="taking-orders">
                        <h3>注文の受付</h3>
                        <div class="phrase-list">
                            <div class="phrase-item">
                                <div class="phrase-english">
                                    <span class="phrase-text">What would you like to order this evening?</span>
                                    <button class="play-audio" data-text="What would you like to order this evening?">🔊</button>
                                </div>
                                <div class="phrase-pronunciation">ワット ウッd ユー ライク トゥ オーダー ディス イーブニング?</div>
                                <div class="phrase-japanese">今晩は何をご注文でしょうか？</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="lesson-panel" id="housekeeping">
                        <h3>ハウスキーピング要求</h3>
                        <div class="phrase-list">
                            <div class="phrase-item">
                                <div class="phrase-english">
                                    <span class="phrase-text">Housekeeping, may I help you?</span>
                                    <button class="play-audio" data-text="Housekeeping, may I help you?">🔊</button>
                                </div>
                                <div class="phrase-pronunciation">ハウスキーピング, メイ アイ ヘルプ ユー?</div>
                                <div class="phrase-japanese">ハウスキーピングです。何かお手伝いできますか？</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            this.initializeLessonInteractions();
        }
    }

    loadPronunciationContent() {
        const module = document.getElementById('pronunciationModule');
        const placeholder = module.querySelector('.content-placeholder');
        
        if (placeholder) {
            placeholder.innerHTML = `
                <div class="lesson-content">
                    <div class="lesson-nav">
                        <button class="lesson-tab active" data-lesson="lr-sounds">L/R音</button>
                        <button class="lesson-tab" data-lesson="fp-sounds">F/P音</button>
                        <button class="lesson-tab" data-lesson="th-sounds">TH音</button>
                        <button class="lesson-tab" data-lesson="vowels">母音</button>
                    </div>
                    
                    <div class="lesson-panel active" id="lr-sounds">
                        <h3>L音とR音の区別</h3>
                        <div class="phrase-list">
                            <div class="phrase-item">
                                <div class="phrase-english">
                                    <span class="phrase-text">Light - Right</span>
                                    <button class="play-audio" data-text="Light. Right.">🔊</button>
                                </div>
                                <div class="phrase-pronunciation">ライト - ライト</div>
                                <div class="phrase-japanese">電気 - 正しい</div>
                                <div class="phrase-tips">
                                    <strong>L音のコツ:</strong> 舌先を上の前歯の裏に軽く触れる<br>
                                    <strong>R音のコツ:</strong> 舌先をどこにも触れさせず、少し後ろに引く
                                </div>
                            </div>
                            
                            <div class="phrase-item">
                                <div class="phrase-english">
                                    <span class="phrase-text">Please leave your luggage in the lobby.</span>
                                    <button class="play-audio" data-text="Please leave your luggage in the lobby.">🔊</button>
                                </div>
                                <div class="phrase-pronunciation">プリーズ リーv ユアー ラゲージ イン ザ ロビー</div>
                                <div class="phrase-japanese">ロビーにお荷物をお預けください。</div>
                                <div class="phrase-tips">
                                    <strong>練習ポイント:</strong> "Please", "leave", "lobby"のL音と"your"のR音に注意
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            this.initializeLessonInteractions();
        }
    }

    loadStrategiesContent() {
        const module = document.getElementById('strategiesModule');
        const placeholder = module.querySelector('.content-placeholder');
        
        if (placeholder) {
            placeholder.innerHTML = `
                <div class="lesson-content">
                    <h3>効果的な学習戦略</h3>
                    <div class="strategy-list">
                        <div class="strategy-item">
                            <h4>🎯 SMART目標設定</h4>
                            <p>具体的で測定可能な学習目標を設定しましょう。例：「3ヶ月でチェックイン対応を完璧にマスターする」</p>
                        </div>
                        
                        <div class="strategy-item">
                            <h4>🔄 4段階学習サイクル</h4>
                            <p>インプット(40%) → 処理・理解(30%) → アウトプット(20%) → フィードバック(10%)</p>
                        </div>
                        
                        <div class="strategy-item">
                            <h4>🧠 効果的な記憶術</h4>
                            <p>語呂合わせ、イメージ記憶法、ストーリー記憶法を活用して効率的に暗記</p>
                        </div>
                        
                        <div class="strategy-item">
                            <h4>📱 テクノロジー活用</h4>
                            <p>発音アプリ、語彙学習アプリ、AI会話練習を日常学習に取り入れる</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    initializeLessonInteractions() {
        // Re-attach event listeners for dynamically added content
        setTimeout(() => {
            // Lesson tabs
            document.querySelectorAll('.lesson-tab').forEach(tab => {
                tab.addEventListener('click', (e) => {
                    const lesson = e.currentTarget.dataset.lesson;
                    this.switchLesson(lesson);
                });
            });

            // Audio buttons
            document.querySelectorAll('.play-audio').forEach(button => {
                button.addEventListener('click', (e) => {
                    const text = e.currentTarget.dataset.text;
                    this.playAudio(text);
                    this.trackPhraseStudy(text);
                });
            });

            // Quiz options
            document.querySelectorAll('.quiz-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    this.handleQuizAnswer(e.currentTarget);
                });
            });
        }, 100);
    }

    playAudio(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.8;
            utterance.pitch = 1;
            speechSynthesis.speak(utterance);
        }
    }

    handleQuizAnswer(option) {
        const isCorrect = option.dataset.correct === 'true';
        const allOptions = option.parentNode.querySelectorAll('.quiz-option');
        
        // Disable all options
        allOptions.forEach(opt => {
            opt.disabled = true;
            if (opt.dataset.correct === 'true') {
                opt.classList.add('correct');
            } else if (opt === option && !isCorrect) {
                opt.classList.add('incorrect');
            }
        });

        // Update score
        if (isCorrect) {
            this.userProgress.correctAnswers++;
            this.showFeedback('正解です！', 'success');
        } else {
            this.userProgress.incorrectAnswers++;
            this.showFeedback('不正解です。正しい答えを確認しましょう。', 'error');
        }

        this.saveProgress();
        this.updateStats();
    }

    showFeedback(message, type) {
        // Simple feedback implementation
        const feedback = document.createElement('div');
        feedback.className = `feedback ${type}`;
        feedback.textContent = message;
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 6px;
            color: white;
            font-weight: 500;
            z-index: 1001;
            ${type === 'success' ? 'background: #10b981;' : 'background: #ef4444;'}
        `;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, 3000);
    }

    trackPhraseStudy(phrase) {
        this.studySession.phrases.add(phrase);
        this.userProgress.phrasesStudied++;
        this.saveProgress();
        this.updateStats();
    }

    trackModuleVisit(module) {
        if (!this.userProgress.modulesVisited.includes(module)) {
            this.userProgress.modulesVisited.push(module);
            this.saveProgress();
            this.updateProgress();
        }
    }

    updateProgress() {
        const totalModules = 5; // home, checkin, checkout, roomservice, pronunciation, strategies
        const visitedModules = this.userProgress.modulesVisited.length;
        const progressPercentage = Math.round((visitedModules / totalModules) * 100);
        
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (progressFill) progressFill.style.width = `${progressPercentage}%`;
        if (progressText) progressText.textContent = `${progressPercentage}%`;
    }

    updateStats() {
        const stats = {
            totalLessons: this.userProgress.modulesVisited.length,
            studyTime: this.calculateStudyTime(),
            quizScore: this.calculateQuizScore(),
            streakDays: this.userProgress.streakDays
        };

        Object.keys(stats).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.textContent = stats[key];
            }
        });
    }

    calculateStudyTime() {
        if (this.studySession.startTime) {
            return Math.floor((Date.now() - this.studySession.startTime) / 60000);
        }
        return this.userProgress.totalStudyTime || 0;
    }

    calculateQuizScore() {
        const total = this.userProgress.correctAnswers + this.userProgress.incorrectAnswers;
        if (total === 0) return 0;
        return Math.round((this.userProgress.correctAnswers / total) * 100);
    }

    startStudySession() {
        this.studySession.startTime = Date.now();
    }

    endStudySession() {
        if (this.studySession.startTime) {
            const sessionTime = Math.floor((Date.now() - this.studySession.startTime) / 60000);
            this.userProgress.totalStudyTime = (this.userProgress.totalStudyTime || 0) + sessionTime;
            this.saveProgress();
        }
    }

    handleKeyboardShortcuts(e) {
        // Keyboard shortcuts for better accessibility
        if (e.altKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    this.switchModule('home');
                    break;
                case '2':
                    e.preventDefault();
                    this.switchModule('checkin');
                    break;
                case '3':
                    e.preventDefault();
                    this.switchModule('checkout');
                    break;
                case '4':
                    e.preventDefault();
                    this.switchModule('roomservice');
                    break;
                case '5':
                    e.preventDefault();
                    this.switchModule('pronunciation');
                    break;
                case '6':
                    e.preventDefault();
                    this.switchModule('strategies');
                    break;
            }
        }
    }

    closeModal(modal) {
        modal.classList.remove('active');
    }

    loadProgress() {
        try {
            const saved = JSON.parse(localStorage.getItem('hotelEnglishProgress') || '{}');
            return {
                modulesVisited: [],
                phrasesStudied: 0,
                correctAnswers: 0,
                incorrectAnswers: 0,
                totalStudyTime: 0,
                streakDays: 0,
                lastStudyDate: null,
                ...saved
            };
        } catch (e) {
            return {
                modulesVisited: [],
                phrasesStudied: 0,
                correctAnswers: 0,
                incorrectAnswers: 0,
                totalStudyTime: 0,
                streakDays: 0,
                lastStudyDate: null
            };
        }
    }

    saveProgress() {
        try {
            localStorage.setItem('hotelEnglishProgress', JSON.stringify(this.userProgress));
        } catch (e) {
            console.warn('Could not save progress to localStorage');
        }
    }
}

// Global functions for HTML onclick handlers
function switchModule(moduleName) {
    if (window.app) {
        window.app.switchModule(moduleName);
    }
}

function startQuiz() {
    if (window.app && window.app.quiz) {
        window.app.quiz.start();
    }
}

function closeQuiz() {
    const modal = document.getElementById('quizModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new HotelEnglishApp();
    
    // Save progress when leaving the page
    window.addEventListener('beforeunload', () => {
        if (window.app) {
            window.app.endStudySession();
        }
    });
});
