const podcastButton = document.getElementById('podcast-button');
const conversationBox = document.querySelector('.conversation-box');
let isSpeaking = false;
let speechSynthesisUtterance;
let observer;

// Function to start reading the conversation
function startSpeaking() {
  if (conversationBox) {
    const text = conversationBox?.textContent.trim();
    if (text) {
      speechSynthesisUtterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(speechSynthesisUtterance);

      // Handle when speech ends
      speechSynthesisUtterance.onend = () => {
        if (isSpeaking) {
          startSpeaking(); // Continue reading if still speaking
        }
      };
    } else {
      console.warn('No text available to read.');
    }
  } else {
    console.error('Conversation box not found!');
  }
}

// Function to stop speaking
function stopSpeaking() {
  speechSynthesis.cancel();
  resetButton();
}

// Function to reset the button state
function resetButton() {
  podcastButton.classList.remove('active');
  podcastButton.textContent = '🎙️ Listen';
  isSpeaking = false;

  // Disconnect the observer when stopped
  if (observer) {
    observer.disconnect();
  }
}

// Observe changes in the conversation box
function observeConversationBox() {
  if (conversationBox) {
    observer = new MutationObserver(() => {
      if (isSpeaking && !speechSynthesis.speaking) {
        startSpeaking(); // Restart speaking when new content is added
      }
    });

    observer.observe(conversationBox, { childList: true, subtree: true });
  } else {
    console.error('Conversation box not found for observation!');
  }
}

// Event listener for the podcast button
podcastButton.addEventListener('click', () => {
  if (!isSpeaking) {
    // Start Text-to-Speech
    isSpeaking = true;
    podcastButton.classList.add('active');
    podcastButton.textContent = '🔊 Stop';
    startSpeaking();
    observeConversationBox();
  } else {
    // Stop Text-to-Speech
    stopSpeaking();
  }
});