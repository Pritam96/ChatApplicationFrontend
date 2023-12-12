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
      p.id = "message-not-found";
      p.classList.add("not-found");
      p.innerText = "No messages available";
      messageContent.appendChild(p);
    }

    scrollToBottom();
  } catch (error) {
    if (error.response.data) console.log(error.response.data.error);
    else console.log(error);
    showToast("Something went wrong!", "danger");
  }
}

// Creating Message Element UI
async function createMessageElement(message) {
  const outer_card_body = document.createElement("div");
  outer_card_body.classList.add("card-body");
  const card = document.createElement("div");
  // card.classList.add("card", "col-7", "mb-3");
  card.classList.add("card", "mb-3", "card-message");
  outer_card_body.append(card);
  const inner_card_body = document.createElement("div");
  inner_card_body.classList.add("card-body");
  const card_title = document.createElement("h6");
  card_title.classList.add("card-title");

  // Chat User name
  card_title.textContent = message.sender.name;

  const span = document.createElement("span");
  span.classList.add("float-end", "badge");

  // Message timestamp
  span.textContent = getNormalDateTime(message.createdAt);

  // Message content
  if (message.content) {
    const card_text = document.createElement("p");
    card_text.classList.add("card-text");
    card_text.textContent = message.content;
    inner_card_body.append(card_title, card_text, span);
  } else {
    // Multimedia content
    const img = document.createElement("img");
    img.src = message.fileUrl;
    img.classList.add("img-fluid", "rounded", "mb-2");
    img.alt = "img-fluid";
    inner_card_body.append(card_title, img, span);
    img.addEventListener("click", () => {
      window.open(message.fileUrl, "_blank");
    });
  }

  card.append(inner_card_body);

  if (message.sender._id === currentlyLoggedUser._id) {
    card.classList.add("text-light", "bg-secondary", "float-end", "mx-2");
  } else {
    card.classList.add("border-secondary", "float-start", "mx-2");
  }
  span.classList.add("bg-dark");
  messageContent.append(outer_card_body);
}

// Sending a message
const sendMessageForm = document.getElementById("send-message-form");
const messageInput = document.getElementById("input-message");
const fileInput = document.getElementById("input-file");

fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) {
    messageInput.value = fileInput.files[0].name;
    messageInput.disabled = true;
  }
});

sendMessageForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const chat = getCurrentChat();

  if (!chat) {
    console.log("chatId not found");
    return;
  }

  let content = messageInput.value.trim();
  const file = fileInput.files[0];

  if (!content && !file) {
    console.log("blank message field");
    return;
  }

  const formData = new FormData();
  formData.append("chatId", chat._id);
  if (file) {
    formData.append("file", file);
  } else {
    formData.append("content", content);
  }

  try {
    const response = await axios.post(MESSAGE_URL, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const message = response.data.data;

    messageInput.value = "";
    fileInput.value = "";

    // Remove not-found element, for very first message of a chat
    const not_found_element = document.getElementById("message-not-found");
    if (not_found_element) not_found_element.remove();

    createMessageElement(message);
    // console.log(message_obj);

    // send message to server
    socket.emit("send-message", message);

    scrollToBottom();
    await fetchAllChats();
  } catch (error) {
    if (error.response.data) showToast(error.response.data.error, "danger");
    else console.log(error);
  }
});
