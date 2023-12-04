// Sidebar content
const sidebarContent = document.getElementById("sidebar-content");
const searchInput = document.querySelector("#searchInput");

// Search user from sidebar
searchInput.addEventListener("input", async () => {
  await searchUserHandler(sidebarContent, searchInput);
});

let searchTimer;

async function searchUserHandler(parentElement, inputKeyword) {
  // Clear previous search timer
  clearTimeout(searchTimer);

  parentElement.innerHTML = `<p class="text-center">Loading...</p>`;

  // Start a new search timer
  searchTimer = setTimeout(async () => {
    try {
      const response = await axios.get(
        `${USER_URL}?search=${inputKeyword.value.trim()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      parentElement.innerHTML = "";
      if (response.data.count > 0) {
        response.data.data.forEach((user) => {
          createSearchedUser(user, parentElement);
        });
      } else {
        const p = document.createElement("p");
        p.classList.add("text-light", "text-center");
        p.append("No users found with this keyword.");
        parentElement.append(p);
      }
    } catch (error) {
      console.log(error);
      parentElement.innerHTML = `<p class="text-light text-center">An error occurred while fetching data</p>`;
    }
  }, 500);
}

// Create searched users element
function createSearchedUser(user, parentElement) {
  const card = document.createElement("div");
  card.classList.add("card", "mb-2", "bg-light", "card_user");
  const card_body = document.createElement("div");
  card_body.classList.add("card-body");
  const card_title = document.createElement("h6");
  card_title.classList.add("card-title");

  // Card title - user name
  card_title.append(user.name);
  const card_text = document.createElement("p");
  card_text.classList.add("card-text", "text-truncate");
  // Card text - email id
  card_text.textContent = user.email;
  card_body.append(card_title, card_text);
  card.append(card_body);

  // Add to the sidebar element
  parentElement.append(card);

  card_body.addEventListener("click", async () => {
    if (parentElement === sidebarContent) {
      await connectUser(user._id);
      document.getElementById("sidebar").style.left = "-35%";
    } else if (parentElement === modalContent) {
      // Remove from selectedUsers
      if (selectedUsers.indexOf(user._id) > -1) {
        selectedUsers = selectedUsers.filter((id) => id !== user._id);
        // Remove userButton element
        document.getElementById(`button${user._id}`).remove();
      } else {
        // Add to selectedUsers
        selectedUsers.push(user._id);
        createSelectedUserButton(
          user._id,
          user.name.split(" ")[0],
          modalSelectedUserSection
        );
      }
    } else if (parentElement === updateModalContent) {
      // Remove from selectedUsers
      if (selectedUsers.indexOf(user._id) > -1) {
        selectedUsers = selectedUsers.filter((id) => id !== user._id);
        // Remove that userButton element
        document.getElementById(`button${user._id}`).remove();
      } else {
        // Add to selectedUsers
        selectedUsers.push(user._id);
        createSelectedUserButton(
          user._id,
          user.name.split(" ")[0],
          modalExistingUserSection
        );
      }
    }
  });
}
