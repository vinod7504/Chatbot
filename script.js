function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (message === "") return;

  addMessage("user", message);
  input.value = "";

  const aiAgentURL = "http://localhost:5678/webhook-test/https://vinod7504.github.io/Chatbot/";

  fetch(aiAgentURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: message }) 
  })
  .then(res => res.json())
  .then(data => {
    const reply = data.reply || data.answer || "AI Agent did not respond.";
    addMessage("bot", reply);
  })
  .catch(err => {
    console.error("AI Agent Error:", err);
    addMessage("bot", "Sorry, there was a problem talking to the AI.");
  });
}


function addMessage(sender, text) {
  const chatBox = document.getElementById("chat-box");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);
  messageDiv.textContent = text;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}


function startListening() {
  if (!('webkitSpeechRecognition' in window)) {
    alert("Your browser doesn't support speech recognition. Try Chrome.");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    console.log("Listening...");
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById("user-input").value = transcript;
    sendMessage();
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    alert("Could not recognize your voice. Please try again.");
  };

  recognition.start();
}

