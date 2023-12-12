async function getCurrentUser() {
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    return JSON.parse(currentUser);
  }

  try {
    const response = await axios.get(`${USER_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const userData = response.data.data;
    localStorage.setItem("currentUser", JSON.stringify(userData));
    return userData;
  } catch (error) {
    if (error.response.data) console.log(error.response.data.error);
    else console.log(error);
    showToast("Something went wrong!", "danger");
  }
}

// Create or Access One to One chat with an user
async function connectUser(userId) {
  try {
    const response = await axios.post(
      CHAT_URL,
      {
        userId,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setCurrentChat(response.data.data);

    await fetchAllChats();
    await getMessages();
    messageInput.focus();
  } catch (error) {
    if (error.response.data) console.log(error.response.data.error);
    else console.log(error);
    showToast("Something went wrong!", "danger");
  }
}
