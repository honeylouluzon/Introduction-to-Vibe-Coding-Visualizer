const podcastButton = document.getElementById('podcast-button');
const conversationText = document.getElementById('conversation-text');
let isSpeaking = false;
let speechSynthesisUtterance;

podcastButton.addEventListener('click', () => {
  if (!isSpeaking) {
    // Start Text-to-Speech
    const text = conversationText?.textContent.trim();
    if (text) {
      speechSynthesisUtterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(speechSynthesisUtterance);
      podcastButton.classList.add('active');
      podcastButton.textContent = '🔊 Stop';
      isSpeaking = true;

      // Stop button when speech ends
      speechSynthesisUtterance.onend = () => {
        resetButton();
      };
    } else {
      console.warn('No text available to read.');
    }
  } else {
    // Stop Text-to-Speech
    speechSynthesis.cancel();
    resetButton();
  }
});

function resetButton() {
  podcastButton.classList.remove('active');
  podcastButton.textContent = '🎙️ Listen';
  isSpeaking = false;
}