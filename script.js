
const messageInput = document.querySelector(".message-input");
const chatBody = document.querySelector(".chat-body");
const sendMessageButton = document.getElementById("send-message");
const fileInput = document.getElementById("file-input");

const API_KEY = "AIzaSyDgkpzr6v6zxF1sF_ILa24z_kxBFNfVu3o";

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY} `;

const userData = {
    message: null,
    file: {
        data: null,
        mime_type: null
    }
};

// Handle keydown event for Enter key
messageInput.addEventListener("keydown", (e) => {
  const userMessage = e.target.value.trim();
  if (e.key === "Enter" && userMessage) {
    handleOutgoingMessage(e, userMessage);
  }
});
//generate bot response
const generateBotResponse = async (incomingMessageDiv) => {
    const messageElement = incomingMessageDiv.querySelector('.message-text')
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: userData.message }, ...(userData.file.data ? [{inline_data: userData.file }]: [])],
        },
      ],
    }),
  };
  try {
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);
      const botMessage = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
      messageElement.textContent = botMessage;
  } catch (error) {
      console.log(error);
      messageElement.textContent = "Error: " + error.message;
      messageElement.style.color = "red";
  } finally {
      incomingMessageDiv.classList.remove("thinking");
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

      messageInput.focus();

  }
};
  setTimeout(() => {
    const messageContent = `  <div class="message bot-message">
                <img src="./images/chatbot.png" width="50px" height="50px" alt="">
                <div class="message-text">
                    <p class="message">How can I help you?</p>
                </div>
            </div>`;
    const incomingMessageDiv = createMessageElement(
      messageContent,
      "bot-message"
    );
      chatBody.appendChild(incomingMessageDiv);
  }, 1000);


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
    const messageContent = `<div class="message-text"></div>
    ${userData.file.data ? `<img src="data:${userData.file.mime_type}; base64, ${userData.file.data}" class="attachment"/>` : ""}
    `
        ;
  const outgoingMessageDiv = createMessageElement(
    messageContent,
    "user-message"
  );
    outgoingMessageDiv.querySelector(".message-text").textContent =
    userData.message;

  // Append the message to the chat body
    chatBody.appendChild(outgoingMessageDiv);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
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
            chatBody.scrollTo({
              top: chatBody.scrollHeight,
              behavior: "smooth",
            });

        generateBotResponse(incomingMessageDiv);
     
    
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



// Handle file upload
fileInput.addEventListener("change", (e) => {
    const file = fileInput.files[0];
    if (file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const base64String = e.target.split(',')[1];
        userData.file= {
            data: base64String,
                mime_type: file.type
        }
        fileInput.value = '';
    }
    reader.readAsDataURL(file);
    })


document.getElementById('file-upload').addEventListener("click", ()=> fileInput.click())