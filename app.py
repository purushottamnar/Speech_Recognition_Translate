from flask import Flask, render_template, request, jsonify, send_file
import speech_recognition as sr
from googletrans import Translator
import time
import os
import wave
import pyaudio
import threading
import queue
import numpy as np
import asyncio
from werkzeug.utils import secure_filename
from gtts import gTTS
import tempfile

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize recognizer and translator
recognizer = sr.Recognizer()
translator = Translator()

# Global variables for audio recording
recording = False
audio_queue = queue.Queue()
CHUNK = 1024
FORMAT = pyaudio.paFloat32
CHANNELS = 1
RATE = 44100
frames = []

def record_audio():
    global recording, frames
    frames = []
    
    p = pyaudio.PyAudio()
    stream = p.open(format=FORMAT,
                   channels=CHANNELS,
                   rate=RATE,
                   input=True,
                   frames_per_buffer=CHUNK)
    
    while recording:
        data = stream.read(CHUNK)
        frames.append(data)
    
    stream.stop_stream()
    stream.close()
    p.terminate()
    
    # Save the recorded audio
    wf = wave.open(os.path.join(app.config['UPLOAD_FOLDER'], 'recording.wav'), 'wb')
    wf.setnchannels(CHANNELS)
    wf.setsampwidth(p.get_sample_size(FORMAT))
    wf.setframerate(RATE)
    wf.writeframes(b''.join(frames))
    wf.close()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/start-recording', methods=['POST'])
def start_recording():
    global recording
    recording = True
    threading.Thread(target=record_audio).start()
    return jsonify({'success': True})

@app.route('/stop-recording', methods=['POST'])
def stop_recording():
    global recording
    recording = False
    return jsonify({'success': True})

@app.route('/get-recording-status')
def get_recording_status():
    return jsonify({'is_recording': recording})

@app.route('/get-recognition-result')
def get_recognition_result():
    try:
        with sr.AudioFile(os.path.join(app.config['UPLOAD_FOLDER'], 'recording.wav')) as source:
            audio = recognizer.record(source)
            text = recognizer.recognize_google(audio)
            return jsonify({
                'success': True,
                'text': text
            })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

@app.route('/translate', methods=['POST'])
def translate():
    try:
        # Get the text and languages from the request
        text = request.form.get('text', '')
        source_lang = request.form.get('source_lang', 'auto')
        target_lang = request.form.get('target_lang', 'en')
        
        if not text:
            return jsonify({
                'success': False,
                'error': 'No text provided'
            })
        
        # Translate the text synchronously
        translation = translator.translate(text, src=source_lang, dest=target_lang)
        
        return jsonify({
            'success': True,
            'translation': translation.text
        })
    except Exception as e:
        print(f"Translation error: {str(e)}")  # Add debug logging
        return jsonify({
            'success': False,
            'error': str(e)
        })

@app.route('/speech-to-text', methods=['POST'])
def speech_to_text():
    try:
        # Get the audio file from the request
        if 'audio' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No audio file provided'
            })
        
        audio_file = request.files['audio']
        if audio_file.filename == '':
            return jsonify({
                'success': False,
                'error': 'No selected file'
            })
        
        # Save the audio file temporarily
        filename = secure_filename(audio_file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        audio_file.save(filepath)
        
        # Process the audio file
        with sr.AudioFile(filepath) as source:
            audio = recognizer.record(source)
            text = recognizer.recognize_google(audio)
        
        # Clean up the temporary file
        os.remove(filepath)
        
        return jsonify({
            'success': True,
            'text': text
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

@app.route('/text-to-speech', methods=['POST'])
def text_to_speech():
    temp_file = None
    try:
        # Get the text and language from the request
        text = request.form.get('text', '')
        lang = request.form.get('lang', 'en')
        
        if not text:
            return jsonify({
                'success': False,
                'error': 'No text provided'
            })
        
        # Create a temporary file for the audio
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.mp3')
        temp_file.close()
        
        # Generate speech
        tts = gTTS(text=text, lang=lang)
        tts.save(temp_file.name)
        
        # Send the audio file
        return send_file(
            temp_file.name,
            mimetype='audio/mpeg',
            as_attachment=True,
            download_name='speech.mp3'
        )
    except Exception as e:
        print(f"Text-to-speech error: {str(e)}")  # Add debug logging
        return jsonify({
            'success': False,
            'error': str(e)
        })
    finally:
        # Clean up the temporary file
        if temp_file and os.path.exists(temp_file.name):
            try:
                os.unlink(temp_file.name)
            except Exception as e:
                print(f"Error cleaning up temp file: {str(e)}")

if __name__ == '__main__':
    app.run(debug=True)