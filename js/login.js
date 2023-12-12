const loginForm = document.querySelector("#login-form");

loginForm.addEventListener("submit", login);

async function login(event) {
  event.preventDefault();
  const email = document.querySelector("#email").value.trim().toLowerCase();
  const password = document.querySelector("#password").value.trim();

  try {
    const response = await axios.post(`${AUTH_URL}/login`, {
      email,
      password,
    });

    // Saving the token in localStorage
    localStorage.setItem("token", response.data.token);

    loginForm.reset();

    showToast("User logged in successfully", "success");
    setTimeout(() => {
      window.location.href = "./index.html";
    }, 3000);
  } catch (error) {
    if (error.response.data) showToast(error.response.data.error, "danger");
    else {
      showToast("Something went wrong!", "danger");
      console.log(error);
    }
  }
}
