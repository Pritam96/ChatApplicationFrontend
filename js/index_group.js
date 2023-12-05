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
    // when we click this button, it removes this user from selected user
    selectedUsers = selectedUsers.filter((id) => id !== userId);
    // remove user button element also
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

    selectedUsers.length = 0;
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
  document.getElementById("update-group-name").value = "";
  modalExistingUserSection.innerHTML = "";
  updateModalContent.innerHTML = "";
  searchInputUpdate.value = "";

  selectedUsers.length = 0;
  existingUsers.length = 0;

  getCurrentChat().users.filter((user) => {
    if (user._id !== currentlyLoggedUser._id) {
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
      setCurrentChat(response.data.data);
      console.log("Group name changed successfully");
    } catch (error) {
      console.log(error);
    }
  }

  // If selectedUsers is not equal to existingUsers, Update Group members
  if (!areArraysEqual(selectedUsers, existingUsers)) {
    if (getCurrentChat().groupAdmin._id !== currentlyLoggedUser._id) {
      alert("User is not authorized to update this group");
      return;
    }
    try {
      const response = await axios.put(
        `${CHAT_URL}/groupupdate`,
        {
          chatId: getCurrentChat()._id,
          updatedUsers: JSON.stringify(selectedUsers),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCurrentChat(response.data.data);
      console.log("Group members updated successfully");
    } catch (error) {
      console.log(error);
    }
  }

  await fetchAllChats();
  await getMessages();
});

function areArraysEqual(array1, array2) {
  // Check if the length of both arrays is the same
  if (array1.length !== array2.length) {
    return false;
  }

  // Check if every element of array1 is included in array2
  return array1.every((element) => array2.includes(element));
}

const searchInputUpdate = document.querySelector("#groupSearchUserUpdate");
const updateModalContent = document.querySelector("#content-update-modal");

// Search user from update group section
searchInputUpdate.addEventListener("input", async (e) => {
  await searchUserHandler(updateModalContent, searchInputUpdate);
});
