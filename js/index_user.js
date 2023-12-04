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
    console.log(error);
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
    messageInput.focus();
  } catch (error) {
    console.log(error);
  }
}
