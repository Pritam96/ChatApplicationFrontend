const messageContent = document.getElementById("message-content");

// Get all messages from current chat
async function getMessages() {
  const chatWindow = document.getElementById("chat-window");
  const chatUser = document.getElementById("chat-user");
  let chatTitle;

  const chat = getCurrentChat();
  if (!chat) {
    console.log("currentChat not exist in localStorage");
    return;
  }

  // If current chat is not a group chat, then remove the eye-button
  if (chat.isGroupChat) {
    eyeButton.classList.remove("visually-hidden");
    chatTitle = chat.chatName;
  } else {
    eyeButton.classList.add("visually-hidden");
    chat.users.forEach((user) => {
      if (user._id !== currentlyLoggedUser._id) chatTitle = user.name;
    });
  }

  // User name / Group Name
  chatUser.textContent = chatTitle;

  chatWindow.classList.remove("visually-hidden");
  // Get all messages of the current chat
  try {
    const response = await axios.get(`${MESSAGE_URL}/${chat._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    messageContent.innerHTML = "";
    if (response.data.count > 0) {
      response.data.data.forEach((message) => {
        createMessageElement(message);
      });
    } else {
      const p = document.createElement("p");
      p.classList.add("not-found");
      p.innerText = "No messages available";
      messageContent.appendChild(p);
    }

    scrollToBottom();
  } catch (error) {
    console.log(error);
  }
}

// Creating Message Element UI
async function createMessageElement(message) {
  const card = document.createElement("div");
  card.classList.add("card", "col-7", "mb-3");
  const card_body = document.createElement("div");
  card_body.classList.add("card-body");
  const card_title = document.createElement("h6");
  card_title.classList.add("card-title");

  // Chat User name
  card_title.textContent = message.sender.name;
  const card_text = document.createElement("p");
  card_text.classList.add("card-text");

  // Message content
  card_text.textContent = message.content;
  const span = document.createElement("span");
  span.classList.add("float-end", "badge");

  // Message timestamp
  span.textContent = getNormalDateTime(message.createdAt);
  card_body.append(card_title, card_text, span);
  card.append(card_body);

  if (message.sender._id === currentlyLoggedUser._id) {
    card.classList.add("text-light", "bg-secondary", "float-end", "mx-2");
  } else {
    card.classList.add("border-secondary", "mx-2");
  }
  span.classList.add("bg-dark");
  messageContent.append(card);
}

// Sending a message
const messageInput = document.getElementById("input-message");
const sendButton = document.getElementById("send-message-button-right");

sendButton.addEventListener("click", async (e) => {
  const chat = getCurrentChat();
  const message = messageInput.value.trim();

  if (!chat) {
    console.log("ChatId not found");
    return;
  }

  if (!message) {
    console.log("Blank message field");
    return;
  }

  try {
    const response = await axios.post(
      MESSAGE_URL,
      {
        chatId: chat._id,
        content: message,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    messageInput.value = "";
    createMessageElement(response.data.data);
    scrollToBottom();
    await fetchAllChats();
  } catch (error) {
    console.log(error);
  }
});
