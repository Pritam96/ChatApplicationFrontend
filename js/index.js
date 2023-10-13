let currentUser;
let currentChat;
let selectedUsers = [];
let existingUsers = [];

// Sidebar workings
document.addEventListener('DOMContentLoaded', function () {
  const searchBar = document.querySelector('#search');
  const sidebar = document.getElementById('sidebar');
  const searchInput = document.querySelector('#searchInput');

  searchBar.addEventListener('focus', function () {
    // Show the sidebar by setting its left position to 0
    sidebar.style.left = '0';
    searchInput.focus();
  });

  // Close the sidebar when clicking anywhere outside of it
  document.addEventListener('click', function (e) {
    if (!sidebar.contains(e.target) && e.target !== searchBar) {
      sidebar.style.left = '-35%';
    }
  });

  // Fetching all chats
  fetchAllChats();
});

function scrollToBottom() {
  var messageBox = document.getElementById('message-content');
  messageBox.scrollTop = messageBox.scrollHeight;
}

// Retrieve token from the localStorage
const token = localStorage.getItem('token');

// Check the token
if (!token) {
  alert('Authorization error. Please login again.');
  window.location.href = './login.html';
}

function getNormalDateTime(date) {
  return new Date(date).toLocaleString();
}

getCurrentUser();

async function getCurrentUser() {
  try {
    const response = await axios.get(`${BASE_URL}/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    currentUser = response.data.data;
  } catch (error) {
    console.log(error);
  }
}

// Sidebar content
const sidebarContent = document.getElementById('sidebar-content');
const searchInput = document.querySelector('#searchInput');

let searchTimer;

// Search user implementation
searchInput.addEventListener('input', async (e) => {
  // Clear previous search timer
  clearTimeout(searchTimer);

  sidebarContent.innerHTML = 'Loading...';

  // Start a new search timer
  searchTimer = setTimeout(async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user?search=${searchInput.value.trim()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.data.length > 0) {
        sidebarContent.innerHTML = '';
        response.data.data.forEach((user) => {
          createSearchedUser(user, sidebarContent);
        });
      } else {
        sidebarContent.innerHTML = '';
        const p = document.createElement('p');
        p.classList.add('text-light', 'text-center');
        p.append('No users found with this keyword.');
        sidebarContent.append(p);
      }
    } catch (error) {
      console.log(error);
      sidebarContent.innerHTML = 'An error occurred while fetching data.';
    }
  }, 500); // Delay the search by 500 milliseconds after the user stops typing
});

// Create searched users element
function createSearchedUser(user, parentElement) {
  const card = document.createElement('div');
  card.classList.add('card', 'mb-2', 'bg-light');
  // const card_body = document.createElement('div');
  const card_body = document.createElement('a');
  // card_body.classList.add('card-body');
  card_body.classList.add(
    'card-body',
    'stretched-link',
    'text-decoration-none'
  );
  card_body.setAttribute('href', '');
  const card_title = document.createElement('h6');
  card_title.classList.add('card-title');

  // card title
  card_title.append(user.name);
  const card_text = document.createElement('p');
  card_text.classList.add('card-text', 'text-truncate');
  // card text
  card_text.textContent = user.email;
  card_body.append(card_title, card_text);
  card.append(card_body);

  // add to the sidebar element
  parentElement.append(card);
  if (parentElement === sidebarContent) {
    card_body.addEventListener('click', () => {
      // e.preventDefault();
      connectUser(user._id);
    });
  } else if (parentElement === modalContent) {
    card_body.addEventListener('click', (e) => {
      e.preventDefault();
      // Remove from seletedUsers
      if (selectedUsers.indexOf(user._id) > -1) {
        selectedUsers = selectedUsers.filter((id) => id !== user._id);
        // remove that userButton element
        document.getElementById(`button${user._id}`).remove();
      } else {
        // Add to seletedUsers
        selectedUsers.push(user._id);
        createSelectedUserButton(
          user._id,
          user.name.split(' ')[0],
          modalSelectedUserSection
        );
      }
      // console.log(selectedUsers);
    });
  } else if (parentElement === updateModalContent) {
    card_body.addEventListener('click', (e) => {
      e.preventDefault();
      // Remove from seletedUsers
      if (selectedUsers.indexOf(user._id) > -1) {
        selectedUsers = selectedUsers.filter((id) => id !== user._id);
        // remove that userButton element
        document.getElementById(`button${user._id}`).remove();
      } else {
        // Add to seletedUsers
        selectedUsers.push(user._id);
        createSelectedUserButton(
          user._id,
          user.name.split(' ')[0],
          modalExistingUserSection
        );
      }
      console.log(selectedUsers);
    });
  }
}

// Create or Access One to One chat with an user
async function connectUser(userId) {
  try {
    const response = await axios.post(
      `${BASE_URL}/chat`,
      {
        userId,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  } catch (error) {
    console.log(error);
  }
}

// Chat content
const chatContent = document.getElementById('chat-content');

// Fetching all chats for the current user
async function fetchAllChats() {
  try {
    const response = await axios.get(`${BASE_URL}/chat`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.data.length > 0) {
      // chatContent.innerHTML = '';
      response.data.data.forEach((chat) => {
        createChatUser(chat);
      });
    }
  } catch (error) {
    console.log(error);
  }
}

const chatWindow = document.getElementById('chat-window');
const chatUser = document.getElementById('chat-user');
const messageContent = document.getElementById('message-content');

// Create chat users element
function createChatUser(chat) {
  let cardTitle;
  let cardText = '';
  if (chat.isGroupChat) {
    cardTitle = chat.chatName;
  } else {
    cardTitle = chat.users[1].name;
  }

  if (chat.latestMessage) {
    cardText = chat.latestMessage.content;
  }
  const card = document.createElement('div');
  card.classList.add('card', 'mb-2', 'bg-light');
  // const card_body = document.createElement('div');
  const card_body = document.createElement('a');
  // card_body.classList.add('card-body');
  card_body.classList.add(
    'card-body',
    'stretched-link',
    'text-decoration-none'
  );
  card_body.setAttribute('href', '');
  const card_title = document.createElement('h6');
  card_title.classList.add('card-title');
  const span = document.createElement('span');
  span.classList.add('float-end', 'badge', 'bg-light', 'text-dark');
  // span text (chat updated time)
  span.append(getNormalDateTime(chat.updatedAt));
  // card title (User name or group name)
  card_title.append(cardTitle, span);
  const card_text = document.createElement('p');
  card_text.classList.add('card-text', 'card-message');
  // card text (latest message)
  card_text.textContent = cardText;
  card_body.append(card_title, card_text);
  card.append(card_body);

  // add to the chat-content element
  chatContent.append(card);

  // click chat user to chat
  card_body.addEventListener('click', async (e) => {
    e.preventDefault();
    selectedUsers = [];
    existingUsers = [];

    currentChat = chat;

    // If current chat is not  a group chat, then remove the eye-button
    if (chat.isGroupChat) {
      eyeButton.classList.remove('visually-hidden');
    } else {
      eyeButton.classList.add('visually-hidden');
    }

    // User name / Group Name
    chatUser.textContent = cardTitle;

    chatWindow.classList.remove('visually-hidden');
    // get all messages of the current chat
    try {
      const response = await axios.get(`${BASE_URL}/message/${chat._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      messageContent.innerHTML = '';
      response.data.data.forEach((message) => {
        createMessageElement(message);
      });

      scrollToBottom();
    } catch (error) {
      console.log(error);
    }
  });
}

