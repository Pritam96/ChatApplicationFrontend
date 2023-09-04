const loginForm = document.querySelector('#login-form');
const alertBox = document.querySelector('#alert-box');

loginForm.addEventListener('submit', login);

async function login(event) {
  event.preventDefault();
  const email = document.querySelector('#email').value.trim().toLowerCase();
  const password = document.querySelector('#password').value.trim();

  alertBox.textContent = '';

  try {
    const response = await axios.post(
      'http://localhost:4000/api/v1/auth/login',
      {
        email,
        password,
      }
    );
    loginForm.reset();
    alertBox.style.color = 'green';
    alertBox.textContent = 'logged in successfully.';
    setTimeout(() => {
      window.location.href = './index.html';
    }, 3000);
  } catch (error) {
    alertBox.style.color = 'red';
    if (error.response.data) {
      alertBox.textContent = '* ' + error.response.data.error;
    } else {
      console.log(error);
      alertBox.textContent = '* ' + error.message;
    }
  }
}
