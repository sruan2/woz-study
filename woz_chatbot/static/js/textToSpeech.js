'use strict';

////////////////////////////////////////
// Voice generation
////////////////////////////////////////

function checkIfSpeechSynthesisEnabled() {
  let speakToggle = document.getElementById("speak-msg");
  if (!speakToggle) return;
  if (!('speechSynthesis' in window)) {
    speakToggle.disabled = true;
    console.log("ERROR: Speech synthesis not supported.");
  } else {
    speakToggle.value = true;
  }
}

////////////////////////////////////////
// Establish message
////////////////////////////////////////

let msg = new SpeechSynthesisUtterance();
msg.lang = 'en-US';
msg.pitch = 1;

// Voices are loaded asynchronouosly
window.speechSynthesis.onvoiceschanged = function() {
  msg.voice = speechSynthesis.getVoices()[32]; // 32 or 40
};

////////////////////////////////////////
// Speak function
////////////////////////////////////////

function speak(text) {
  msg.text = text;
  speechSynthesis.speak(msg);
}

////////////////////////////////////////
// Decide if speaking is enabled
////////////////////////////////////////

function shouldSpeakMessage() {
  let speakToggle = document.getElementById("speak-msg");
  // If not on user page, never speak
  if (!speakToggle) return false;
  // Otherwise, return value of toggle
  console.log(speakToggle)
  return speakToggle.checked;
}
