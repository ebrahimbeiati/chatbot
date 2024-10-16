
const messageInput = document.querySelector(".message-input");
const chatBody = document.querySelector(".chat-body");
const sendMessageButton = document.getElementById("send-message");
const fileInput = document.getElementById("file-input");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
const fileCancelButton = document.getElementById("file-cancel");
const chatbotToggler = document.getElementById("chatbot-toggler");
const closeChatbot = document.getElementById("close-chat");






const API_KEY = "AIzaSyDgkpzr6v6zxF1sF_ILa24z_kxBFNfVu3o";

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY} `;

const userData = {
    message: null,
    file: {
        data: null,
        mime_type: null
    }
};
const chatHistory = [];
const initialInputHeight = messageInput.scrollHeight;

// Handle keydown event for Enter key
messageInput.addEventListener("keydown", (e) => {
  const userMessage = e.target.value.trim();
  if (e.key === "Enter" && userMessage && !e.shiftKey && window.innerWidth > 768) {
    handleOutgoingMessage(e, userMessage);
  }
});
messageInput.addEventListener('input', () => {
    messageInput.style.height = `${initialInputHeight}px`;
    messageInput.style.height = `${messageInput.scrollHeight}px`;
    document.querySelector('.chat-form').style.borderRadius = messageInput.initialInputHeight ? '15px':'32px'
    
}
)
//generate bot response
const generateBotResponse = async (incomingMessageDiv) => {
    const messageElement = incomingMessageDiv.querySelector('.message-text');
    chatHistory.push({
      role: "user",
      parts: [
        { text: userData.message },
        ...(userData.file.data ? [{ inline_data: userData.file }] : []),
      ],
    });
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: chatHistory
    }),
  };
  try {
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);
      const botMessage = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
      messageElement.textContent = botMessage;
       chatHistory.push({
         role: "model",
         parts: [{ text: botMessage }]
       });
  } catch (error) {
      console.log(error);
      messageElement.textContent = "Error: " + error.message;
      messageElement.style.color = "red";
  } finally {
      userData.file();
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
    fileUploadWrapper.classList.remove('file-uploaded');
    messageInput.dispatchEvent(new Event('input'));

  // Create the message content with userData.message
   const messageContent = `<div class="message-text"></div>
    ${
      userData.file.data
        ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment"/>`
        : ""}`;

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
  if (!file) return; // Only return if no file is selected

  const reader = new FileReader();
    reader.onload = (e) => {
        fileUploadWrapper.querySelector('img').src = e.target.result;
        fileUploadWrapper.classList.add('file-uploaded')

    const base64String = e.target.result.split(",")[1]; // Access the base64 string from the FileReader result
    userData.file = {
      data: base64String,
      mime_type: file.type,
    };
    fileInput.value = ""; // Clear the file input after reading
  };
  reader.readAsDataURL(file); // Start reading the file
});

//cancel file upload
fileCancelButton.addEventListener("click", () => {
    userData.file = {};
    fileInput.value = "";
    fileUploadWrapper.classList.remove('file-uploaded')
    fileUploadWrapper.querySelector('img').src = "";
})

const picker = new EmojiMart.Picker({
    theme: "light",
    skinTonePosition: "none",
    previewPosition: "none",
    onEmojiSelect: (emoji) => {
        const { selectionStart: start, selectionEnd: end } = messageInput;
        messageInput.setRangeText(emoji.native, start, end, "end");
        messageInput.focus();
    },
    onClickOutside: (e) => {
        if (e.target.id === 'emoji') {
            document.body.classList.toggle("show-emoji-picker");
        } else {
            document.body.classList.remove("show-emoji-picker");
        }
    }
});
document.querySelector(".chat-form").appendChild(picker);
document.getElementById('file-upload').addEventListener("click", () => fileInput.click())
chatbotToggler.addEventListener('click', () =>  document.body.classList.toggle('show-chatbot') )
closeChatbot.addEventListener('click', () =>  document.body.classList.remove('show-chatbot') )