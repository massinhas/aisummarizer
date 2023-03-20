import os
from flask import Flask, request, jsonify, render_template
import openai
from waitress import serve
from google.cloud import speech_v1p1beta1 as speech
import io

app = Flask(__name__)

openai.api_key = os.environ.get("OPENAI_API_KEY")
google_credentials_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")

if not openai.api_key:
    raise ValueError("OPENAI_API_KEY environment variable is not set.")
if not google_credentials_path:
    raise ValueError("GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.")

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = google_credentials_path

openai.api_key = "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"
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "C:\\Users\\35193\\Downloads\\innate-client-381223-e8a0c286e3cf.json"

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/summarize', methods=['GET', 'POST'])
def summarize_text():
    data = request.get_json(force=True)
    text = data.get('text', '')

    if not text:
        return jsonify({'error': 'No text provided'}), 400

    return generate_summary(text)

@app.route('/summarize_audio', methods=['POST'])
def summarize_audio():
    audio_file = request.files.get('audio')

    if not audio_file:
        return jsonify({'error': 'No audio file provided'}), 400

    text = transcribe_audio(audio_file)
    return generate_summary(text)

def generate_summary(text):
    try:
        response = openai.Completion.create(
            engine="text-davinci-002",
            prompt=f"Please provide a summary of the following text: {text}",
            max_tokens=100,
            n=1,
            stop=None,
            temperature=0.5,
        )
        summary = response.choices[0].text.strip()
        return jsonify({'summary': summary})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def transcribe_audio(audio_file):
    client = speech.SpeechClient()
    content = audio_file.read()
    audio = speech.RecognitionAudio(content=content)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=16000,
        language_code="en-US",
    )
    response = client.recognize(config=config, audio=audio)
    transcript = ''.join([result.alternatives[0].transcript for result in response.results])
    return transcript

if __name__ == '__main__':
    serve(app, host='0.0.0.0', port=8080)
