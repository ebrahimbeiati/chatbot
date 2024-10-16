const messageInput = document.querySelector(".message-input");
const chatBody = document.querySelector(".chat-body");
const sendMessageButton = document.getElementById("send-message");

const userData = {
  message: null,
};

// Handle keydown event for Enter key
messageInput.addEventListener("keydown", (e) => {
  const userMessage = e.target.value.trim();
  if (e.key === "Enter" && userMessage) {
    handleOutgoingMessage(e, userMessage);
  }
});

// Create message element with dynamic classes
const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

// Handle outgoing user messages
const handleOutgoingMessage = (e, userMessage) => {
  e.preventDefault();

  // Set userData message
  userData.message = userMessage || messageInput.value.trim();

  // Clear the input field
  messageInput.value = "";

  // Create the message content with userData.message
    const messageContent = `<div class="message-text"></div>`;
  const outgoingMessageDiv = createMessageElement(
    messageContent,
    "user-message"
  );
    outgoingMessageDiv.querySelector(".message-text").textContent =
    userData.message;

  // Append the message to the chat body
    chatBody.appendChild(outgoingMessageDiv);
    setTimeout(() => {

    const messageContent = `  <div class="message bot-message thinking">
                <img src="./images/chatbot.png" width="50px" height="50px" alt="">
                <div class="message-text">
                    <div class="thinking-indicator">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                </div>
            </div>`;
    const incomingMessageDiv = createMessageElement(
      messageContent,
      "bot-message",
      "think"
    );
    chatBody.appendChild(incomingMessageDiv);
     
    
}, 600)
};

// Simulate a delay for demonstration purposes


// Handle Send button click
sendMessageButton.addEventListener("click", (e) => {
  const userMessage = messageInput.value.trim();
  if (userMessage) {
    handleOutgoingMessage(e, userMessage);
  }
});
