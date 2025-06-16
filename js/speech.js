// Speech Synthesis and Recognition for Hotel English App
class SpeechManager {
    constructor() {
        this.synthesis = window.speechSynthesis;
        this.recognition = null;
        this.isListening = false;
        this.voices = [];
        
        this.init();
    }

    init() {
        this.loadVoices();
        this.initRecognition();
        
        // Load voices when they become available
        if (this.synthesis.onvoiceschanged !== undefined) {
            this.synthesis.onvoiceschanged = () => this.loadVoices();
        }
    }

    loadVoices() {
        this.voices = this.synthesis.getVoices();
    }

    speak(text, options = {}) {
        if (!this.synthesis) {
            console.warn('Speech synthesis not supported');
            return;
        }

        // Cancel any ongoing speech
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Default settings for hotel English learning
        utterance.lang = options.lang || 'en-US';
        utterance.rate = options.rate || 0.8; // Slower for learning
        utterance.pitch = options.pitch || 1.0;
        utterance.volume = options.volume || 1.0;

        // Try to use a clear, professional voice
        const preferredVoices = [
            'Microsoft Zira - English (United States)',
            'Google US English',
            'Alex',
            'Samantha'
        ];

        let selectedVoice = null;
        for (const voiceName of preferredVoices) {
            selectedVoice = this.voices.find(voice => 
                voice.name.includes(voiceName) || voice.name === voiceName
            );
            if (selectedVoice) break;
        }

        if (!selectedVoice) {
            // Fallback to any English voice
            selectedVoice = this.voices.find(voice => 
                voice.lang.startsWith('en')
            );
        }

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        // Event handlers
        utterance.onstart = () => {
            if (options.onStart) options.onStart();
        };

        utterance.onend = () => {
            if (options.onEnd) options.onEnd();
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event.error);
            if (options.onError) options.onError(event.error);
        };

        this.synthesis.speak(utterance);
        return utterance;
    }

    speakPhrase(text, showVisualFeedback = true) {
        return new Promise((resolve) => {
            if (showVisualFeedback) {
                this.showSpeakingIndicator();
            }

            this.speak(text, {
                onEnd: () => {
                    if (showVisualFeedback) {
                        this.hideSpeakingIndicator();
                    }
                    resolve();
                },
                onError: () => {
                    if (showVisualFeedback) {
                        this.hideSpeakingIndicator();
                    }
                    resolve();
                }
            });
        });
    }

    initRecognition() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.warn('Speech recognition not supported');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
        this.recognition.maxAlternatives = 3;

        this.recognition.onstart = () => {
            this.isListening = true;
            this.showListeningIndicator();
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.hideListeningIndicator();
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.isListening = false;
            this.hideListeningIndicator();
            this.showError('音声認識エラーが発生しました。もう一度お試しください。');
        };
    }

    startListening(onResult, onError) {
        if (!this.recognition) {
            onError && onError('Speech recognition not supported');
            return;
        }

        if (this.isListening) {
            this.stopListening();
            return;
        }

        this.recognition.onresult = (event) => {
            const results = Array.from(event.results[0])
                .map(result => ({
                    transcript: result.transcript,
                    confidence: result.confidence
                }))
                .sort((a, b) => b.confidence - a.confidence);

            onResult && onResult(results);
        };

        this.recognition.start();
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }

    showSpeakingIndicator() {
        this.removeExistingIndicators();
        
        const indicator = document.createElement('div');
        indicator.id = 'speechIndicator';
        indicator.className = 'speech-indicator speaking';
        indicator.innerHTML = `
            <div class="indicator-content">
                <div class="sound-waves">
                    <div class="wave"></div>
                    <div class="wave"></div>
                    <div class="wave"></div>
                </div>
                <span>音声を再生中...</span>
            </div>
        `;
        
        document.body.appendChild(indicator);
        this.addIndicatorStyles();
    }

    showListeningIndicator() {
        this.removeExistingIndicators();
        
        const indicator = document.createElement('div');
        indicator.id = 'speechIndicator';
        indicator.className = 'speech-indicator listening';
        indicator.innerHTML = `
            <div class="indicator-content">
                <div class="microphone">
                    <div class="mic-icon">🎤</div>
                    <div class="pulse"></div>
                </div>
                <span>音声を聞いています...</span>
                <button onclick="window.speechManager.stopListening()" class="stop-btn">停止</button>
            </div>
        `;
        
        document.body.appendChild(indicator);
        this.addIndicatorStyles();
    }

    hideSpeakingIndicator() {
        this.removeExistingIndicators();
    }

    hideListeningIndicator() {
        this.removeExistingIndicators();
    }

    removeExistingIndicators() {
        const existing = document.getElementById('speechIndicator');
        if (existing) {
            existing.remove();
        }
    }

    addIndicatorStyles() {
        if (document.getElementById('speechIndicatorStyles')) return;

        const styles = document.createElement('style');
        styles.id = 'speechIndicatorStyles';
        styles.textContent = `
            .speech-indicator {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 20px 30px;
                border-radius: 12px;
                z-index: 10000;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(10px);
            }

            .indicator-content {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 15px;
                font-family: 'Noto Sans JP', sans-serif;
                min-width: 200px;
            }

            .sound-waves {
                display: flex;
                gap: 4px;
                align-items: center;
            }

            .wave {
                width: 4px;
                height: 20px;
                background: #3b82f6;
                border-radius: 2px;
                animation: wave 1s ease-in-out infinite;
            }

            .wave:nth-child(2) {
                animation-delay: 0.2s;
            }

            .wave:nth-child(3) {
                animation-delay: 0.4s;
            }

            @keyframes wave {
                0%, 100% { height: 20px; }
                50% { height: 40px; }
            }

            .microphone {
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .mic-icon {
                font-size: 2rem;
                z-index: 2;
            }

            .pulse {
                position: absolute;
                width: 60px;
                height: 60px;
                border: 2px solid #ef4444;
                border-radius: 50%;
                animation: pulse 1.5s ease-out infinite;
            }

            @keyframes pulse {
                0% {
                    transform: scale(0.8);
                    opacity: 1;
                }
                100% {
                    transform: scale(2);
                    opacity: 0;
                }
            }

            .stop-btn {
                background: #ef4444;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                font-family: 'Noto Sans JP', sans-serif;
                font-size: 0.9rem;
                transition: background-color 0.2s;
            }

            .stop-btn:hover {
                background: #dc2626;
            }
        `;
        
        document.head.appendChild(styles);
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'speech-error';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 10001;
            font-family: 'Noto Sans JP', sans-serif;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 4000);
    }

    // Pronunciation practice functionality
    async practicePronunciation(targetText, onResult) {
        if (!this.recognition) {
            this.showError('音声認識がサポートされていません。');
            return;
        }

        // First, speak the target text
        await this.speakPhrase(targetText);
        
        // Wait a moment, then start listening
        setTimeout(() => {
            this.startListening((results) => {
                if (results && results.length > 0) {
                    const bestMatch = results[0];
                    const similarity = this.calculateSimilarity(
                        targetText.toLowerCase(),
                        bestMatch.transcript.toLowerCase()
                    );
                    
                    onResult({
                        target: targetText,
                        spoken: bestMatch.transcript,
                        confidence: bestMatch.confidence,
                        similarity: similarity,
                        score: Math.round((similarity + bestMatch.confidence) * 50),
                        alternatives: results.slice(1, 3)
                    });
                }
            }, (error) => {
                this.showError('音声認識中にエラーが発生しました。');
            });
        }, 1000);
    }

    calculateSimilarity(str1, str2) {
        // Simple similarity calculation using Levenshtein distance
        const matrix = [];
        const len1 = str1.length;
        const len2 = str2.length;

        for (let i = 0; i <= len2; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= len1; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= len2; i++) {
            for (let j = 1; j <= len1; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }

        const maxLen = Math.max(len1, len2);
        return maxLen === 0 ? 1 : (maxLen - matrix[len2][len1]) / maxLen;
    }

    // Utility method to test if speech synthesis is working
    testSpeech() {
        this.speak('This is a test of the speech synthesis system.', {
            onStart: () => console.log('Speech test started'),
            onEnd: () => console.log('Speech test completed'),
            onError: (error) => console.error('Speech test failed:', error)
        });
    }
}

