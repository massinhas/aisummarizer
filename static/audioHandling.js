const startRecording = document.getElementById('startRecording');
const stopRecording = document.getElementById('stopRecording');
const audioInput = document.getElementById('audioInput');
const audioSummary = document.getElementById('audioSummary');
const summaryElement = document.getElementById('summary');

let mediaRecorder;
let recordedChunks = [];

async function start() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.addEventListener('dataavailable', (e) => {
        recordedChunks.push(e.data);
    });
    mediaRecorder.start();
    stopRecording.disabled = false;
}

function stop() {
    mediaRecorder.stop();
    stopRecording.disabled = true;
    processRecording();
}

async function processRecording() {
    const blob = new Blob(recordedChunks);
    const formData = new FormData();
    formData.append('audio', blob);

    try {
        const response = await fetch('/transcribe', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            summaryElement.textContent = 'Summarizing...';

            try {
                const response = await fetch('/summarize', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text: data.transcription }),
                });

                if (response.ok) {
                    const data = await response.json();
                    summaryElement.textContent = data.summary;
                    audioSummary.style.display = 'block';
                } else {
                    const errorData = await response.json();
                    summaryElement.textContent = 'Error: ' + errorData.error;
                }
            } catch (error) {
                summaryElement.textContent = 'Error: ' + error.message;
            }
        } else {
            const errorData = await response.json();
            summaryElement.textContent = 'Error: ' + errorData.error;
        }
    } catch (error) {
        summaryElement.textContent = 'Error: ' + error.message;
    }
}

startRecording.addEventListener('click', start);
stopRecording.addEventListener('click', stop);
audioInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    // Handle the uploaded file
});
