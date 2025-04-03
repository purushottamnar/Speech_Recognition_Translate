# Speech Translator with Text-to-Speech

A modern web application that combines speech recognition, language translation, and text-to-speech capabilities. Built with Python (Flask) and JavaScript, this application offers a user-friendly interface for real-time speech translation and text-to-speech conversion.

![Speech Translator Demo](demo.gif)

## 🌟 Key Features

- **Speech Recognition**: Record and convert speech to text in real-time
- **Language Translation**: Translate text between multiple languages
- **Text-to-Speech**: Convert text to speech in various languages
- **Modern UI**: Clean and responsive interface with intuitive controls
- **Auto Language Detection**: Automatically detect the source language
- **Multiple Language Support**: Supports translation between various languages including:
  - English
  - Hindi
  - Spanish
  - French
  - German
  - Italian
  - Portuguese
  - Russian
  - Japanese
  - Korean
  - Chinese (Simplified)

## 🛠️ Technologies Used

- **Backend**:
  - Python 3.x
  - Flask (Web Framework)
  - SpeechRecognition (Speech to Text)
  - googletrans (Translation)
  - gTTS (Text to Speech)
  - PyAudio (Audio Processing)

- **Frontend**:
  - HTML5/CSS3
  - JavaScript (ES6+)
  - Font Awesome (Icons)
  - Google Fonts

## 🚀 Getting Started

### Prerequisites

- Python 3.x
- pip (Python package manager)
- Microphone (for speech recognition)
- Speakers (for text-to-speech)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/speech-translator.git
   cd speech-translator
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Running the Application

1. Start the Flask server:
   ```bash
   python app.py
   ```

2. Open your web browser and navigate to:
   ```
   http://localhost:5000
   ```

## 📖 Usage Guide

### Speech Recognition
1. Click the "Start Recording" button
2. Speak into your microphone
3. Click "Stop Recording" when finished
4. Your speech will be converted to text automatically

### Translation
1. Enter text in the input box (or use speech recognition)
2. Select source language (or use auto-detect)
3. Select target language
4. Click "Translate" button
5. View the translation in the output box
6. Click "Speak Translation" to hear the translated text

### Text-to-Speech
1. Enter text in the text-to-speech input box
2. Select the desired language
3. Click the "Speak" button to hear the text

## 🐛 Troubleshooting

- **Microphone Issues**: Ensure your microphone is properly connected and selected as the default input device
- **Translation Errors**: Check your internet connection as translation services require online access
- **Audio Playback**: Make sure your speakers are working and not muted

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues or have questions, please open an issue in the GitHub repository.

## Acknowledgments

- [Google Translate API](https://cloud.google.com/translate)
- [SpeechRecognition](https://pypi.org/project/SpeechRecognition/)
- [gTTS](https://pypi.org/project/gTTS/)
- [Flask](https://flask.palletsprojects.com/) 