// Initialize speech manager
document.addEventListener('DOMContentLoaded', () => {
    window.speechManager = new SpeechManager();
    
    // Add pronunciation practice buttons to phrases
    setTimeout(() => {
        document.querySelectorAll('.phrase-item').forEach(item => {
            const englishText = item.querySelector('.phrase-text');
            if (englishText) {
                const practiceBtn = document.createElement('button');
                practiceBtn.className = 'practice-pronunciation-btn';
                practiceBtn.innerHTML = '🎙️ 発音練習';
                practiceBtn.style.cssText = `
                    margin-left: 10px;
                    background: #10b981;
                    color: white;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.8rem;
                    font-family: 'Noto Sans JP', sans-serif;
                `;
                
                practiceBtn.addEventListener('click', () => {
                    window.speechManager.practicePronunciation(
                        englishText.textContent,
                        (result) => {
                            showPronunciationResult(result);
                        }
                    );
                });
                
                item.querySelector('.phrase-english').appendChild(practiceBtn);
            }
        });
    }, 1000);
});

function showPronunciationResult(result) {
    const modal = document.createElement('div');
    modal.className = 'pronunciation-result-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    const scoreColor = result.score >= 80 ? '#10b981' : 
                      result.score >= 60 ? '#f59e0b' : '#ef4444';
    
    modal.innerHTML = `
        <div style="
            background: white;
            padding: 30px;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            font-family: 'Noto Sans JP', sans-serif;
        ">
            <h3 style="margin-bottom: 20px; color: #1e293b;">発音結果</h3>
            
            <div style="margin-bottom: 20px;">
                <div style="font-size: 3rem; color: ${scoreColor}; margin-bottom: 10px;">
                    ${result.score}点
                </div>
                <div style="color: #64748b;">
                    ${result.score >= 80 ? '素晴らしい発音です！' :
                      result.score >= 60 ? 'もう少し練習しましょう' : '発音を改善しましょう'}
                </div>
            </div>
            
            <div style="text-align: left; margin-bottom: 20px; background: #f8fafc; padding: 15px; border-radius: 8px;">
                <div style="margin-bottom: 10px;">
                    <strong>目標:</strong> "${result.target}"
                </div>
                <div style="margin-bottom: 10px;">
                    <strong>認識結果:</strong> "${result.spoken}"
                </div>
                <div>
                    <strong>信頼度:</strong> ${Math.round(result.confidence * 100)}%
                </div>
            </div>
            
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button onclick="this.closest('.pronunciation-result-modal').remove()" 
                        style="
                            background: #6b7280;
                            color: white;
                            border: none;
                            padding: 10px 20px;
                            border-radius: 6px;
                            cursor: pointer;
                        ">
                    閉じる
                </button>
                <button onclick="
                    window.speechManager.practicePronunciation('${result.target}', showPronunciationResult);
                    this.closest('.pronunciation-result-modal').remove();
                " style="
                    background: #3b82f6;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                ">
                    もう一度
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}
