// modal content of create group section
const modalContent = document.getElementById("content-modal");
const searchUser = document.getElementById("groupSearchUser");

// Search user from create group section
searchUser.addEventListener("input", async (e) => {
  await searchUserHandler(modalContent, searchUser);
});

const modalSelectedUserSection = document.getElementById("selected-user");

// User button UI after selecting a searched user
function createSelectedUserButton(userId, userFirstName, parentElement) {
  const userButton = document.createElement("button");
  userButton.classList.add("btn", "btn-sm", "btn-primary", "mb-3", "me-2");
  userButton.setAttribute("id", `button${userId}`);
  const icon = document.createElement("i");
  icon.classList.add("fa-solid", "fa-x");
  userButton.append(`${userFirstName} `, icon);
  parentElement.append(userButton);

  userButton.onclick = () => {
    selectedUsers = selectedUsers.filter((id) => id !== userId);
    document.getElementById(`button${userId}`).remove();
  };
}

const createGroupButton = document.getElementById("create-group-button");

// Create new group
createGroupButton.addEventListener("click", async () => {
  const groupNameInput = document
    .getElementById("create-group-name")
    .value.trim();

  if (groupNameInput === "" || selectedUsers.length < 2) {
    return alert("Give a group name and add at last two members.");
  }

  try {
    const response = await axios.post(
      `${CHAT_URL}/group`,
      {
        name: groupNameInput,
        users: JSON.stringify(selectedUsers),
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setCurrentChat(response.data.data);

    document.getElementById("create-group-name").value = "";
    modalSelectedUserSection.innerHTML = "";
    modalContent.innerHTML = "";
    searchUser.value = "";

    selectedUsers = [];
    chatContent.innerHTML = "";
    fetchAllChats();
  } catch (error) {
    console.log(error);
  }
});

// modal content of update group section
const modalExistingUserSection = document.getElementById("existing-user");
const eyeButton = document.getElementById("eye-button");

// Eye Button for rename a group chat and add or remove members
eyeButton.addEventListener("click", () => {
  document.getElementById("groupChatUpdateModalLabel").innerText =
    getCurrentChat().chatName;
  modalExistingUserSection.innerHTML = "";
  updateModalContent.innerHTML = "";
  searchInputUpdate.value = "";
  selectedUsers = [];
  existingUsers = [];

  getCurrentChat().users.filter((user) => {
    if (user._id !== getCurrentChat()._id) {
      selectedUsers.push(user._id);
      existingUsers.push(user._id);
      createSelectedUserButton(
        user._id,
        user.name.split(" ")[0],
        modalExistingUserSection
      );
    }
  });
});

const updateGroupButton = document.getElementById("update-group-button");

// Update Group Name & Add or Remove members in the current group
updateGroupButton.addEventListener("click", async () => {
  const updatedGroupName = document
    .getElementById("update-group-name")
    .value.trim();
  if (updatedGroupName !== "") {
    try {
      const response = await axios.put(
        `${CHAT_URL}/rename`,
        {
          chatId: getCurrentChat()._id,
          chatName: updatedGroupName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Changed Group Name: ", updatedGroupName);
    } catch (error) {
      console.log(error);
    }
  }

  const added = selectedUsers.filter((userId) => {
    return existingUsers.indexOf(userId) === -1;
  });

  // Add users to group one by one
  added.forEach(async (userId) => {
    try {
      const response = await axios.put(
        `${CHAT_URL}/groupadd`,
        {
          chatId: getCurrentChat()._id,
          userId: userId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("User added: ", userId);
    } catch (error) {
      console.log(error);
    }
  });

  const removed = existingUsers.filter((userId) => {
    return selectedUsers.indexOf(userId) === -1;
  });

  removed.forEach(async (userId) => {
    try {
      const response = await axios.put(
        `${CHAT_URL}/groupremove`,
        {
          chatId: getCurrentChat()._id,
          userId: userId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("User Removed: ", userId);
    } catch (error) {
      console.log(error);
    }
  });

  chatContent.innerHTML = "";
  fetchAllChats();
});

const searchInputUpdate = document.querySelector("#groupSearchUserUpdate");
const updateModalContent = document.querySelector("#content-update-modal");

// Search user from update group section
searchInputUpdate.addEventListener("input", async (e) => {
  await searchUserHandler(updateModalContent, searchInputUpdate);
});
