'use strict';

////////////////////////////////////////
// Voice transcription
// Set up the Cloud Voice API using the instructions in README.md.
////////////////////////////////////////

////////////////////////////////////////
// Establish variables
////////////////////////////////////////

// Initialize vars
let final_transcript = ''; // Holds most updated version of transcription at any point
let published_transcript = '';
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
  published_transcript = '';
  recognition.start();
  ignore_on_end = false;
  start_timestamp = event.timeStamp;
}

////////////////////////////////////////
// Visual feedback
////////////////////////////////////////

function setMicGifTo(image) {
  let path = './static/images/' + image + '.gif';
  $('#mic-img').attr('src', path);
}

// Publishes what was not yet been published
function addToTextArea(text) {
  if (!text.indexOf(published_transcript) == 0) {
    console.log("ERROR FINAL DOESN'T MATCH PUBLISHED!");
  }
  let newText = text.slice(published_transcript.length);
  insertAtCursor(linebreak(newText));
  published_transcript += newText;
}

// Inserts text at cursor
function insertAtCursor(text) {
  let field = document.getElementById("user-input");
  // IE support
  if (document.selection) {
      field.focus();
      let sel = document.selection.createRange();
      sel.text = text;
  }
  // MOZILLA and others
  else if (field.selectionStart || field.selectionStart == '0') {
      let startPos = field.selectionStart;
      let endPos = field.selectionEnd;
      field.value = field.value.substring(0, startPos)
          + text
          + field.value.substring(endPos, field.value.length);
  } else {
      field.value += text;
  }
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
    setMicGifTo('mic-animate');
  };

  ////////////////////////////////////////
  // On error
  ////////////////////////////////////////
  recognition.onerror = function(event) {
    setMicGifTo('mic');
    ignore_on_end = true;

    // No speech
    if (event.error == 'no-speech') {
      console.log("NO SPEECH");
    }
    // No microphone
    else if (event.error == 'audio-capture') {
      setMicGifTo('mic-slash');
      console.log("NO MICROPHONE");
    }
    // Not allowed
    else if (event.error == 'not-allowed') {
      setMicGifTo('mic-slash');
      if (event.timeStamp - start_timestamp < 100) {
        console.log("ERROR BLOCKED");
      } else {
        console.log("ERROR DENIED");
      }
    }
    // Other
    else {
      console.log("ERROR");
    }
  };

  ////////////////////////////////////////
  // On end
  ////////////////////////////////////////
  recognition.onend = function() {
    recognizing = false;
    if (!ignore_on_end) {
      setMicGifTo("mic"); // Reset mic image
    }

    if (ignore_on_end || !final_transcript) { // If there was some error
      return;
    }

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

    // Temporary solution: only add when we're fairly confident.
    addToTextArea(final_transcript);
    if (final_transcript) {
      console.log("FINAL: " + final_transcript);
    } else {
      console.log("Guess: " + interim_transcript);
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
