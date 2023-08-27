const login_form = document.querySelector('#login-form');
const alert_box = document.querySelector('#alert');

login_form.addEventListener('submit', login);

async function login(event) {
  event.preventDefault();
  const email = document.querySelector('#email').value.trim().toLowerCase();
  const password = document.querySelector('#password').value.trim();

  alert_box.textContent = '';

  try {
    const response = await axios.post(
      'http://localhost:4000/api/v1/auth/login',
      {
        email,
        password,
      }
    );
    login_form.reset();
    alert_box.className = 'alert';
    // alert_box.style.color = 'green';
    alert_box.textContent = 'logged in successfully.';
  } catch (error) {
    // alert_box.style.color = 'red';
    alert_box.className = 'alert error-alert';
    if (error.response.data) {
      alert_box.textContent = error.response.data.error;
    } else {
      console.log(error);
      alert_box.textContent = error.message;
    }
  }
}
