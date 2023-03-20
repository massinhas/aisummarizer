const startRecording = document.getElementById('startRecording');
const stopRecording = document.getElementById('stopRecording');
const audioInput = document.getElementById('audioInput');

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
}

startRecording.addEventListener('click', start);
stopRecording.addEventListener('click', stop);
audioInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    // Handle the uploaded file
});