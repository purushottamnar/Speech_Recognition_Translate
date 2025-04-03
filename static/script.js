document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const startRecordBtn = document.getElementById('startRecord');
    const stopRecordBtn = document.getElementById('stopRecord');
    const recordingStatus = document.getElementById('recordingStatus');
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const sourceLang = document.getElementById('sourceLang');
    const targetLang = document.getElementById('targetLang');
    const translateBtn = document.getElementById('translateBtn');
    const speakBtn = document.getElementById('speakBtn');
    const ttsLang = document.getElementById('ttsLang');
    const speakTranslationBtn = document.getElementById('speakTranslationBtn');
    const ttsInput = document.getElementById('ttsInput');

    // Speech to Text functionality
    startRecordBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/start-recording', {
                method: 'POST'
            });
            
            if (response.ok) {
                startRecordBtn.disabled = true;
                stopRecordBtn.disabled = false;
                recordingStatus.textContent = 'Recording... Speak now!';
                recordingStatus.style.color = '#f44336';
                recordingStatus.classList.add('recording');
                
                // Poll for results
                pollRecordingStatus();
            } else {
                recordingStatus.textContent = 'Failed to start recording';
                recordingStatus.style.color = '#f44336';
                recordingStatus.classList.remove('recording');
            }
        } catch (error) {
            console.error('Error:', error);
            recordingStatus.textContent = `Error: ${error.message}`;
            recordingStatus.style.color = '#f44336';
            recordingStatus.classList.remove('recording');
        }
    });

    stopRecordBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/stop-recording', {
                method: 'POST'
            });
            
            if (response.ok) {
                startRecordBtn.disabled = false;
                stopRecordBtn.disabled = true;
                recordingStatus.textContent = 'Processing...';
                recordingStatus.style.color = '#1a237e';
                recordingStatus.classList.remove('recording');
                
                // Wait a bit for the audio to be processed
                setTimeout(async () => {
                    try {
                        const result = await fetch('/get-recognition-result');
                        const data = await result.json();
                        
                        if (data.success) {
                            inputText.value = data.text; // Auto-fill translation input
                            recordingStatus.textContent = 'Speech recognized successfully!';
                            recordingStatus.style.color = '#4caf50';
                            // Set source language to English after speech recognition
                            sourceLang.value = 'en';
                        } else {
                            recordingStatus.textContent = `Error: ${data.error}`;
                            recordingStatus.style.color = '#f44336';
                        }
                    } catch (error) {
                        recordingStatus.textContent = `Error: ${error.message}`;
                        recordingStatus.style.color = '#f44336';
                    }
                }, 1000);
            } else {
                recordingStatus.textContent = 'Failed to stop recording';
                recordingStatus.style.color = '#f44336';
                recordingStatus.classList.remove('recording');
            }
        } catch (error) {
            console.error('Error:', error);
            recordingStatus.textContent = `Error: ${error.message}`;
            recordingStatus.style.color = '#f44336';
            recordingStatus.classList.remove('recording');
        }
    });

    // Poll for recording status
    async function pollRecordingStatus() {
        try {
            const response = await fetch('/get-recording-status');
            const data = await response.json();
            
            if (data.is_recording) {
                setTimeout(pollRecordingStatus, 1000); // Poll every second
            }
        } catch (error) {
            console.error('Error polling status:', error);
        }
    }

    // Translation functionality
    translateBtn.addEventListener('click', async () => {
        const text = inputText.value.trim();
        if (!text) {
            outputText.value = 'Please enter text to translate';
            return;
        }

        try {
            translateBtn.disabled = true;
            translateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Translating...';
            
            const response = await fetch('/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `text=${encodeURIComponent(text)}&source_lang=${sourceLang.value}&target_lang=${targetLang.value}`
            });

            const data = await response.json();
            if (data.success) {
                outputText.value = data.translation;
                // Enable the speak translation button
                speakTranslationBtn.disabled = false;
                // Set the font family based on the target language
                if (targetLang.value === 'hi') {
                    outputText.style.fontFamily = "'Noto Sans Devanagari', sans-serif";
                } else {
                    outputText.style.fontFamily = "'Roboto', sans-serif";
                }
            } else {
                outputText.value = `Error: ${data.error}`;
                speakTranslationBtn.disabled = true;
            }
        } catch (error) {
            outputText.value = `Error: ${error.message}`;
            speakTranslationBtn.disabled = true;
        } finally {
            translateBtn.disabled = false;
            translateBtn.innerHTML = '<i class="fas fa-language"></i> Translate';
        }
    });

    // Function to speak text
    async function speakText(text, lang, button) {
        if (!text) {
            alert('No text to speak');
            return;
        }

        try {
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating Speech...';

            const formData = new FormData();
            formData.append('text', text);
            formData.append('lang', lang);

            const response = await fetch('/text-to-speech', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to generate speech');
            }

            // Create a blob from the response
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            
            // Create an audio element and play the speech
            const audio = new Audio(url);
            audio.onended = () => {
                window.URL.revokeObjectURL(url);
                button.disabled = false;
                button.innerHTML = button === speakBtn ? 
                    '<i class="fas fa-volume-up"></i> Speak Text' : 
                    '<i class="fas fa-volume-up"></i> Speak Translation';
            };
            
            await audio.play();
        } catch (error) {
            console.error('Text-to-speech error:', error);
            alert('Failed to generate speech. Please try again.');
            button.disabled = false;
            button.innerHTML = button === speakBtn ? 
                '<i class="fas fa-volume-up"></i> Speak Text' : 
                '<i class="fas fa-volume-up"></i> Speak Translation';
        }
    }

    // Text-to-Speech functionality for the dedicated TTS section
    speakBtn.addEventListener('click', async () => {
        const text = ttsInput.value.trim();
        if (!text) {
            alert('Please enter English text to convert to speech');
            return;
        }

        await speakText(text, ttsLang.value, speakBtn);
    });

    // Text-to-Speech functionality for translated text
    speakTranslationBtn.addEventListener('click', async () => {
        const text = outputText.value.trim();
        if (!text) {
            alert('No translation to speak');
            return;
        }

        // Use the target language for speaking the translation
        await speakText(text, targetLang.value, speakTranslationBtn);
    });
}); 