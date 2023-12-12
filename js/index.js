const socket = io(ENDPOINT);

// Retrieve token from the localStorage
const token = localStorage.getItem("token");

// Check the token
if (!token) {
  // alert("Authorization error. Please login again.");
  showToast("Authorization error. Please login again.", "danger");
  window.location.href = "./login.html";
}

socket.on("receive-message", (message) => {
  createMessageElement(message);
  scrollToBottom();
  fetchAllChats();
});

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

// Runs every time when we connect to the server
socket.on("connect", async () => {
  console.log(`You connected with id: ${socket.id}`);

  const user = await getCurrentUser();

  // Create a room with current user._id and send to the server
  socket.emit("join-room", user._id, (message) => {
    console.log(message);
  });
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
  // Emit the "disconnect-and-leave-room" event to the server
  socket.emit("disconnect-and-leave-room", {}, () => {
    console.log("disconnected");
  });
  window.location.href = "./login.html";
});