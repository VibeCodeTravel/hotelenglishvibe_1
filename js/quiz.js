// Interactive Quiz System for Hotel English Learning App
class QuizManager {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.isActive = false;
        this.timeLimit = 30; // seconds per question
        this.timer = null;
        this.timeRemaining = 0;
        
        this.initializeQuestions();
    }

    initializeQuestions() {
        this.questions = [
            // Check-in Questions
            {
                id: 1,
                category: 'checkin',
                type: 'multiple-choice',
                question: 'お客様が午前中にフロントに来ました。適切な挨拶は？',
                options: [
                    'Good morning! Welcome to our hotel.',
                    'Good evening! Welcome to our hotel.',
                    'Hello! Nice to meet you.',
                    'Hi there! What\'s up?'
                ],
                correct: 0,
                explanation: '午前中なので "Good morning!" が適切です。'
            },
            {
                id: 2,
                category: 'checkin',
                type: 'multiple-choice',
                question: '予約確認でお客様の名前のスペルを聞く時の表現は？',
                options: [
                    'What is your name?',
                    'Could you spell your last name for me, please?',
                    'How do you write your name?',
                    'Tell me your name again.'
                ],
                correct: 1,
                explanation: '"Could you spell your last name for me, please?" が最も丁寧で適切です。'
            },
            {
                id: 3,
                category: 'checkin',
                type: 'pronunciation',
                question: '次の単語の正しい発音は？',
                word: 'Welcome',
                options: [
                    'ウェルカム',
                    'ウェlカム',
                    'ウエルカム',
                    'ワルカム'
                ],
                correct: 1,
                explanation: 'L音をしっかり発音して「ウェlカム」が正しいです。'
            },
            
            // Check-out Questions
            {
                id: 4,
                category: 'checkout',
                type: 'multiple-choice',
                question: 'チェックアウト時にお客様の滞在について聞く表現は？',
                options: [
                    'Did you like our hotel?',
                    'How was your stay with us?',
                    'Was everything okay?',
                    'Do you want to come back?'
                ],
                correct: 1,
                explanation: '"How was your stay with us?" が標準的で丁寧な表現です。'
            },
            {
                id: 5,
                category: 'checkout',
                type: 'fill-in-blank',
                question: '請求書をお渡しする時：\n"Here is your _____ bill. Your total comes to $248."',
                blank: 'final',
                options: ['final', 'last', 'complete', 'total'],
                correct: 0,
                explanation: '"final bill" が最も適切な表現です。'
            },
            
            // Room Service Questions
            {
                id: 6,
                category: 'roomservice',
                type: 'multiple-choice',
                question: 'ルームサービスの電話を受ける時の第一声は？',
                options: [
                    'Hello, this is room service.',
                    'Good evening, Room Service. How may I help you?',
                    'Room service here.',
                    'What do you want to order?'
                ],
                correct: 1,
                explanation: '時間の挨拶、部門名、お手伝いの申し出が含まれた完璧な表現です。'
            },
            {
                id: 7,
                category: 'roomservice',
                type: 'multiple-choice',
                question: 'ハウスキーピングで追加タオルの依頼を受けた時は？',
                options: [
                    'OK, I will send towels.',
                    'Certainly! How many additional towels would you like?',
                    'Yes, towels coming.',
                    'We have towels available.'
                ],
                correct: 1,
                explanation: '丁寧に確認を取る表現が最も適切です。'
            },
            
            // Pronunciation Questions
            {
                id: 8,
                category: 'pronunciation',
                type: 'multiple-choice',
                question: 'L音とR音の違いで正しいのは？',
                options: [
                    'L音：舌先を上前歯の裏に触れる',
                    'R音：舌先を上前歯の裏に触れる',
                    'どちらも同じ位置',
                    'L音：舌を巻く'
                ],
                correct: 0,
                explanation: 'L音は舌先を上前歯の裏に軽く触れ、R音は舌先をどこにも触れさせません。'
            },
            {
                id: 9,
                category: 'pronunciation',
                type: 'pronunciation',
                question: '"Thank you" の TH音の正しい発音は？',
                word: 'Thank',
                options: [
                    'サンク',
                    'タンク',
                    'スィンク',
                    'シンク'
                ],
                correct: 0,
                explanation: 'TH音は舌先を軽く歯の間に出して「サンク」と発音します。'
            },
            
            // Situational Questions
            {
                id: 10,
                category: 'situation',
                type: 'multiple-choice',
                question: 'お客様が部屋のエアコンが効かないと電話してきました。適切な対応は？',
                options: [
                    'I will call maintenance.',
                    'I apologize for the inconvenience. I\'ll send our maintenance team immediately.',
                    'That\'s not good. Someone will fix it.',
                    'Air conditioning is broken.'
                ],
                correct: 1,
                explanation: 'お詫び、問題の認識、具体的な解決策を含む完璧な対応です。'
            }
        ];
    }

    start(category = 'all') {
        this.isActive = true;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        
        // Filter questions by category if specified
        if (category !== 'all') {
            this.questions = this.questions.filter(q => q.category === category);
        }
        
        // Shuffle questions
        this.shuffleArray(this.questions);
        
        this.showQuizModal();
        this.displayQuestion();
    }

    showQuizModal() {
        const modal = document.getElementById('quizModal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    hideQuizModal() {
        const modal = document.getElementById('quizModal');
        if (modal) {
            modal.classList.remove('active');
        }
        this.isActive = false;
    }

    displayQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.showResults();
            return;
        }

        const question = this.questions[this.currentQuestionIndex];
        const quizContent = document.getElementById('quizContent');
        
        if (!quizContent) return;

        let questionHTML = `
            <div class="quiz-question">
                <div class="quiz-header">
                    <div class="question-counter">
                        問題 ${this.currentQuestionIndex + 1} / ${this.questions.length}
                    </div>
                    <div class="quiz-timer" id="quizTimer">
                        ⏱️ ${this.timeLimit}秒
                    </div>
                </div>
                
                <div class="question-category">${this.getCategoryName(question.category)}</div>
                <h4 class="question-text">${question.question}</h4>
        `;

        if (question.type === 'multiple-choice' || question.type === 'pronunciation') {
            questionHTML += '<div class="quiz-options">';
            question.options.forEach((option, index) => {
                questionHTML += `
                    <button class="quiz-option" data-index="${index}">
                        ${String.fromCharCode(65 + index)}. ${option}
                    </button>
                `;
            });
            questionHTML += '</div>';
        } else if (question.type === 'fill-in-blank') {
            questionHTML += `
                <div class="fill-blank-container">
                    <input type="text" class="fill-blank-input" id="fillBlankInput" 
                           placeholder="答えを入力してください">
                    <button class="submit-answer" onclick="window.quiz.submitFillBlank()">
                        回答提出
                    </button>
                </div>
            `;
        }

        if (question.word && question.type === 'pronunciation') {
            questionHTML += `
                <div class="pronunciation-practice">
                    <button class="practice-word-btn" onclick="window.speechManager.speak('${question.word}')">
                        🔊 "${question.word}" を聞く
                    </button>
                </div>
            `;
        }

        questionHTML += '</div>';
        quizContent.innerHTML = questionHTML;

        // Add event listeners for options
        this.attachOptionListeners();
        
        // Start timer
        this.startTimer();
    }

    attachOptionListeners() {
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const answerIndex = parseInt(e.target.dataset.index);
                this.submitAnswer(answerIndex);
            });
        });
    }

    submitAnswer(answerIndex) {
        if (!this.isActive) return;

        this.stopTimer();
        const question = this.questions[this.currentQuestionIndex];
        const isCorrect = answerIndex === question.correct;
        
        // Record answer
        this.userAnswers.push({
            questionId: question.id,
            userAnswer: answerIndex,
            correct: question.correct,
            isCorrect: isCorrect,
            timeUsed: this.timeLimit - this.timeRemaining
        });

        if (isCorrect) {
            this.score++;
        }

        // Show feedback
        this.showAnswerFeedback(question, answerIndex, isCorrect);
        
        // Move to next question after delay
        setTimeout(() => {
            this.currentQuestionIndex++;
            this.displayQuestion();
        }, 2500);
    }

    submitFillBlank() {
        const input = document.getElementById('fillBlankInput');
        if (!input) return;

        const userAnswer = input.value.trim().toLowerCase();
        const question = this.questions[this.currentQuestionIndex];
        const isCorrect = userAnswer === question.blank.toLowerCase();
        
        this.stopTimer();
        
        this.userAnswers.push({
            questionId: question.id,
            userAnswer: userAnswer,
            correct: question.blank,
            isCorrect: isCorrect,
            timeUsed: this.timeLimit - this.timeRemaining
        });

        if (isCorrect) {
            this.score++;
        }

        this.showAnswerFeedback(question, userAnswer, isCorrect);
        
        setTimeout(() => {
            this.currentQuestionIndex++;
            this.displayQuestion();
        }, 2500);
    }

    showAnswerFeedback(question, userAnswer, isCorrect) {
        const quizContent = document.getElementById('quizContent');
        const feedback = document.createElement('div');
        feedback.className = `answer-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        
        feedback.innerHTML = `
            <div class="feedback-icon">
                ${isCorrect ? '✅' : '❌'}
            </div>
            <div class="feedback-text">
                <h5>${isCorrect ? '正解！' : '不正解'}</h5>
                <p>${question.explanation}</p>
                ${!isCorrect ? `<p><strong>正解:</strong> ${question.options ? question.options[question.correct] : question.blank}</p>` : ''}
            </div>
        `;
        
        feedback.style.cssText = `
            background: ${isCorrect ? '#d1fae5' : '#fee2e2'};
            border: 2px solid ${isCorrect ? '#10b981' : '#ef4444'};
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
            display: flex;
            align-items: center;
            gap: 15px;
            animation: slideIn 0.3s ease;
        `;
        
        quizContent.appendChild(feedback);
    }

    startTimer() {
        this.timeRemaining = this.timeLimit;
        this.updateTimerDisplay();
        
        this.timer = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();
            
            if (this.timeRemaining <= 0) {
                this.submitAnswer(-1); // Auto-submit as wrong answer
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    updateTimerDisplay() {
        const timerElement = document.getElementById('quizTimer');
        if (timerElement) {
            const color = this.timeRemaining <= 10 ? '#ef4444' : '#64748b';
            timerElement.innerHTML = `⏱️ ${this.timeRemaining}秒`;
            timerElement.style.color = color;
        }
    }

    showResults() {
        this.stopTimer();
        const percentage = Math.round((this.score / this.questions.length) * 100);
        const quizContent = document.getElementById('quizContent');
        
        let performanceMessage = '';
        let performanceColor = '';
        
        if (percentage >= 90) {
            performanceMessage = '素晴らしい！完璧に近い理解度です！';
            performanceColor = '#10b981';
        } else if (percentage >= 70) {
            performanceMessage = '良くできました！もう少し練習すれば完璧です。';
            performanceColor = '#f59e0b';
        } else if (percentage >= 50) {
            performanceMessage = 'まずまずです。もう少し復習してみましょう。';
            performanceColor = '#f59e0b';
        } else {
            performanceMessage = '基礎から復習することをおすすめします。';
            performanceColor = '#ef4444';
        }

        quizContent.innerHTML = `
            <div class="quiz-results">
                <div class="results-header">
                    <h3>クイズ結果</h3>
                    <div class="score-circle" style="border-color: ${performanceColor};">
                        <div class="score-percentage" style="color: ${performanceColor};">
                            ${percentage}%
                        </div>
                        <div class="score-fraction">
                            ${this.score} / ${this.questions.length}
                        </div>
                    </div>
                </div>
                
                <div class="performance-message" style="color: ${performanceColor};">
                    ${performanceMessage}
                </div>
                
                <div class="results-breakdown">
                    <h4>カテゴリ別結果</h4>
                    ${this.generateCategoryBreakdown()}
                </div>
                
                <div class="results-actions">
                    <button class="btn-primary" onclick="window.quiz.start()">
                        もう一度挑戦
                    </button>
                    <button class="btn-secondary" onclick="window.quiz.reviewAnswers()">
                        答えを確認
                    </button>
                    <button class="btn-secondary" onclick="window.quiz.hideQuizModal()">
                        閉じる
                    </button>
                </div>
            </div>
        `;

        // Update user progress
        if (window.app) {
            window.app.userProgress.quizzesTaken = (window.app.userProgress.quizzesTaken || 0) + 1;
            window.app.userProgress.lastQuizScore = percentage;
            window.app.saveProgress();
            window.app.updateStats();
        }
    }

    generateCategoryBreakdown() {
        const categories = {};
        
        this.userAnswers.forEach(answer => {
            const question = this.questions.find(q => q.id === answer.questionId);
            if (!categories[question.category]) {
                categories[question.category] = { correct: 0, total: 0 };
            }
            categories[question.category].total++;
            if (answer.isCorrect) {
                categories[question.category].correct++;
            }
        });

        let breakdown = '';
        for (const [category, stats] of Object.entries(categories)) {
            const percentage = Math.round((stats.correct / stats.total) * 100);
            breakdown += `
                <div class="category-result">
                    <span class="category-name">${this.getCategoryName(category)}</span>
                    <span class="category-score">${stats.correct}/${stats.total} (${percentage}%)</span>
                </div>
            `;
        }
        
        return breakdown;
    }

    reviewAnswers() {
        const quizContent = document.getElementById('quizContent');
        let reviewHTML = '<div class="answer-review"><h3>答えの確認</h3>';
        
        this.userAnswers.forEach((answer, index) => {
            const question = this.questions.find(q => q.id === answer.questionId);
            reviewHTML += `
                <div class="review-item ${answer.isCorrect ? 'correct' : 'incorrect'}">
                    <div class="review-question">
                        <strong>問題 ${index + 1}:</strong> ${question.question}
                    </div>
                    <div class="review-answer">
                        <div>あなたの答え: ${question.options ? question.options[answer.userAnswer] || '未回答' : answer.userAnswer}</div>
                        <div>正解: ${question.options ? question.options[question.correct] : question.blank}</div>
                        <div class="review-explanation">${question.explanation}</div>
                    </div>
                </div>
            `;
        });
        
        reviewHTML += `
            <div class="review-actions">
                <button class="btn-primary" onclick="window.quiz.start()">新しいクイズ</button>
                <button class="btn-secondary" onclick="window.quiz.hideQuizModal()">閉じる</button>
            </div>
        </div>`;
        
        quizContent.innerHTML = reviewHTML;
    }

    getCategoryName(category) {
        const categoryNames = {
            'checkin': 'チェックイン',
            'checkout': 'チェックアウト',
            'roomservice': 'ルームサービス',
            'pronunciation': '発音',
            'situation': '状況対応'
        };
        return categoryNames[category] || category;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Add custom quiz styles
    addQuizStyles() {
        if (document.getElementById('quizStyles')) return;

        const styles = document.createElement('style');
        styles.id = 'quizStyles';
        styles.textContent = `
            .quiz-question {
                font-family: 'Noto Sans JP', sans-serif;
            }

            .quiz-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 2px solid #e2e8f0;
            }

            .question-counter {
                font-weight: 600;
                color: #3b82f6;
            }

            .quiz-timer {
                font-weight: 600;
                color: #64748b;
            }

            .question-category {
                background: #3b82f6;
                color: white;
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 0.8rem;
                font-weight: 500;
                display: inline-block;
                margin-bottom: 15px;
            }

            .question-text {
                font-size: 1.1rem;
                font-weight: 600;
                margin-bottom: 20px;
                line-height: 1.6;
                color: #1e293b;
            }

            .quiz-options {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .quiz-option {
                background: #f8fafc;
                border: 2px solid #e2e8f0;
                padding: 15px 20px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
                text-align: left;
                font-size: 1rem;
                font-family: 'Noto Sans JP', sans-serif;
            }

            .quiz-option:hover {
                background: #e2e8f0;
                border-color: #3b82f6;
                transform: translateY(-1px);
            }

            .fill-blank-container {
                display: flex;
                gap: 15px;
                align-items: center;
                margin-top: 20px;
            }

            .fill-blank-input {
                flex: 1;
                padding: 12px 16px;
                border: 2px solid #e2e8f0;
                border-radius: 6px;
                font-size: 1rem;
                font-family: 'Inter', sans-serif;
            }

            .fill-blank-input:focus {
                outline: none;
                border-color: #3b82f6;
            }

            .submit-answer {
                background: #3b82f6;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
                font-family: 'Noto Sans JP', sans-serif;
            }

            .pronunciation-practice {
                margin-top: 20px;
                text-align: center;
            }

            .practice-word-btn {
                background: #10b981;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 1rem;
                font-family: 'Noto Sans JP', sans-serif;
            }

            .quiz-results {
                text-align: center;
                font-family: 'Noto Sans JP', sans-serif;
            }

            .results-header {
                margin-bottom: 30px;
            }

            .score-circle {
                width: 120px;
                height: 120px;
                border: 4px solid;
                border-radius: 50%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                margin: 20px auto;
            }

            .score-percentage {
                font-size: 2rem;
                font-weight: 700;
            }

            .score-fraction {
                font-size: 0.9rem;
                color: #64748b;
            }

            .performance-message {
                font-size: 1.1rem;
                font-weight: 600;
                margin-bottom: 30px;
            }

            .results-breakdown {
                text-align: left;
                margin-bottom: 30px;
            }

            .category-result {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid #e2e8f0;
            }

            .results-actions {
                display: flex;
                gap: 15px;
                justify-content: center;
                flex-wrap: wrap;
            }

            .answer-review {
                font-family: 'Noto Sans JP', sans-serif;
            }

            .review-item {
                margin-bottom: 20px;
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid;
            }

            .review-item.correct {
                background: #d1fae5;
                border-left-color: #10b981;
            }

            .review-item.incorrect {
                background: #fee2e2;
                border-left-color: #ef4444;
            }

            .review-question {
                font-weight: 600;
                margin-bottom: 10px;
            }

            .review-answer {
                line-height: 1.6;
            }

            .review-explanation {
                font-style: italic;
                color: #64748b;
                margin-top: 8px;
            }

            .review-actions {
                text-align: center;
                margin-top: 30px;
            }

            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        
        document.head.appendChild(styles);
    }
}

// Initialize quiz manager
document.addEventListener('DOMContentLoaded', () => {
    window.quiz = new QuizManager();
    window.quiz.addQuizStyles();
    
    // Make quiz accessible from app
    if (window.app) {
        window.app.quiz = window.quiz;
    }
});
