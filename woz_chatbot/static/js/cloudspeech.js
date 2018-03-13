'use strict';

////////////////////////////////////////
// Voice transcription
// Set up the Cloud Voice API using the instructions in README.md.
////////////////////////////////////////

////////////////////////////////////////
// Establish variables
////////////////////////////////////////

// Store reference to UI
let mic_button = $('#mic-btn');
let mic_img = $('#mic-img');

// TODO: Update UI with transcriptions
// let final_span = {};
// let inner_span = {};
// let interim_span = {};

// Initialize vars
let final_transcript = ''; // Holds most updated version of transcription at any point
let recognizing = false; // Whether or not we're transcribing
let ignore_on_end; // If false, ignore results when done transcribing
let start_timestamp;

////////////////////////////////////////
// On click mic callback
////////////////////////////////////////

function onMicClick(event) {
  // If this click turns off transcription...
  if (recognizing) {
    recognition.stop();
    return;
  }

  // Otherwise, prepare to start transcribing...
  final_transcript = '';
  recognition.start();
  ignore_on_end = false;
  start_timestamp = event.timeStamp;

  // final_span.innerHTML = '';
  // interim_span.innerHTML = '';
  // mic_img.attr('src', '../images/mic-slash.gif');
}

////////////////////////////////////////
// Set up Recognition
////////////////////////////////////////

// If not supported...
if (!('webkitSpeechRecognition' in window)) {
  console.log("not supported")
  mic_button.style.visibility = 'hidden';

// Otherwise, set up recognition object
} else {
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  ////////////////////////////////////////
  // On start
  ////////////////////////////////////////
  recognition.onstart = function() {
    console.log("START");
    recognizing = true;
    // TODO: Debug why mic image changes don't work
    mic_img.src = '../images/mic-animate.gif';
  };

  ////////////////////////////////////////
  // On error
  ////////////////////////////////////////
  recognition.onerror = function(event) {
    // No speech
    if (event.error == 'no-speech') {
      mic_img.src = '../images/mic.gif';
      ignore_on_end = true;
      console.log("NO SPEECH");
    }
    // No microphone
    if (event.error == 'audio-capture') {
      mic_img.src = '../images/mic.gif';
      ignore_on_end = true;
      console.log("NO MICROPHONE");
    }
    // Not allowed
    if (event.error == 'not-allowed') {
      if (event.timeStamp - start_timestamp < 100) {
        console.log("ERROR BLOCKED");
      } else {
        console.log("ERROR DENIED");
      }
      ignore_on_end = true;
    }
  };

  ////////////////////////////////////////
  // On end
  ////////////////////////////////////////
  recognition.onend = function() {
    recognizing = false;
    mic_img.src = '../images/mic.gif'; // Reset mic image

    if (ignore_on_end || !final_transcript) { // If there was some error
      return;
    }

    // Dealing with span
    // if (window.getSelection) {
    //   window.getSelection().removeAllRanges();
    //   var range = document.createRange();
    //   range.selectNode(document.getElementById('final_span'));
    //   window.getSelection().addRange(range);
    // }

    console.log("END");
    console.log("Final transcription: " + final_transcript);
  };

  ////////////////////////////////////////
  // On result
  ////////////////////////////////////////
  recognition.onresult = function(event) {
    var interim_transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }

    final_transcript = capitalize(final_transcript);
    // final_span.innerHTML = linebreak(final_transcript);
    // interim_span.innerHTML = linebreak(interim_transcript);

    if (final_transcript || interim_transcript) {
      console.log(interim_transcript);
    }
  };
}

////////////////////////////////////////
// Formatting
////////////////////////////////////////
let two_line = /\n\n/g;
let one_line = /\n/g;
function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}
let first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}
