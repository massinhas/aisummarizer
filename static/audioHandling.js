const startRecording = document.getElementById('startRecording');
const stopRecording = document.getElementById('stopRecording');
const audioInput = document.getElementById('audioInput');

let mediaRecorder;
let recordedChunks = [];
let audioContext;

async function start() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.addEventListener('dataavailable', (e) => {
            recordedChunks.push(e.data);
        });
        mediaRecorder.start();
        stopRecording.disabled = false;
    } catch (err) {
        console.error(err);
        alert('Failed to get access to microphone');
    }
}

function stop() {
    mediaRecorder.stop();
    stopRecording.disabled = true;
}

function startAudioContext() {
    if (!audioContext) {
        audioContext = new AudioContext();
    } else if (audioContext.state === "suspended") {
        audioContext.resume();
    }
}

startRecording.addEventListener('click', () => {
    const confirmation = confirm('Do you want to start recording?');
    if (confirmation) {
        startAudioContext();
        start();
    }
});

stopRecording.addEventListener('click', stop);

audioInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    // Handle the uploaded file
});
