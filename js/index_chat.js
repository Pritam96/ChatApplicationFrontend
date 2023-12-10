function setCurrentChat(chat) {
  localStorage.setItem("currentChat", JSON.stringify(chat));
}

function getCurrentChat() {
  const chat = localStorage.getItem("currentChat");
  if (!chat) {
    return null;
  }
  return JSON.parse(chat);
}

const chatContent = document.getElementById("chat-content");

// Fetching all chats for the current user
async function fetchAllChats() {
  try {
    const response = await axios.get(CHAT_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    chatContent.innerHTML = "";
    if (response.data.count > 0) {
      createChatUserElement(response.data.data);
    } else {
      const p = document.createElement("p");
      p.classList.add("not-found");
      p.innerText = "No chats available";
      chatContent.appendChild(p);
    }
  } catch (error) {
    console.log(error);
  }
}

// Create chat users element
function createChatUserElement(chats) {
  chats.forEach((chat) => {
    let cardTitle;
    let cardText = "";
    if (chat.isGroupChat) {
      cardTitle = chat.chatName;
    } else {
      chat.users.forEach((user) => {
        if (user._id !== currentlyLoggedUser._id) cardTitle = user.name;
      });
    }

    if (chat.latestMessage) {
      cardText = chat.latestMessage.content;
    } else {
      cardText = "No messages available";
    }

    const card = document.createElement("div");
    card.classList.add("card", "mb-2", "bg-light", "card_user");

    // Set active a chat
    if (getCurrentChat())
      if (chat._id === getCurrentChat()._id) {
        card.classList.add("active");
      }

    const card_body = document.createElement("div");
    card_body.classList.add("card-body");
    const card_title = document.createElement("h6");
    card_title.classList.add("card-title");
    const span = document.createElement("span");
    span.classList.add("float-end", "badge", "bg-dark");

    // span text (chat updated time)
    span.append(getNormalDateTime(chat.updatedAt));

    // card title (User name / group name)
    card_title.append(cardTitle, span);
    const card_text = document.createElement("p");
    // card_text.classList.add("card-text", "card-message");
    card_text.classList.add("card-text");

    // card text (latest message)
    if (chat.latestMessage) {
      const strong_text = document.createElement("span");
      strong_text.classList.add("sender-name");
      strong_text.innerText = `${chat.latestMessage.sender.name}: `;
      card_text.appendChild(strong_text);
    }

    card_text.appendChild(document.createTextNode(cardText));
    card_body.append(card_title, card_text);
    card.append(card_body);

    // add to the chat-content element
    chatContent.append(card);

    // Click chat user to get all messages and start chat
    card_body.addEventListener("click", async (e) => {
      setCurrentChat(chat);
      selectedUsers.length = 0;
      existingUsers.length = 0;
      await fetchAllChats();
      await getMessages();
    });
  });
}
