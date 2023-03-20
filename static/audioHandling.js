// Get references to the HTML elements
const startRecording = document.getElementById('startRecording');
const stopRecording = document.getElementById('stopRecording');
let mediaRecorder;
let recordedChunks = [];
let audioContext;

// Add an event listener to the start recording button
startRecording.addEventListener('click', async function() {
  // Create an AudioContext if one doesn't already exist, or resume the existing one if it's suspended
  if (!audioContext) {
    audioContext = new AudioContext();
  } else if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  // Get access to the user's microphone
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  // Create a MediaRecorder object and pass the MediaStream to its constructor
  mediaRecorder = new MediaRecorder(stream);

  // Add an event listener to the MediaRecorder that listens for the "dataavailable" event
  mediaRecorder.addEventListener('dataavailable', (e) => {
    recordedChunks.push(e.data);
  });

  // Start the MediaRecorder
  mediaRecorder.start();

  // Disable the start recording button and enable the stop recording button
  startRecording.disabled = true;
  stopRecording.disabled = false;
});

// Add an event listener to the stop recording button
stopRecording.addEventListener('click', function() {
  // Stop the MediaRecorder
  mediaRecorder.stop();

  // Disable the stop recording button
  stopRecording.disabled = true;

  // Prepare the recorded audio data for transcription
  const blob = new Blob(recordedChunks, { type: 'audio/wav' });
  const formData = new FormData();
  formData.append('audio_file', blob);

  fetch('/transcribe', {
    method: 'POST',
    body: formData
  })
  .then(response => response.text())
  .then(transcription => {
    // Display the transcribed text in the web page
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = transcription;

    // Summarize the transcribed text using the server-side function
    fetch('/summarize', {
      method: 'POST',
      body: JSON.stringify({text: transcription}),
      headers: {'Content-Type': 'application/json'}
    })
    .then(response => response.json())
    .then(summary => {
      // Display the summarized text in the web page
      const summaryDiv = document.getElementById('summary');
      summaryDiv.textContent = summary.summary;
    })
    .catch(error => {
      console.error(error);
      alert('Failed to summarize text');
    });
  })
  .catch(error => {
    console.error(error);
    alert('Failed to transcribe audio');
  });
});
