# Speech Translator with Text-to-Speech

A powerful web application that combines speech recognition, translation, and text-to-speech capabilities. Built with Flask, this application allows users to convert speech to text, translate between multiple languages, and convert text to speech.

## Features

### 1. Speech Recognition
- Record speech through your microphone
- Real-time recording status indicator
- Automatic conversion of speech to text
- Support for multiple languages

### 2. Text Translation
- Translate text between multiple languages
- Auto-detect source language
- Support for 10+ languages including:
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

### 3. Text-to-Speech
- Dedicated section for text-to-speech conversion
- Multiple English voice variants:
  - Standard English
  - US English
  - UK English
  - Australian English
  - Indian English
- Instant audio playback
- High-quality voice synthesis

## Prerequisites

- Python 3.7 or higher
- Microphone (for speech recognition)
- Speakers (for text-to-speech)

## Installation

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

3. Install the required packages:
```bash
pip install -r requirements.txt
```

### Note for Windows Users
If you encounter issues installing PyAudio, you can download the appropriate wheel file from [here](https://www.lfd.uci.edu/~gohlke/pythonlibs/#pyaudio) and install it using:
```bash
pip install PyAudio-0.2.11-cp39-cp39-win_amd64.whl  # Replace with your Python version
```

## Usage

1. Start the Flask application:
```bash
python app.py
```

2. Open your web browser and navigate to:
```
http://localhost:5000
```

3. Using the Application:

   a. Speech Recognition:
   - Click "Start Recording"
   - Speak your text
   - Click "Stop Recording"
   - The recognized text will appear in the translation input box

   b. Translation:
   - Enter text in the input box (or use speech recognition)
   - Select source and target languages
   - Click "Translate"
   - The translation will appear in the output box

   c. Text-to-Speech:
   - Enter English text in the dedicated text-to-speech box
   - Select your preferred English voice variant
   - Click "Speak Text"
   - The text will be read aloud

## Project Structure

```
speech-translator/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── static/
│   ├── style.css         # CSS styles
│   └── script.js         # Frontend JavaScript
├── templates/
│   └── index.html        # Main HTML template
└── uploads/              # Temporary audio files
```

## Technologies Used

- **Backend:**
  - Flask (Web Framework)
  - SpeechRecognition (Speech-to-Text)
  - googletrans (Translation)
  - gTTS (Text-to-Speech)
  - PyAudio (Audio Recording)

- **Frontend:**
  - HTML5
  - CSS3
  - JavaScript (ES6+)
  - Font Awesome (Icons)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Translate API for translation services
- Google Text-to-Speech for voice synthesis
- SpeechRecognition library for speech recognition
- Flask framework and its contributors 