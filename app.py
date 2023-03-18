import os
from flask import Flask, request, jsonify, render_template
import openai

app = Flask(__name__)

openai.api_key = "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"

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/summarize', methods=['POST'])
def summarize_text():
    data = request.get_json(force=True)
    text = data.get('text', '')

    if not text:
        return jsonify({'error': 'No text provided'}), 400

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

if __name__ == '__main__':
    app.run(debug=True)
