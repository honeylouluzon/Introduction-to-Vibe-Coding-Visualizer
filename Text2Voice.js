// ...existing code...

// Locate the conversation box element
const conversationBox = document.querySelector('.conversation-box');

if (conversationBox) {
    const textToSpeak = conversationBox.textContent || conversationBox.innerText;

    // Use the text-to-speech API or logic here
    const speech = new SpeechSynthesisUtterance(textToSpeak);
    window.speechSynthesis.speak(speech);
} else {
    console.error('Conversation box not found!');
}

// ...existing code...