// Message UI
function createMessageElement(message) {
  const card = document.createElement('div');
  card.classList.add('card', 'col-7', 'mb-3');
  const card_body = document.createElement('div');
  card_body.classList.add('card-body');
  const card_title = document.createElement('h6');
  card_title.classList.add('card-title');
  // Chat User name
  card_title.textContent = message.sender.name;
  const card_text = document.createElement('p');
  card_text.classList.add('card-text');
  // Message content
  card_text.textContent = message.content;
  const span = document.createElement('span');
  span.classList.add('float-end', 'badge');
  // Message timestamp
  span.textContent = getNormalDateTime(message.createdAt);
  card_body.append(card_title, card_text, span);
  card.append(card_body);

  if (message.sender._id === currentUser._id) {
    card.classList.add('text-light', 'bg-dark', 'float-end');
    span.classList.add('bg-dark');
  } else {
    card.classList.add('bg-light');
    span.classList.add('bg-light', 'text-dark');
  }

  messageContent.append(card);
}

// sending message
const messageInput = document.getElementById('input-message');
const sendButton = document.getElementById('send-message-button-right');

sendButton.addEventListener('click', async (e) => {
  e.preventDefault();

  if (!messageInput.value.trim()) {
    return;
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/message`,
      {
        chatId: currentChat._id,
        content: messageInput.value.trim(),
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    messageInput.value = '';
  } catch (error) {
    console.log(error);
  }
});

// modal content
const modalContent = document.getElementById('content-modal');
const searchUser = document.getElementById('groupSearchUser');

let searchUserTimer;

// Search user implementation
searchUser.addEventListener('input', async (e) => {
  // Clear previous search timer
  clearTimeout(searchTimer);

  modalContent.innerHTML = 'Loading...';

  // Start a new search timer
  searchUserTimer = setTimeout(async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user?search=${searchUser.value.trim()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.data.length > 0) {
        modalContent.innerHTML = '';
        response.data.data.forEach((user) => {
          createSearchedUser(user, modalContent);
        });
      } else {
        modalContent.innerHTML = '';
        const p = document.createElement('p');
        p.classList.add('text-light', 'text-center');
        p.append('No users found with this keyword.');
        modalContent.append(p);
      }
    } catch (error) {
      console.log(error);
      modalContent.innerHTML = 'An error occurred while fetching data.';
    }
  }, 500);
});

const modalSelectedUserSection = document.getElementById('selected-user');

// User button UI after selecting a searched user
function createSelectedUserButton(userId, userFirstName, parentElement) {
  const userButton = document.createElement('button');
  userButton.classList.add('btn', 'btn-sm', 'btn-primary', 'mb-3', 'me-2');
  userButton.setAttribute('id', `button${userId}`);
  const icon = document.createElement('i');
  icon.classList.add('fa-solid', 'fa-x');
  userButton.append(`${userFirstName} `, icon);
  parentElement.append(userButton);

  userButton.onclick = () => {
    selectedUsers = selectedUsers.filter((id) => id !== userId);
    document.getElementById(`button${userId}`).remove();
  };
}

const createGroupButton = document.getElementById('create-group-button');

// Create new group button
createGroupButton.addEventListener('click', async () => {
  const groupNameInput = document
    .getElementById('create-group-name')
    .value.trim();

  if (groupNameInput === '' || selectedUsers.length < 2) {
    return alert('Give a group name and add at last two members.');
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/chat/group`,
      {
        name: groupNameInput,
        users: JSON.stringify(selectedUsers),
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response) {
      currentChat = document.getElementById('create-group-name').value = '';
      modalSelectedUserSection.innerHTML = '';
      modalContent.innerHTML = '';
      searchUser.value = '';

      selectedUsers = [];
      chatContent.innerHTML = '';
      fetchAllChats();
    }
  } catch (error) {
    console.log(error.response.data);
  }
});

