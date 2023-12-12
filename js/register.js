const registrationForm = document.querySelector("#registration-form");

registrationForm.addEventListener("submit", register);

async function register(event) {
  event.preventDefault();
  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim().toLowerCase();
  const phone = document.querySelector("#phone").value;
  const password = document.querySelector("#password").value.trim();

  try {
    const response = await axios.post(`${AUTH_URL}/register`, {
      name,
      email,
      phone,
      password,
    });

    // Saving the token in localStorage
    localStorage.setItem("token", response.data.token);

    registrationForm.reset();

    showToast("User successfully registered", "success");
  } catch (error) {
    if (error.response.data) showToast(error.response.data.error, "danger");
    else {
      showToast("Something went wrong!", "danger");
      console.log(error);
    }
  }
}
