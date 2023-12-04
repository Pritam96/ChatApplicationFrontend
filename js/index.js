// Retrieve token from the localStorage
const token = localStorage.getItem("token");

// Check the token
if (!token) {
  alert("Authorization error. Please login again.");
  window.location.href = "./login.html";
}

let currentlyLoggedUser;
let selectedUsers = [];
let existingUsers = [];

document.addEventListener("DOMContentLoaded", async function () {
  const searchBar = document.querySelector("#search");
  const sidebar = document.getElementById("sidebar");
  const searchInput = document.querySelector("#searchInput");

  searchBar.addEventListener("focus", function () {
    // Show the sidebar by setting its left position to 0
    sidebar.style.left = "0";
    searchInput.focus();
  });

  // Close the sidebar when clicking anywhere outside of it
  document.addEventListener("click", function (e) {
    if (!sidebar.contains(e.target) && e.target !== searchBar) {
      sidebar.style.left = "-35%";
    }
  });

  currentlyLoggedUser = await getCurrentUser();
  showUserInfo();
  await fetchAllChats();
  await getMessages();
});

function scrollToBottom() {
  var messageBox = document.getElementById("message-content");
  messageBox.scrollTop = messageBox.scrollHeight;
}

function getNormalDateTime(date) {
  return new Date(date).toLocaleString();
}

// Logged userinfo show
const userInfoField = document.getElementById("user-info-button");

function showUserInfo() {
  const a = document.createElement("a");
  a.className = "nav-link";
  const i = document.createElement("i");
  i.classList.add("fas", "fa-user");
  const text = document.createTextNode(` Hello, ${currentlyLoggedUser.name}`);
  a.appendChild(i);
  a.appendChild(text);
  userInfoField.appendChild(a);
}

const logoutElement = document.getElementById("logout-button");

// Logout handler
logoutElement.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("currentChat");
  localStorage.removeItem("token");
  window.location.href = "./login.html";
});