const modalExistingUserSection = document.getElementById('existing-user');
const eyeButton = document.getElementById('eye-button');

// Eye Button for rename a group chat and add or remove members
eyeButton.addEventListener('click', () => {
  document.getElementById('groupChatUpdateModalLabel').innerText =
    currentChat.chatName;
  modalExistingUserSection.innerHTML = '';
  updateModalContent.innerHTML = '';
  searchInputUpdate.value = '';
  selectedUsers = [];
  existingUsers = [];

  currentChat.users.filter((user) => {
    if (user._id !== currentUser._id) {
      selectedUsers.push(user._id);
      existingUsers.push(user._id);
      createSelectedUserButton(
        user._id,
        user.name.split(' ')[0],
        modalExistingUserSection
      );
    }
  });

  // console.log(selectedUsers);
});

const updateGroupButton = document.getElementById('update-group-button');

// Update Group Name & Add or Remove members in the current group
updateGroupButton.addEventListener('click', async () => {
  const updatedGroupName = document
    .getElementById('update-group-name')
    .value.trim();
  if (updatedGroupName !== '') {
    try {
      const response = await axios.put(
        `${BASE_URL}/chat/rename`,
        {
          chatId: currentChat._id,
          chatName: updatedGroupName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response) {
        console.log('Changed Group Name: ', updatedGroupName);
        // fetchAllChats();
      }
    } catch (error) {
      console.log(error.response.data);
    }
  }

  const added = selectedUsers.filter((userId) => {
    return existingUsers.indexOf(userId) === -1;
  });

  // console.log('ADDED: ', added);

  added.forEach(async (userId) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/chat/groupadd`,
        {
          chatId: currentChat._id,
          userId: userId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response) {
        console.log('User added: ', userId);
        // fetchAllChats();
      }
    } catch (error) {
      console.log(error.response.data);
    }
  });

  const removed = existingUsers.filter((userId) => {
    return selectedUsers.indexOf(userId) === -1;
  });

  // console.log('REMOVED: ', removed);
  removed.forEach(async (userId) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/chat/groupremove`,
        {
          chatId: currentChat._id,
          userId: userId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response) {
        console.log('User Removed: ', userId);
        // fetchAllChats();
      }
    } catch (error) {
      console.log(error.response.data);
    }
  });

  chatContent.innerHTML = '';
  fetchAllChats();
});

const searchInputUpdate = document.querySelector('#groupSearchUserUpdate');
const updateModalContent = document.querySelector('#content-update-modal');

searchInputUpdate.addEventListener('input', async (e) => {
  clearTimeout(searchTimer);

  searchTimer = setTimeout(async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user?search=${searchInputUpdate.value.trim()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.data.length > 0) {
        updateModalContent.innerHTML = '';
        response.data.data.forEach((user) => {
          createSearchedUser(user, updateModalContent);
        });
      } else {
        updateModalContent.innerHTML = '';
        const p = document.createElement('p');
        p.classList.add('text-light', 'text-center');
        p.append('No users found with this keyword.');
        updateModalContent.append(p);
      }
    } catch (error) {
      console.log(error);
      updateModalContent.innerHTML = 'An error occurred while fetching data.';
    }
  }, 500); // Delay the search by 500 milliseconds after the user stops typing
});
