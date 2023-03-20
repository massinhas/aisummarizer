// Get references to the HTML elements
const startRecording = document.getElementById('startRecording');
const stopRecording = document.getElementById('stopRecording');
const playButton = document.getElementById('playButton');
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

  // Prepare the recorded audio data for playback and transcription
  const blob = new Blob(recordedChunks, { type: 'audio/wav' });
  const audioURL = URL.createObjectURL(blob);

  // Set the source of the audio element to the recorded audio data
  const audioElement = document.getElementById('recordedAudio');
  audioElement.src = audioURL;

  // Transcribe the recorded audio data using the server-side function
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
  })
  .catch(error => {
    console.error(error);
    alert('Failed to transcribe audio');
  });
});

// Add an event listener to the play button
playButton.addEventListener('click', function() {
  // Create an AudioContext if one doesn't already exist, or resume the existing one if it's suspended
  if (!audioContext) {
    audioContext = new AudioContext();
  } else if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  // Create an AudioBufferSourceNode and connect it to the AudioContext
  const source = audioContext.createBufferSource();
  source.connect(audioContext.destination);

  // Load the audio file using XMLHttpRequest and decode it into an AudioBuffer
  const request = new XMLHttpRequest();
  request.open('GET', audioElement.src, true);
  request.responseType = 'arraybuffer';

  request.onload = function() {
    audioContext.decodeAudioData(request.response, function(buffer) {
      // Set the AudioBuffer as the source of the AudioBufferSourceNode
      source.buffer = buffer;
      // Start playing the audio
      source.start(0);
    });
  };

  request.send();
});
